const router = require("express").Router();
const query = require("../../database/query.js")
const authMiddleware = require("../../middleware/auth.middleware.js")
const { v4: uuid } = require("uuid")

/* 
GET /api/blog - Retrieve a list of published blog posts.  
GET /api/blog/all - Retrieve a list of all blog posts.  
POST /api/blog - Add a new blog post.  
GET /api/blog/{id} - Retrieve details of a specific blog post.  
PUT /api/blog/{id} - Update a blog post.  
DELETE /api/blog/{id} - Remove a blog post.  
*/

router.get("/", async (req, res) => {
    try {
        const blogs = await query("SELECT * FROM blog_posts WHERE status='published' ORDER BY published_at DESC");
        res.status(200).json({ blogs });
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve blog posts." })
    }
});

router.get("/all", authMiddleware, async (req, res) => {
    try {
        const blogs = await query("SELECT * FROM blog_posts ORDER BY published_at DESC");
        res.status(200).json({ blogs });
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve blog posts." })
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, slug, content, author, status } = req.body;
        if (!title || !slug || !content || !author || !status)
            return res.status(400).json({ error: "Title, slug, author, status and content are required." });

        const id = uuid();
        const published_at = status === "published" ? new Date() : null;

        await query(
            "INSERT INTO blog_posts (id, title, slug, content, author, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, title, slug, content, author, status, published_at]
        );

        return res.status(201).json({ message: "Blog post created successfully!", id });
    } catch (err) {
        return res.status(500).json({ error: "Failed to create blog post." });
    }
})

// TODO: Disallow public fetching of drafts
// Without disallowing admin from fetching drafts
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await query("SELECT * FROM blog_posts WHERE id = ?", [id]);

        if (!blog || !blog.length)
            return res.status(404).json({ error: "Blog post not found or not published." });


        return res.status(200).json({ blog: blog[0] });
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve blog post." });
    }
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, content, status } = req.body;

        const blog = await query("SELECT * FROM blog_posts WHERE id = ?", [id]);
        if (!blog.length)
            return res.status(404).json({ error: "Blog post not found." });


        const published_at = status === "published" ? new Date() : null;

        await query(
            "UPDATE blog_posts SET title = ?, slug = ?, content = ?, status = ?, published_at = ? WHERE id = ?",
            [title, slug, content, status, published_at, id]
        );

        return res.status(200).json({ message: "Blog post updated successfully!" });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update blog post." });
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await query("SELECT * FROM blog_posts WHERE id = ?", [id]);
        if (!blog.length)
            return res.status(404).json({ error: "Blog post not found." });

        await query("DELETE FROM blog_posts WHERE id = ?", [id]);

        res.status(200).json({ message: "Blog post deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete blog post." });
    }
})

module.exports = router;