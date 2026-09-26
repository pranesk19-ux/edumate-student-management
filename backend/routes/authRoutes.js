const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed"
    });
  }
});

// ===============================
// GET ALL STAFF
// ADMIN ONLY
// ===============================
router.get("/staff", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only administrators can view staff accounts."
      });
    }

    const staff = await User.find(
      { role: "staff" },
      { password: 0 }
    ).sort({
      createdAt: -1
    });

    res.json(staff);

  } catch (error) {
    console.error("Get staff error:", error);

    res.status(500).json({
      message: "Failed to fetch staff accounts"
    });
  }
});

// ===============================
// CREATE STAFF ACCOUNT
// ADMIN ONLY
// ===============================
router.post("/register-staff", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only administrators can create staff accounts."
      });
    }

    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({
        message: "Name, username and password are required"
      });
    }

    const cleanUsername = username.toLowerCase().trim();

    const existingUser = await User.findOne({
      username: cleanUsername
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newStaff = await User.create({
      name: name.trim(),
      username: cleanUsername,
      password: hashedPassword,
      role: "staff"
    });

    res.status(201).json({
      message: "Staff account created successfully",
      user: {
        id: newStaff._id,
        name: newStaff.name,
        username: newStaff.username,
        role: newStaff.role,
        createdAt: newStaff.createdAt
      }
    });

  } catch (error) {
    console.error("Staff registration error:", error);

    res.status(500).json({
      message: "Failed to create staff account"
    });
  }
});

module.exports = router;