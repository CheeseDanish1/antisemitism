const express = require("express");
const router = express.Router();
const query = require("../../database/query.js");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../../middleware/auth.middleware.js");
const { body, param, query: expressValidator } = require("express-validator");
const validateRequest = require("../../middleware/validation.middleware.js");

/**
 * @route   GET /api/interviews
 * @desc    Get all interviews with filtering, sorting, and pagination
 * @access  Public
 */
router.get("/", [
    validateRequest
], async (req, res) => {
    try {

        let sqlQuery = "SELECT i.*, c.name as college_name FROM interviews i JOIN colleges c ON i.college_id = c.id WHERE 1=1";

        const interviews = await query(sqlQuery, []);

        // Get question counts for each interview
        if (interviews.length > 0) {
            const interviewIds = interviews.map(interview => interview.id);
            const questionCountQuery = `
        SELECT interview_id, COUNT(*) as question_count 
        FROM interview_questions 
        WHERE interview_id IN (?) 
        GROUP BY interview_id
      `;
            const questionCounts = await query(questionCountQuery, [interviewIds]);

            // Map counts to interviews
            const countsMap = questionCounts.reduce((acc, item) => {
                acc[item.interview_id] = item.question_count;
                return acc;
            }, {});

            interviews.forEach(interview => {
                interview.question_count = countsMap[interview.id] || 0;
            });
        }

        return res.status(200).json({
            data: interviews,
        });
    } catch (err) {
        console.error("Error fetching interviews:", err);
        return res.status(500).json({ error: "Failed to retrieve interviews", details: err.message });
    }
});

/**
 * @route   POST /api/interviews
 * @desc    Create a new interview
 * @access  Private
 */
router.post("/", [
    authMiddleware,
    body("title").isString().trim().isLength({ min: 3, max: 255 }).withMessage("Title must be 3-255 characters"),
    body("interviewee_name").isString().trim().isLength({ min: 2, max: 255 }).withMessage("Interviewee name must be 2-255 characters"),
    body("interviewee_title").optional().isString().trim().isLength({ max: 255 }),
    body("content").isString().trim().isLength({ min: 10 }).withMessage("Content must be at least 10 characters"),
    body("media_type").optional().isIn(["text", "video", "audio"]).withMessage("Media type must be text, video, or audio"),
    body("media_url").optional().isURL().withMessage("Media URL must be a valid URL"),
    body("final_assessment").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
    body("questions").optional().isArray().withMessage("Questions must be an array"),
    body("questions.*.question").optional().isString().trim().isLength({ min: 3 }).withMessage("Question must be at least 3 characters"),
    body("questions.*.answer").optional().isString().trim().isLength({ min: 3 }).withMessage("Answer must be at least 3 characters"),
    validateRequest
], async (req, res) => {
    try {
        const {
            college_id,
            title,
            interviewee_name,
            interviewee_title,
            content,
            media_type = "text",
            media_url,
            final_assessment,
            questions = []
        } = req.body;

        // Check if college exists
        const college = await query("SELECT id FROM colleges WHERE id = ?", [college_id]);
        if (college.length === 0) {
            return res.status(404).json({ error: "College not found" });
        }

        // Insert interview
        const id = uuidv4();
        await query(
            "INSERT INTO interviews (id, college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id, college_id, title, interviewee_name, interviewee_title || null, content, media_type, media_url || null, final_assessment || null]
        );

        // Insert questions if provided
        if (questions.length > 0) {
            const questionValues = questions.map((q, index) => {
                const questionId = uuidv4();
                return [questionId, id, q.question, q.answer, index + 1];
            });

            const questionPlaceholders = questionValues.map(() => "(?, ?, ?, ?, ?)").join(", ");
            const flattenedValues = questionValues.flat();

            await query(
                `INSERT INTO interview_questions (id, interview_id, question, answer, position) VALUES ${questionPlaceholders}`,
                flattenedValues
            );
        }

        return res.status(201).json({
            message: "Interview created successfully",
            id,
            questions_added: questions.length
        });
    } catch (err) {
        console.error("Error creating interview:", err);
        return res.status(500).json({ error: "Failed to create interview", details: err.message });
    }
});

/**
 * @route   GET /api/interviews/college/:collegeId
 * @desc    Get all interviews for a specific college
 * @access  Public
 */
router.get("/college/:collegeId", [
    expressValidator("page").optional().isInt({ min: 1 }).toInt(),
    expressValidator("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    validateRequest
], async (req, res) => {
    try {
        const { collegeId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        // Check if college exists
        const college = await query("SELECT id, name FROM colleges WHERE id = ?", [collegeId]);
        if (college.length === 0) {
            return res.status(404).json({ error: "College not found" });
        }

        // Count total interviews for pagination
        const countResult = await query(
            "SELECT COUNT(*) as total FROM interviews WHERE college_id = ?",
            [collegeId]
        );
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        // Get interviews
        const interviews = await query(
            "SELECT * FROM interviews WHERE college_id = ? ORDER BY published_at DESC LIMIT ? OFFSET ?",
            [collegeId, parseInt(limit), offset]
        );

        return res.status(200).json({
            college: {
                id: college[0].id,
                name: college[0].name
            },
            data: interviews,
            pagination: {
                total: totalRecords,
                page,
                limit,
                total_pages: totalPages,
                has_next_page: page < totalPages,
                has_prev_page: page > 1
            }
        });
    } catch (err) {
        console.error("Error fetching college interviews:", err);
        return res.status(500).json({ error: "Failed to retrieve college interviews", details: err.message });
    }
});

/**
 * @route   GET /api/interviews/stats
 * @desc    Get interview statistics
 * @access  Public
 */
router.get("/stats", async (req, res) => {
    try {
        // Get overall stats
        const overallStats = await query(`
      SELECT 
        COUNT(*) as total_interviews,
        COUNT(DISTINCT college_id) as total_colleges,
        AVG(final_assessment) as average_rating,
        MAX(published_at) as latest_interview_date,
        (SELECT COUNT(*) FROM interview_questions) as total_questions
      FROM interviews
    `);

        // Get top rated interviews
        const topRated = await query(`
      SELECT i.id, i.title, i.interviewee_name, i.final_assessment, c.name as college_name
      FROM interviews i
      JOIN colleges c ON i.college_id = c.id
      WHERE i.final_assessment IS NOT NULL
      ORDER BY i.final_assessment DESC
      LIMIT 5
    `);

        // Get stats by media type
        const mediaTypeStats = await query(`
      SELECT media_type, COUNT(*) as count
      FROM interviews
      GROUP BY media_type
      ORDER BY count DESC
    `);

        return res.status(200).json({
            overall: overallStats[0],
            top_rated: topRated,
            by_media_type: mediaTypeStats
        });
    } catch (err) {
        console.error("Error fetching interview statistics:", err);
        return res.status(500).json({ error: "Failed to retrieve interview statistics", details: err.message });
    }
});

/**
 * @route   GET /api/interviews/search
 * @desc    Advanced search for interviews
 * @access  Public
 */
router.get("/search", [
    expressValidator("query").isString().trim().isLength({ min: 2 }).withMessage("Search query must be at least 2 characters"),
    validateRequest
], async (req, res) => {
    try {
        const { query: searchQuery } = req.query;
        const searchParam = `%${searchQuery}%`;

        const interviews = await query(`
      SELECT i.*, c.name as college_name,
        (SELECT COUNT(*) FROM interview_questions WHERE interview_id = i.id) as question_count
      FROM interviews i
      JOIN colleges c ON i.college_id = c.id
      WHERE i.title LIKE ? 
        OR i.interviewee_name LIKE ?
        OR i.interviewee_title LIKE ?
        OR i.content LIKE ?
        OR EXISTS (
          SELECT 1 FROM interview_questions 
          WHERE interview_id = i.id AND (question LIKE ? OR answer LIKE ?)
        )
      ORDER BY 
        CASE 
          WHEN i.title LIKE ? THEN 1
          WHEN i.interviewee_name LIKE ? THEN 2
          ELSE 3
        END,
        i.published_at DESC
      LIMIT 20
    `, [
            searchParam, searchParam, searchParam, searchParam,
            searchParam, searchParam, searchParam, searchParam
        ]);

        return res.status(200).json({
            query: searchQuery,
            results_count: interviews.length,
            results: interviews
        });
    } catch (err) {
        console.error("Error searching interviews:", err);
        return res.status(500).json({ error: "Failed to search interviews", details: err.message });
    }
});

/**
 * @route   GET /api/interviews/:id
 * @desc    Get a single interview by ID with its questions
 * @access  Public
 */
router.get("/:id", [
    validateRequest
], async (req, res) => {
    try {
        const { id } = req.params;

        // Get interview with college name
        const interview = await query(`
      SELECT i.*, c.name as college_name 
      FROM interviews i 
      JOIN colleges c ON i.college_id = c.id 
      WHERE i.id = ?
    `, [id]);

        if (interview.length === 0) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Get questions
        const questions = await query(`
      SELECT id, question, answer, position 
      FROM interview_questions 
      WHERE interview_id = ? 
      ORDER BY position
    `, [id]);

        // Increment view count (optional feature)
        // This would require adding a view_count column to the interviews table
        // await query("UPDATE interviews SET view_count = view_count + 1 WHERE id = ?", [id]);

        return res.status(200).json({
            ...interview[0],
            questions
        });
    } catch (err) {
        console.error("Error fetching interview:", err);
        return res.status(500).json({ error: "Failed to retrieve interview", details: err.message });
    }
});

/**
 * @route   PUT /api/interviews/:id
 * @desc    Update an interview
 * @access  Private
 */
router.put("/:id", [
    authMiddleware,
    body("title").optional().isString().trim().isLength({ min: 3, max: 255 }).withMessage("Title must be 3-255 characters"),
    body("interviewee_name").optional().isString().trim().isLength({ min: 2, max: 255 }).withMessage("Interviewee name must be 2-255 characters"),
    body("interviewee_title").optional({ values: "null" }).isString().trim().isLength({ max: 255 }),
    body("content").optional().isString().trim().isLength({ min: 10 }).withMessage("Content must be at least 10 characters"),
    body("media_type").optional().isIn(["text", "video", "audio"]).withMessage("Media type must be text, video, or audio"),
    body("media_url").optional({ values: "null" }).isURL().withMessage("Media URL must be a valid URL"),
    body("final_assessment").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
    validateRequest
], async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            interviewee_name,
            interviewee_title,
            content,
            media_type,
            media_url,
            final_assessment,
            college_id
        } = req.body;

        // Check if interview exists
        const existingInterview = await query("SELECT * FROM interviews WHERE id = ?", [id]);
        if (existingInterview.length === 0) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];

        if (title !== undefined) {
            updateFields.push("title = ?");
            updateValues.push(title);
        }

        if (interviewee_name !== undefined) {
            updateFields.push("interviewee_name = ?");
            updateValues.push(interviewee_name);
        }

        if (interviewee_title !== undefined) {
            updateFields.push("interviewee_title = ?");
            updateValues.push(interviewee_title);
        }

        if (content !== undefined) {
            updateFields.push("content = ?");
            updateValues.push(content);
        }

        if (media_type !== undefined) {
            updateFields.push("media_type = ?");
            updateValues.push(media_type);
        }

        if (media_url !== undefined) {
            updateFields.push("media_url = ?");
            updateValues.push(media_url);
        }

        if (final_assessment !== undefined) {
            updateFields.push("final_assessment = ?");
            updateValues.push(final_assessment);
        }

        if (college_id) {
            updateFields.push("college_id = ?");
            updateValues.push(college_id);
        }

        // Only update if there are fields to update
        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }

        // Perform update
        updateValues.push(id);
        const result = await query(
            `UPDATE interviews SET ${updateFields.join(", ")} WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Interview not found or no changes made" });
        }

        return res.status(200).json({
            message: "Interview updated successfully",
            updated_fields: updateFields.length
        });
    } catch (err) {
        console.error("Error updating interview:", err);
        return res.status(500).json({ error: "Failed to update interview", details: err.message });
    }
});

/**
 * @route   DELETE /api/interviews/:id
 * @desc    Delete an interview
 * @access  Private
 */
router.delete("/:id", [
    authMiddleware,
    validateRequest
], async (req, res) => {
    try {
        const { id } = req.params;

        // Check if interview exists
        const interview = await query("SELECT id FROM interviews WHERE id = ?", [id]);
        if (interview.length === 0) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Count associated questions (for reporting)
        const questionCount = await query(
            "SELECT COUNT(*) as count FROM interview_questions WHERE interview_id = ?",
            [id]
        );

        // Delete (CASCADE will handle related questions)
        const result = await query("DELETE FROM interviews WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Interview not found or already deleted" });
        }

        return res.status(200).json({
            message: "Interview deleted successfully",
            related_questions_deleted: questionCount[0].count
        });
    } catch (err) {
        console.error("Error deleting interview:", err);
        return res.status(500).json({ error: "Failed to delete interview", details: err.message });
    }
});

/**
 * @route   GET /api/interviews/:id/questions
 * @desc    Get all questions for an interview
 * @access  Public
 */
router.get("/:id/questions", [
    validateRequest
], async (req, res) => {
    try {
        const { id } = req.params;

        // Check if interview exists
        const interview = await query("SELECT id, title FROM interviews WHERE id = ?", [id]);
        if (interview.length === 0) {
            return res.status(404).json({ error: "Interview not found" });
        }

        const questions = await query(
            "SELECT * FROM interview_questions WHERE interview_id = ? ORDER BY position",
            [id]
        );

        return res.status(200).json({
            interview_id: id,
            interview_title: interview[0].title,
            questions_count: questions.length,
            questions
        });
    } catch (err) {
        console.error("Error fetching questions:", err);
        return res.status(500).json({ error: "Failed to retrieve questions", details: err.message });
    }
});

/**
 * @route   POST /api/interviews/:id/questions
 * @desc    Add new questions to an interview
 * @access  Private
 */
router.post("/:id/questions", [
    authMiddleware,
    body("questions").isArray({ min: 1 }).withMessage("At least one question is required"),
    body("questions.*.question").isString().trim().isLength({ min: 3 }).withMessage("Question must be at least 3 characters"),
    body("questions.*.answer").isString().trim().isLength({ min: 3 }).withMessage("Answer must be at least 3 characters"),
    body("questions.*.position").optional().isInt({ min: 1 }).withMessage("Position must be a positive integer"),
    validateRequest
], async (req, res) => {
    try {
        const { id } = req.params;
        const { questions } = req.body;
        // Check if interview exists
        const interview = await query("SELECT id FROM interviews WHERE id = ?", [id]);
        if (interview.length === 0) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Get current highest position
        const positionResult = await query(
            "SELECT COALESCE(MAX(position), 0) as max_position FROM interview_questions WHERE interview_id = ?",
            [id]
        );
        let currentPosition = positionResult[0].max_position;

        // Insert questions
        const questionValues = questions.map(q => {
            const questionId = uuidv4();
            const position = q.position || ++currentPosition;
            return [questionId, id, q.question, q.answer, position];
        });

        const questionPlaceholders = questionValues.map(() => "(?, ?, ?, ?, ?)").join(", ");
        const flattenedValues = questionValues.flat();

        await query(
            `INSERT INTO interview_questions (id, interview_id, question, answer, position) VALUES ${questionPlaceholders}`,
            flattenedValues
        );

        return res.status(201).json({
            message: "Questions added successfully",
            interview_id: id,
            questions_added: questions.length
        });
    } catch (err) {
        console.error("Error adding questions:", err);
        return res.status(500).json({ error: "Failed to add questions", details: err.message });
    }
});

/**
 * @route   PUT /api/interviews/:id/questions/reorder
 * @desc    Reorder questions for an interview
 * @access  Private
 */
router.put("/:id/questions/reorder", [
    authMiddleware,
    body("questions").isArray({ min: 1 }).withMessage("At least one question is required"),
    body("questions.*.position").isInt({ min: 1 }).withMessage("Position must be a positive integer"),
    validateRequest
], async (req, res) => {
    try {
        const { id } = req.params;
        const { questions } = req.body;


        // Check if interview exists
        const interview = await query("SELECT id FROM interviews WHERE id = ?", [id]);
        if (interview.length === 0) {
            return res.status(404).json({ error: "Interview not found" });
        }

        const existingQuestions = await query(
            "SELECT id FROM interview_questions WHERE interview_id = ?",
            [id]
        );

        if (existingQuestions.length !== questions.length) {
            return res.status(400).json({
                error: "Some questions do not exist or do not belong to this interview"
            });
        }

        // Update positions
        for (const q of questions) {
            await query(
                "UPDATE interview_questions SET position = ? WHERE id = ?",
                [q.position, q.id]
            );
        }


        return res.status(200).json({
            message: "Questions reordered successfully",
            interview_id: id
        });
    } catch (err) {
        console.error("Error reordering questions:", err);
        return res.status(500).json({ error: "Failed to reorder questions", details: err.message });
    }
});

/**
 * @route   PUT /api/interviews/:id/questions/:questionId
 * @desc    Update a specific question
 * @access  Private
 */
router.put("/:id/questions/:questionId", [
    authMiddleware,
    body("question").optional().isString().trim().isLength({ min: 3 }).withMessage("Question must be at least 3 characters"),
    body("answer").optional().isString().trim().isLength({ min: 3 }).withMessage("Answer must be at least 3 characters"),
    body("position").optional().isInt({ min: 1 }).withMessage("Position must be a positive integer"),
    validateRequest
], async (req, res) => {
    try {
        const { id, questionId } = req.params;
        const { question, answer, position } = req.body;

        // Check if question exists and belongs to the interview
        const questionCheck = await query(
            "SELECT id FROM interview_questions WHERE id = ? AND interview_id = ?",
            [questionId, id]
        );

        if (questionCheck.length === 0) {
            return res.status(404).json({ error: "Question not found or does not belong to this interview" });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];

        if (question !== undefined) {
            updateFields.push("question = ?");
            updateValues.push(question);
        }

        if (answer !== undefined) {
            updateFields.push("answer = ?");
            updateValues.push(answer);
        }

        if (position !== undefined) {
            updateFields.push("position = ?");
            updateValues.push(position);
        }

        // Only update if there are fields to update
        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }

        // Perform update
        updateValues.push(questionId);
        const result = await query(
            `UPDATE interview_questions SET ${updateFields.join(", ")} WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Question not found or no changes made" });
        }

        return res.status(200).json({
            message: "Question updated successfully",
            interview_id: id,
            question_id: questionId
        });
    } catch (err) {
        console.error("Error updating question:", err);
        return res.status(500).json({ error: "Failed to update question", details: err.message });
    }
});

/**
 * @route   DELETE /api/interviews/:id/questions/:questionId
 * @desc    Delete a specific question
 * @access  Private
 */
router.delete("/:id/questions/:questionId", [
    authMiddleware,
    validateRequest
], async (req, res) => {
    try {
        const { id, questionId } = req.params;

        // Check if question exists and belongs to the interview
        const questionCheck = await query(
            "SELECT id FROM interview_questions WHERE id = ? AND interview_id = ?",
            [questionId, id]
        );

        if (questionCheck.length === 0) {
            return res.status(404).json({ error: "Question not found or does not belong to this interview" });
        }

        // Delete question
        const result = await query("DELETE FROM interview_questions WHERE id = ?", [questionId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Question not found or already deleted" });
        }

        // TODO: Reorder remaining questions

        return res.status(200).json({
            message: "Question deleted successfully",
            interview_id: id
        });
    } catch (err) {
        console.error("Error deleting question:", err);
        return res.status(500).json({ error: "Failed to delete question", details: err.message });
    }
});

module.exports = router;