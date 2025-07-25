const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ALL_ROLES } = require("../constants");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ALL_ROLES,
    default: "viewer",
  },
});

module.exports = mongoose.model("User", UserSchema);
