const router = require("express").Router();
const query = require("../../database/query.js");
const { v4: uuid } = require("uuid");
const authMiddleware = require("../../middleware/auth.middleware.js");

/* 
GET /api/petition/signatures - Retrieve a list of petition signatures.  
POST /api/petition/sign - Add a new signature to the petition.  
DELETE /api/petition/signatures/{id} - Remove a specific signature.  
GET /api/petition/stats - Get total signers and breakdown per college.
*/

router.get("/signatures", authMiddleware, async (req, res) => {
    try {
        const signatures = await query(
            "SELECT id, signer_name, high_school_name, graduation_year, email, reason, signed_at FROM petition_signatures ORDER BY signed_at DESC"
        );
        return res.status(200).json(signatures);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/sign", async (req, res) => {
    try {
        const { signer_name, high_school_name, email, graduation_year, reason, college_ids } = req.body;

        if (!signer_name || !email || !graduation_year || !college_ids || college_ids.length === 0)
            return res.status(400).json({ error: "Missing required fields or no colleges selected." });

        const signatureId = uuid();

        await query(
            "INSERT INTO petition_signatures (id, signer_name, high_school_name, email, graduation_year, reason) VALUES (?, ?, ?, ?, ?, ?)",
            [signatureId, signer_name, high_school_name, email, graduation_year, reason || ""]
        );

        for (const collegeId of college_ids)
            await query(
                "INSERT INTO petition_boycott_colleges (id, signature_id, college_id) VALUES (?, ?, ?)",
                [uuid(), signatureId, collegeId]
            );


        return res.status(201).json({ message: "Signature added successfully!" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "You have already signed the petition." });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
});

router.delete("/signatures/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query("DELETE FROM petition_signatures WHERE id = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "Signature not found." });

        return res.status(200).json({ message: "Signature removed successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// AI Generated This
router.get("/stats", async (req, res) => {
    try {
        // Base stats
        const totalSigners = await query("SELECT COUNT(*) AS total FROM petition_signatures");

        // Signatures today and recent activity
        const signaturestoday = await query(`
            SELECT COUNT(*) AS count 
            FROM petition_signatures 
            WHERE DATE(signed_at) = CURDATE()`
        );

        const signaturesThisWeek = await query(`
            SELECT COUNT(*) AS count 
            FROM petition_signatures 
            WHERE signed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
        );

        // School-related stats
        const uniqueSchools = await query(`
            SELECT COUNT(DISTINCT high_school_name) AS count 
            FROM petition_signatures 
            WHERE high_school_name IS NOT NULL`
        );

        // Top schools by participation
        const topSchools = await query(`
            SELECT high_school_name, COUNT(*) AS count 
            FROM petition_signatures 
            WHERE high_school_name IS NOT NULL 
            GROUP BY high_school_name 
            ORDER BY count DESC 
            LIMIT 5`
        );

        // Stats by graduation year
        const signaturesByYear = await query(`
            SELECT graduation_year, COUNT(*) AS count 
            FROM petition_signatures 
            GROUP BY graduation_year 
            ORDER BY graduation_year`
        );

        // Most boycotted colleges
        const topBoycottedColleges = await query(`
            SELECT c.name, COUNT(pbc.signature_id) AS count 
            FROM petition_boycott_colleges pbc
            JOIN colleges c ON pbc.college_id = c.id
            GROUP BY pbc.college_id
            ORDER BY count DESC
            LIMIT 5`
        );

        // Average boycotts per signer
        const avgBoycotts = await query(`
            SELECT AVG(college_count) AS average 
            FROM (
                SELECT signature_id, COUNT(*) AS college_count 
                FROM petition_boycott_colleges 
                GROUP BY signature_id
            ) AS counts`
        );

        // Growth rate (compare to previous week)
        const previousWeekSignatures = await query(`
            SELECT COUNT(*) AS count 
            FROM petition_signatures 
            WHERE signed_at BETWEEN DATE_SUB(CURDATE(), INTERVAL 14 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
        );

        const currentWeekSignatures = signaturesThisWeek[0].count;
        const prevWeekSignatures = previousWeekSignatures[0].count;
        const weeklyGrowthRate = prevWeekSignatures > 0 ?
            ((currentWeekSignatures - prevWeekSignatures) / prevWeekSignatures * 100).toFixed(2) :
            null;

        res.status(200).json({
            total_signers: totalSigners[0].total,
            signatures_today: signaturestoday[0].count,
            signatures_this_week: signaturesThisWeek[0].count,
            unique_schools: uniqueSchools[0].count,
            top_schools: topSchools,
            signatures_by_graduation_year: signaturesByYear,
            top_boycotted_colleges: topBoycottedColleges,
            avg_boycotts_per_signer: avgBoycotts[0].average || 0,
            weekly_growth_rate: `${weeklyGrowthRate || 0}%`,
            prev_week_signatures: prevWeekSignatures
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;