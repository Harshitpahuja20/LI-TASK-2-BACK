const logActivity = require("../utils/logger"); // assuming this exists
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      await logActivity({
        action: "LOGIN_FAILED",
        userEmail: email,
        details: "Email not found",
      });
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logActivity({
        action: "LOGIN_FAILED",
        userId: user._id,
        details: "Incorrect password",
      });
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Successful login
    setImmediate(() => {
      logActivity({
        action: "LOGIN_SUCCESS",
        userId: user._id,
        details: "User logged in successfully",
      });
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
