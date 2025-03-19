const router = require("express").Router();
const authMiddleware = require("../../middleware/auth.middleware")
const query = require("../../database/query")
const { v4: uuidv4 } = require("uuid")

/* 
GET /api/incidents - Retrieve a list of all reported antisemitic incidents.  
POST /api/incidents - Submit a new antisemitic incident report.  
GET /api/incidents/{id} - Retrieve details of a specific incident.  
PUT /api/incidents/{id} - Update an existing incident report.  
DELETE /api/incidents/{id} - Remove an incident report.  
POST /api/incidents/:id/evidence - Add evidence to an incident
GET /api/incidents/colleges/stats - Get statistics on incidents by college
*/

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const collegeId = req.query.college_id;
        const dateFrom = req.query.date_from;
        const dateTo = req.query.date_to;
        const sort = req.query.sort || 'date_desc';

        // Start building the SQL query
        let sql = `
          SELECT i.*, c.name as college_name
          FROM incidents i
          LEFT JOIN colleges c ON i.college_id = c.id
          WHERE 1=1
        `;

        const params = [];

        if (collegeId) {
            sql += ` AND i.college_id = ?`;
            params.push(collegeId);
        }

        if (dateFrom) {
            sql += ` AND i.incident_date >= ?`;
            params.push(dateFrom);
        }

        if (dateTo) {
            sql += ` AND i.incident_date <= ?`;
            params.push(dateTo);
        }

        if (sort === 'date_asc') sql += ` ORDER BY i.incident_date ASC`;
        else if (sort === 'severity_desc') sql += ` ORDER BY i.severity DESC, i.incident_date DESC`;
        else sql += ` ORDER BY i.incident_date DESC`;


        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const incidents = await query(sql, params);

        const countSql = `
          SELECT COUNT(*) as total
          FROM incidents i
          WHERE 1=1
        `;

        const countParams = params.slice(0, -2);
        const totalResult = await query(countSql, countParams);
        const total = totalResult[0].total;

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            incidents,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve incidents", details: error.message });
    }
});

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
            reported_by
        } = req.body;

        // Validate required fields
        if (!title || !description || !college_id || !incident_date || !severity || !location) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["title", "description", "college_id", "incident_date", "severity", "location"]
            });
        }

        // Validate severity is between 1 and 5
        if (severity < 1 || severity > 5) {
            return res.status(400).json({ error: "Severity must be between 1 and 5" });
        }

        // Check if college exists
        const collegeExists = await query("SELECT id FROM colleges WHERE id = ?", [college_id]);
        if (collegeExists.length === 0) {
            return res.status(400).json({ error: "College not found" });
        }

        // Generate a new UUID for the incident
        const id = uuidv4();

        // Insert the new incident
        const sql = `
        INSERT INTO incidents (
          id, title, description, college_id, incident_date, 
          severity, location, media_url, reported_by, reported_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

        await query(sql, [
            id, title, description, college_id, incident_date,
            severity, location, media_url || null, reported_by || null
        ]);

        // Return the created incident
        const createdIncident = await query("SELECT * FROM incidents WHERE id = ?", [id]);

        res.status(201).json(createdIncident[0]);
    } catch (error) {
        console.error("Error creating incident:", error);
        res.status(500).json({ error: "Failed to create incident", details: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Get the incident details
        const incident = await query(`
        SELECT i.*, c.name as college_name
        FROM incidents i
        LEFT JOIN colleges c ON i.college_id = c.id
        WHERE i.id = ?
      `, [id]);

        if (incident.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Get related evidence
        const evidence = await query(`
        SELECT id, evidence_url, description, uploaded_at
        FROM incident_evidences
        WHERE incident_id = ?
      `, [id]);

        // Combine the data
        const result = {
            ...incident[0],
            evidence
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving incident:", error);
        res.status(500).json({ error: "Failed to retrieve incident", details: error.message });
    }
});

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

        // Check if the incident exists
        const existingIncident = await query("SELECT * FROM incidents WHERE id = ?", [id]);
        if (existingIncident.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Validate severity if provided
        if (severity !== undefined && (severity < 1 || severity > 5)) {
            return res.status(400).json({ error: "Severity must be between 1 and 5" });
        }

        // Check if college exists if college_id is provided
        if (college_id) {
            const collegeExists = await query("SELECT id FROM colleges WHERE id = ?", [college_id]);
            if (collegeExists.length === 0) {
                return res.status(400).json({ error: "College not found" });
            }
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

        // Always update the updated_at timestamp
        updates.push("updated_at = CURRENT_TIMESTAMP");

        // If no fields to update, return the existing incident
        if (updates.length === 1) {
            return res.status(200).json(existingIncident[0]);
        }

        // Add the ID to the params array
        params.push(id);

        // Update the incident
        const sql = `UPDATE incidents SET ${updates.join(", ")} WHERE id = ?`;
        await query(sql, params);

        // Return the updated incident
        const updatedIncident = await query("SELECT * FROM incidents WHERE id = ?", [id]);

        res.status(200).json(updatedIncident[0]);
    } catch (error) {
        console.error("Error updating incident:", error);
        res.status(500).json({ error: "Failed to update incident", details: error.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'superadmin' && req.user.role !== 'editor')
            return res.status(403).json({ error: "Unauthorized - Insufficient privileges" });

        const existingIncident = await query("SELECT * FROM incidents WHERE id = ?", [id]);
        if (existingIncident.length === 0)
            return res.status(404).json({ error: "Incident not found" });


        await query("DELETE FROM incident_evidences WHERE incident_id = ?", [id]);
        await query("DELETE FROM incidents WHERE id = ?", [id]);

        return res.status(200).json({ message: "Incident deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete incident", details: error.message });
    }
});

router.post("/:id/evidence", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { evidence_url, description } = req.body;

        // Validate required fields
        if (!evidence_url) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["evidence_url"]
            });
        }

        const existingIncident = await query("SELECT * FROM incidents WHERE id = ?", [id]);
        if (existingIncident.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        const evidenceId = uuidv4();

        const sql = `
        INSERT INTO incident_evidences (
          id, incident_id, evidence_url, description, uploaded_at
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

        await query(sql, [evidenceId, id, evidence_url, description || null]);

        // Return the created evidence
        const createdEvidence = await query("SELECT * FROM incident_evidences WHERE id = ?", [evidenceId]);

        res.status(201).json(createdEvidence[0]);
    } catch (error) {
        console.error("Error adding evidence:", error);
        res.status(500).json({ error: "Failed to add evidence", details: error.message });
    }
});

router.get("/colleges/stats", async (req, res) => {
    try {
        const stats = await query(`
        SELECT 
          c.id as college_id,
          c.name as college_name,
          COUNT(i.id) as incident_count,
          AVG(i.severity) as average_severity,
          MAX(i.incident_date) as latest_incident_date
        FROM colleges c
        LEFT JOIN incidents i ON c.id = i.college_id
        GROUP BY c.id, c.name
        ORDER BY incident_count DESC, average_severity DESC
      `);

        res.status(200).json(stats);
    } catch (error) {
        console.error("Error retrieving college stats:", error);
        res.status(500).json({ error: "Failed to retrieve college statistics", details: error.message });
    }
});

module.exports = router;