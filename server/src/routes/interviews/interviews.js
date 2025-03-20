const express = require("express");
const router = express.Router();
const query = require("../../database/query.js");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../../middleware/auth.middleware.js");

/* 
GET /api/interviews - Retrieve a list of interviews.  
POST /api/interviews - Add a new interview.  
GET /api/interviews/{id} - Retrieve details of a specific interview.  
PUT /api/interviews/{id} - Update an interview.  
DELETE /api/interviews/{id} - Remove an interview.  
*/

router.get("/", async (req, res) => {
    try {
        const interviews = await query("SELECT * FROM interviews ORDER BY published_at DESC");
        return res.status(200).json(interviews);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment } = req.body;

        if (!college_id || !title || !interviewee_name || !content)
            return res.status(400).json({ error: "Missing required fields." });

        const id = uuidv4();
        await query(
            "INSERT INTO interviews (id, college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id, college_id, title, interviewee_name, interviewee_title, content, media_type || 'text', media_url, final_assessment]
        );

        return res.status(201).json({ message: "Interview added successfully!", id });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await query("SELECT * FROM interviews WHERE id = ?", [id]);

        if (interview.length === 0) return res.status(404).json({ error: "Interview not found." });

        const questions = await query("SELECT * FROM interview_questions WHERE interview_id = ? ORDER BY position", [id]);
        return res.status(200).json({ ...interview[0], questions });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment } = req.body;
        
        const result = await query(
            "UPDATE interviews SET title = ?, interviewee_name = ?, interviewee_title = ?, content = ?, media_type = ?, media_url = ?, final_assessment = ? WHERE id = ?",
            [title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment, id]
        );
        
        if (result.affectedRows === 0) return res.status(404).json({ error: "Interview not found." });
        return res.status(200).json({ message: "Interview updated successfully!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query("DELETE FROM interviews WHERE id = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "Interview not found." });
        return res.status(200).json({ message: "Interview removed successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
