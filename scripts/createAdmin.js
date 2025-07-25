const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/user.model");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash("admin@123", 10);
  await User.create({
    name: "admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });
  console.log("Admin created");
  mongoose.disconnect();
});
