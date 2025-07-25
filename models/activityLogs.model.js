const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
