const router = require("express").Router();
const query = require("../../database/query.js");
const { uuid } = require("uuidv4");
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
            [signatureId, signer_name, high_school_name, email, graduation_year, reason]
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

router.get("/stats", async (req, res) => {
    try {
        const totalSigners = await query("SELECT COUNT(*) AS total FROM petition_signatures");

        const boycottStats = await query(`
        SELECT c.name AS college_name, COUNT(pbc.signature_id) AS boycott_count
        FROM petition_boycott_colleges pbc
        JOIN colleges c ON pbc.college_id = c.id
        GROUP BY pbc.college_id
        ORDER BY boycott_count DESC;
      `);

        // TODO: Add signatures_today, and unique_schools

        res.status(200).json({
            total_signers: totalSigners[0].total,
            boycott_stats: boycottStats,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;