const ActivityLog = require("../models/activityLogs.model");

async function logActivity({
  action,
  userId,
  targetUserId = null,
  details = "",
}) {
  try {
    await ActivityLog.create({
      action,
      userId,
      targetUserId,
      details,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

module.exports = logActivity;
