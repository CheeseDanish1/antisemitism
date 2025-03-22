const router = require("express").Router();
const query = require("../../database/query.js");
const { v4: uuid } = require("uuid");
const authMiddleware = require("../../middleware/auth.middleware.js");

/**
 * Incident Management API Endpoints
 * 
 * GET /api/incidents - Get all incidents (with optional filters)
 * GET /api/incidents/:id - Get a specific incident by ID with its evidence
 * GET /api/incidents/college/:collegeId - Get all incidents for a specific college
 * POST /api/incidents - Create a new incident
 * PUT /api/incidents/:id - Update an existing incident
 * DELETE /api/incidents/:id - Delete an incident
 * PATCH /api/incidents/:id/status - Update the status of an incident
 * 
 * Evidence Management
 * GET /api/incidents/:id/evidence - Get all evidence for an incident
 * POST /api/incidents/:id/evidence - Add evidence to an incident
 * DELETE /api/incidents/evidence/:evidenceId - Delete a specific piece of evidence
 * 
 * Statistics
 * GET /api/incidents/stats/summary - Get summary statistics for incidents
 */

// Get all incidents with optional filtering
router.get("/", async (req, res) => {
    try {
        let sql = `
      SELECT i.*, c.name as college_name 
      FROM incidents i
      JOIN colleges c ON i.college_id = c.id
      WHERE 1=1
    `;
        const params = [];

        // Apply filters if provided
        if (req.query.status) {
            sql += " AND i.status = ?";
            params.push(req.query.status);
        }

        if (req.query.severity) {
            sql += " AND i.severity = ?";
            params.push(req.query.severity);
        }

        if (req.query.college_id) {
            sql += " AND i.college_id = ?";
            params.push(req.query.college_id);
        }

        if (req.query.start_date && req.query.end_date) {
            sql += " AND i.incident_date BETWEEN ? AND ?";
            params.push(req.query.start_date, req.query.end_date);
        }

        // Add sorting
        sql += " ORDER BY i.incident_date DESC, i.reported_at DESC";

        // Add pagination if requested
        if (req.query.limit) {
            sql += " LIMIT ?";
            params.push(parseInt(req.query.limit));

            if (req.query.offset) {
                sql += " OFFSET ?";
                params.push(parseInt(req.query.offset));
            }
        }

        const incidents = await query(sql, params);
        return res.status(200).json(incidents);
    } catch (err) {
        console.error("Error fetching incidents:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Get a specific incident by ID with its evidence
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Get the incident details
        const incident = await query(
            `SELECT i.*, c.name as college_name 
       FROM incidents i
       JOIN colleges c ON i.college_id = c.id
       WHERE i.id = ?`,
            [id]
        );

        if (incident.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Get the evidence for this incident
        const evidence = await query(
            "SELECT * FROM incident_evidences WHERE incident_id = ?",
            [id]
        );

        // Combine and return the data
        const result = {
            ...incident[0],
            evidence: evidence
        };

        return res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching incident:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Get all incidents for a specific college
router.get("/college/:collegeId", async (req, res) => {
    try {
        const { collegeId } = req.params;

        // Verify the college exists
        const collegeExists = await query(
            "SELECT id FROM colleges WHERE id = ?",
            [collegeId]
        );

        if (collegeExists.length === 0) {
            return res.status(404).json({ error: "College not found" });
        }

        // Get incidents for this college
        const incidents = await query(
            `SELECT * FROM incidents 
       WHERE college_id = ? 
       ORDER BY incident_date DESC, reported_at DESC`,
            [collegeId]
        );

        return res.status(200).json(incidents);
    } catch (err) {
        console.error("Error fetching college incidents:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Create a new incident
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            description,
            college_id,
            incident_date,
            severity,
            location,
            media_url,
            reported_by,
            status = 'pending'
        } = req.body;

        // Validate required fields
        if (!title || !description || !college_id || !incident_date || !severity || !location) {
            return res.status(400).json({
                error: "Missing required fields. Please provide title, description, college_id, incident_date, severity, and location."
            });
        }

        // Validate severity is between 1-5
        if (severity < 1 || severity > 5) {
            return res.status(400).json({ error: "Severity must be between 1 and 5" });
        }

        // Validate status is one of the allowed values
        if (!['pending', 'verified', 'resolved'].includes(status)) {
            return res.status(400).json({ error: "Status must be 'pending', 'verified', or 'resolved'" });
        }

        // Verify the college exists
        const collegeExists = await query(
            "SELECT id FROM colleges WHERE id = ?",
            [college_id]
        );

        if (collegeExists.length === 0) {
            return res.status(400).json({ error: "Invalid college ID" });
        }

        // Create the incident
        const incidentId = uuid();

        await query(
            `INSERT INTO incidents 
       (id, title, description, college_id, incident_date, severity, location, media_url, reported_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                incidentId,
                title,
                description,
                college_id,
                incident_date,
                severity,
                location,
                media_url || null,
                reported_by || 'Anonymous',
                status
            ]
        );

        return res.status(201).json({
            message: "Incident created successfully",
            incident_id: incidentId
        });
    } catch (err) {
        console.error("Error creating incident:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Update an existing incident
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            college_id,
            incident_date,
            severity,
            location,
            media_url,
            reported_by,
            status
        } = req.body;

        // Check if incident exists
        const incidentExists = await query(
            "SELECT id FROM incidents WHERE id = ?",
            [id]
        );

        if (incidentExists.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Validate severity is between 1-5 if provided
        if (severity !== undefined && (severity < 1 || severity > 5)) {
            return res.status(400).json({ error: "Severity must be between 1 and 5" });
        }

        // Validate status is one of the allowed values if provided
        if (status !== undefined && !['pending', 'verified', 'resolved'].includes(status)) {
            return res.status(400).json({ error: "Status must be 'pending', 'verified', or 'resolved'" });
        }

        // Build the update query dynamically based on provided fields
        const updates = [];
        const params = [];

        if (title !== undefined) {
            updates.push("title = ?");
            params.push(title);
        }

        if (description !== undefined) {
            updates.push("description = ?");
            params.push(description);
        }

        if (college_id !== undefined) {
            // Verify the college exists
            const collegeExists = await query(
                "SELECT id FROM colleges WHERE id = ?",
                [college_id]
            );

            if (collegeExists.length === 0) {
                return res.status(400).json({ error: "Invalid college ID" });
            }

            updates.push("college_id = ?");
            params.push(college_id);
        }

        if (incident_date !== undefined) {
            updates.push("incident_date = ?");
            params.push(incident_date);
        }

        if (severity !== undefined) {
            updates.push("severity = ?");
            params.push(severity);
        }

        if (location !== undefined) {
            updates.push("location = ?");
            params.push(location);
        }

        if (media_url !== undefined) {
            updates.push("media_url = ?");
            params.push(media_url);
        }

        if (reported_by !== undefined) {
            updates.push("reported_by = ?");
            params.push(reported_by);
        }

        if (status !== undefined) {
            updates.push("status = ?");
            params.push(status);
        }

        // If no fields to update, return early
        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }

        // Add the ID to params
        params.push(id);

        // Execute the update
        await query(
            `UPDATE incidents SET ${updates.join(", ")} WHERE id = ?`,
            params
        );

        return res.status(200).json({ message: "Incident updated successfully" });
    } catch (err) {
        console.error("Error updating incident:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Delete an incident
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the incident (evidence will be cascade deleted due to FK constraint)
        const result = await query(
            "DELETE FROM incidents WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        return res.status(200).json({ message: "Incident and all associated evidence deleted successfully" });
    } catch (err) {
        console.error("Error deleting incident:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Update just the status of an incident (for quick status changes)
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        // Validate status is one of the allowed values
        if (!['pending', 'verified', 'resolved'].includes(status)) {
            return res.status(400).json({ error: "Status must be 'pending', 'verified', or 'resolved'" });
        }

        const result = await query(
            "UPDATE incidents SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        return res.status(200).json({ message: `Incident status updated to '${status}'` });
    } catch (err) {
        console.error("Error updating incident status:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Get all evidence for an incident
router.get("/:id/evidence", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if incident exists
        const incidentExists = await query(
            "SELECT id FROM incidents WHERE id = ?",
            [id]
        );

        if (incidentExists.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Get all evidence for this incident
        const evidence = await query(
            "SELECT * FROM incident_evidences WHERE incident_id = ? ORDER BY uploaded_at DESC",
            [id]
        );

        return res.status(200).json(evidence);
    } catch (err) {
        console.error("Error fetching evidence:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Add evidence to an incident
router.post("/:id/evidence", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { evidence_url, description } = req.body;

        if (!evidence_url) {
            return res.status(400).json({ error: "Evidence URL is required" });
        }

        // Check if incident exists
        const incidentExists = await query(
            "SELECT id FROM incidents WHERE id = ?",
            [id]
        );

        if (incidentExists.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Add the evidence
        const evidenceId = uuid();

        await query(
            "INSERT INTO incident_evidences (id, incident_id, evidence_url, description) VALUES (?, ?, ?, ?)",
            [evidenceId, id, evidence_url, description || null]
        );

        return res.status(201).json({
            message: "Evidence added successfully",
            evidence_id: evidenceId
        });
    } catch (err) {
        console.error("Error adding evidence:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Delete a specific piece of evidence
router.delete("/evidence/:evidenceId", authMiddleware, async (req, res) => {
    try {
        const { evidenceId } = req.params;

        const result = await query(
            "DELETE FROM incident_evidences WHERE id = ?",
            [evidenceId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Evidence not found" });
        }

        return res.status(200).json({ message: "Evidence deleted successfully" });
    } catch (err) {
        console.error("Error deleting evidence:", err);
        return res.status(500).json({ error: err.message });
    }
});

// Get summary statistics for incidents (admin dashboard)
router.get("/stats/summary", authMiddleware, async (req, res) => {
    try {
        // Get total counts by status
        const statusCounts = await query(`
      SELECT status, COUNT(*) as count 
      FROM incidents 
      GROUP BY status
    `);

        // Get counts by severity
        const severityCounts = await query(`
      SELECT severity, COUNT(*) as count 
      FROM incidents 
      GROUP BY severity 
      ORDER BY severity
    `);

        // Get counts by college
        const collegeCounts = await query(`
      SELECT c.id, c.name, COUNT(i.id) as incident_count 
      FROM colleges c
      LEFT JOIN incidents i ON c.id = i.college_id
      GROUP BY c.id, c.name
      ORDER BY incident_count DESC
    `);

        // Get recent incident counts (last 30 days)
        const recentCounts = await query(`
      SELECT COUNT(*) as recent_count 
      FROM incidents 
      WHERE incident_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

        // Get monthly trend for the past 6 months
        const monthlyTrend = await query(`
      SELECT 
        DATE_FORMAT(incident_date, '%Y-%m') as month,
        COUNT(*) as count
      FROM incidents
      WHERE incident_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(incident_date, '%Y-%m')
      ORDER BY month
    `);

        return res.status(200).json({
            status_counts: statusCounts,
            severity_counts: severityCounts,
            college_counts: collegeCounts,
            recent_count: recentCounts[0].recent_count,
            monthly_trend: monthlyTrend
        });
    } catch (err) {
        console.error("Error fetching incident statistics:", err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;