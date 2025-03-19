const router = require("express").Router();
const query = require("../../database/query")
const authMiddleware = require("../../middleware/auth.middleware")

/* 
GET /api/colleges - Retrieve a ranked list of colleges based on antisemitism response.  
GET /api/colleges/{id} - Retrieve details about a specific college, including incidents and policies.  
PUT /api/colleges/{id} - Update information about a specific college.  
*/

router.get("/", async (req, res) => {
    try {
        const colleges = await query("SELECT * FROM colleges ORDER BY ranking DESC");
        return res.status(200).json({ colleges })
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve colleges", message: err.message })
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

router.put("/colleges/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role != "superadmin" && req.user.role != "editor")
            return res.status(403).json({ error: "Unauthorized" });

        const { id } = req.params;
        const { name, description, location, website, ranking } = req.body;

        const existingCollege = await query("SELECT * FROM colleges WHERE id = ?", [id]);
        if (!existingCollege || existingCollege.length === 0) {
            return res.status(404).json({ error: "College not found." });
        }

        await query(
            `UPDATE colleges SET 
              name = COALESCE(?, name), 
              description = COALESCE(?, description), 
              location = COALESCE(?, location), 
              website = COALESCE(?, website), 
              ranking = COALESCE(?, ranking) 
            WHERE id = ?`,
            [name, description, location, website, ranking, id]
        );

        return res.status(200).json({ message: "College updated successfully." });
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve colleges", message: err.message })
    }
})

router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role != "superadmin" && req.user.role != "editor")
            return res.status(403).json({ error: "Unauthorized" });

        const { name, description, location, website, ranking } = req.body;

        if (!name || !location || !website) {
            return res.status(400).json({ error: "Missing required college information." });
        }

        const id = crypto.randomUUID();
        await query(
            `INSERT INTO colleges (id, name, description, location, website, ranking) 
         VALUES (?, ?, ?, ?, ?, ?)`,
            [id, name, description, location, website, ranking || null]
        );

        return res.status(201).json({ message: "College added successfully.", id });
    } catch (err) {
        return res.status(500).json({ error: "Failed to add college." });
    }
});

module.exports = router;