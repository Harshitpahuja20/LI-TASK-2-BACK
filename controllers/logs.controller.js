const ActivityLog = require("../models/activityLogs.model");

exports.getAllLogs = async (req, res) => {
  const logs = await ActivityLog.find()
    // .populate("userId", "email role")
    // .populate("targetUserId", "email role")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
};
