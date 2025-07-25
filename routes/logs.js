const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const logController = require("../controllers/logs.controller");

// GET /api/logs → Admin only: return logs sorted newest first
router.get("/", auth, authorize(["admin"]), logController.getAllLogs);

module.exports = router;
