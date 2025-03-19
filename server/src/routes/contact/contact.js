const router = require("express").Router();
const query = require("../../database/query.js");
const sendEmail = require("../../utils/email.js");
const { uuid } = require("uuidv4");

/* 
POST /api/contact - Submit a contact form inquiry.  
*/

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message)
            return res.status(400).json({ error: "All fields are required." });

        const id = uuidv4();

        await query(
            "INSERT INTO contacts (id, name, email, message) VALUES (?, ?, ?, ?)",
            [id, name, email, message]
        );

        // Send email notification
        const emailSubject = `New Contact Inquiry from ${name}`;
        const emailBody = `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `;

        await sendEmail(email, emailSubject, emailBody);

        return res.status(200).json({ message: "Inquiry submitted successfully!" });
    } catch (err) {
        return res.status(500).json({ error: "Failed to submit inquiry." });
    }
});

module.exports = router;