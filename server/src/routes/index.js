const router = require("express").Router();

const auth = require('./auth/auth.js')

const blog = require("./blog/blog.js");
const colleges = require("./colleges/colleges.js");
const contact = require("./contact/contact.js");
const incidents = require("./incidents/incidents.js");
const interviews = require("./interviews/interviews.js");
const petition = require("./petition/petition.js");
const resources = require("./resources/resources.js");

router.use("/auth", auth);

router.use("/api/blog", blog);
router.use("/api/colleges", colleges);
router.use("/api/contact", contact);
router.use("/api/incidents", incidents);
router.use("/api/interviews", interviews);
router.use("/api/petition", petition);
router.use("/api/resources", resources);

module.exports = router;