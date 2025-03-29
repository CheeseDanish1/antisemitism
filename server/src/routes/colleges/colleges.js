const router = require("express").Router();
const query = require("../../database/query")
const authMiddleware = require("../../middleware/auth.middleware")
const crypto = require('crypto')
const upload = require('../../middleware/upload.middleware.js')
const fs = require('fs')
const path = require('path')

const removeBanner = async (bannerPath) => {
    if (bannerPath) {
        try {
            const fullPath = path.join(process.cwd(), bannerPath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        } catch (error) {
            console.error('Error removing banner:', error);
        }
    }
};

router.get("/", async (req, res) => {
    try {
        const colleges = await query("SELECT * FROM colleges ORDER BY ranking DESC");

        const incidentCounts = await query("SELECT college_id, COUNT(*) as incident_count FROM incidents GROUP BY college_id");

        const incidentCountMap = {};
        incidentCounts.forEach(item => {
            incidentCountMap[item.college_id] = item.incident_count;
        });

        const collegesWithIncidents = colleges.map(college => ({
            ...college,
            incidents: incidentCountMap[college.id] || 0 // Default to 0 if no incidents found
        }));

        return res.status(200).json({ colleges: collegesWithIncidents });
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve colleges", message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const college = await query("SELECT * FROM colleges WHERE id=? LIMIT 1", [id]);
        if (!college || college.length == 0) return res.status(404).json({ error: "College not found." });

        const incidents = await query("SELECT * FROM incidents WHERE college_id=?", [id]);
        return res.status(200).json({ college: college[0], incidents });
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve colleges", message: err.message })
    }
})

// Require banner on creation
router.post("/", authMiddleware, upload.single('banner'), async (req, res) => {
    try {
        if (req.user.role !== "superadmin" && req.user.role !== "editor") {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(403).json({ error: "Unauthorized" });
        }

        if (!req.file) return res.status(400).json({ error: "No banner image provided." });

        const banner_path = `/uploads/banners/${req.file.filename}`;

        const { name, description, location, website, ranking } = req.body;

        if (!name || !location || !website) {
            if (banner_path) await removeBanner(banner_path);

            return res.status(400).json({ error: "Missing required college information." });
        }

        const id = crypto.randomUUID();

        await query(
            `INSERT INTO colleges (id, name, description, location, website, ranking, banner_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, name, description, location, website, ranking || null, banner_path || null]
        );

        return res.status(201).json({
            message: "College added successfully.",
            id,
            banner_path
        });
    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);

        console.error('Error adding college:', err);
        return res.status(500).json({ error: "Failed to add college." });
    }
});

// Maybe they don't want to update the banner
router.put("/:id", authMiddleware, upload.single('banner'), async (req, res) => {
    try {
        if (req.user.role !== "superadmin" && req.user.role !== "editor") {
            if (req.file) fs.unlinkSync(req.file.path); // Clean up file on auth failure
            return res.status(403).json({ error: "Unauthorized" });
        }

        const { id } = req.params;
        const { name, description, location, website, ranking } = req.body;

        if (!name || !location || !website) {
            if (req.file) fs.unlinkSync(req.file.path); // Clean up file on validation failure
            return res.status(400).json({ error: "Missing required college information." });
        }

        // Get existing record to check current banner
        const [currentCollege] = await query(
            `SELECT * FROM colleges WHERE id = ?`,
            [id]
        );

        if (!currentCollege) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: "College not found." });
        }

        let banner_path = currentCollege.banner_path; // Default to keeping current banner

        // If new file uploaded, update path and remove old banner
        if (req.file) {
            const newBannerPath = `/uploads/banners/${req.file.filename}`;
            // Remove old banner before setting new one
            if (banner_path) {
                await removeBanner(banner_path);
            }
            banner_path = newBannerPath;
        }

        await query(
            `UPDATE colleges
             SET name = ?, description = ?, location = ?, website = ?, ranking = ?, banner_path = ?
             WHERE id = ?`,
            [name, description, location, website, ranking || null, banner_path, id]
        );

        return res.status(200).json({
            message: "College updated successfully.",
            id,
            banner_path
        });
    } catch (err) {
        // Clean up uploaded file on error
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Error updating college:', err);
        return res.status(500).json({ error: "Failed to update college." });
    }
});

router.delete("/:id/banner", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "superadmin" && req.user.role !== "editor") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const { id } = req.params;

        const [college] = await query('SELECT banner_path FROM colleges WHERE id = ?', [id]);

        if (college && college.banner_path) {
            await removeBanner(college.banner_path);

            await query(
                `UPDATE colleges SET banner_path = NULL WHERE id = ?`,
                [id]
            );
        }

        return res.status(200).json({ message: "College banner removed successfully." });
    } catch (err) {
        console.error('Error removing college banner:', err);
        return res.status(500).json({ error: "Failed to remove college banner." });
    }
});

module.exports = router;