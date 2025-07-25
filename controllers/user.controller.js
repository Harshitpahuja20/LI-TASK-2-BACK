const { ALL_ROLES } = require("../constants");
const User = require("../models/user.model");
const logActivity = require("../utils/logger"); // make sure this exists
const bcrypt = require("bcryptjs");

// Admin creating viewer/editor user
exports.AdminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only admins can create users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create users" });
    }

    if (!["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Role must be viewer or editor" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password : hashedPassword, role });

    // Log activity
    setImmediate(() => {
      logActivity({
        action: "USER_CREATED",
        userId: req.user.id, // admin
        targetUserId: newUser._id,
        details: `Created user with role ${role}`,
      });
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin listing users
exports.AdminSearchUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password"
    ); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin updating user role
exports.updateUser = async (req, res) => {
  try {
    const { role, name } = req.body;
    console.log(ALL_ROLES)

    if (!ALL_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldRole = user.role;
    user.role = role;
    user.name = name;
    await user.save();

    // Log activity
    setImmediate(() => {
      logActivity({
        action: "USER_ROLE_UPDATED",
        userId: req.user.id, // admin who changed
        targetUserId: user._id, // user who got changed
        details: `Role changed from ${oldRole} to ${role}`,
      });
    });

    res.status(200).json({
      message: "User role updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log activity
    setImmediate(() => {
      logActivity({
        action: "USER_DELETED",
        userId: req.user.id, // admin who changed
        targetUserId: req.params.id, // user who got changed
        details: `User Deleted By Admin`,
      });
    });

    res.status(200).json({
      message: "User Deleted",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getSingleUserById = async (req, res) => {
  try {
    console.log(req.params.id)
    const user = await User.findById(req.params.id);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
