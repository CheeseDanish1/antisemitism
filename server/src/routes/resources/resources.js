const router = require("express").Router();
const query = require("../../database/query.js");
const { uuid: uuidv4 } = require("uuidv4");
const authMiddleware = require("../../middleware/auth.middleware.js");

/* 
GET /api/resources - Retrieve a list of guides and resources for Jewish students.  
POST /api/resources - Add a new resource.  
PUT /api/resources/{id} - Update a resource.  
DELETE /api/resources/{id} - Remove a resource.  
*/

router.get("/", async (req, res) => {
    try {
        const resources = await query(
            "SELECT id, title, content, resource_url, created_at, updated_at FROM resources ORDER BY created_at DESC"
        );
        return res.status(200).json(resources);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content, resource_url } = req.body;

        if (!title || !resource_url)
            return res.status(400).json({ error: "Title and resource URL are required." });


        const resourceId = uuidv4();

        await query(
            "INSERT INTO resources (id, title, content, resource_url) VALUES (?, ?, ?, ?)",
            [resourceId, title, content, resource_url]
        );

        return res.status(201).json({ message: "Resource added successfully!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, resource_url } = req.body;

        const resourceExists = await query("SELECT id FROM resources WHERE id = ?", [id]);

        if (!resourceExists.length)
            return res.status(404).json({ error: "Resource not found." });

        await query(
            "UPDATE resources SET title = ?, content = ?, resource_url = ? WHERE id = ?",
            [title, content, resource_url, id]
        );

        return res.status(200).json({ message: "Resource updated successfully!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query("DELETE FROM resources WHERE id = ?", [id]);

        if (!result.affectedRows)
            return res.status(404).json({ error: "Resource not found." });


        return res.status(200).json({ message: "Resource deleted successfully." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;