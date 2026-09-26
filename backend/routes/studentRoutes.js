const express = require("express");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// GET all students
router.get("/", async (req, res) => {
  try {
    let students;

    if (req.user.role === "admin") {
      // Admin can see all students
      students = await Student.find()
        .populate("owner", "name username role")
        .sort({ createdAt: -1 });
    } else {
      // Staff can see only their own students
      students = await Student.find({
        owner: req.user.userId
      }).sort({ createdAt: -1 });
    }

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch students"
    });
  }
});

// GET one student
router.get("/:id", async (req, res) => {
  try {
    let student;

    if (req.user.role === "admin") {
      student = await Student.findById(req.params.id)
        .populate("owner", "name username role");
    } else {
      student = await Student.findOne({
        _id: req.params.id,
        owner: req.user.userId
      });
    }

    if (!student) {
      return res.status(404).json({
        message: "Student not found or access denied"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: "Invalid student ID"
    });
  }
});

// ADD student
router.post("/", async (req, res) => {
  try {
    const studentData = {
      ...req.body,

      // Student automatically belongs to the logged-in account
      owner: req.user.userId
    };

    // Never allow the frontend to choose another owner
    delete studentData.owner;

    studentData.owner = req.user.userId;

    const student = await Student.create(studentData);

    res.status(201).json(student);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message || "Failed to create student"
    });
  }
});

// UPDATE student
router.put("/:id", async (req, res) => {
  try {
    let student;

    if (req.user.role === "admin") {
      student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      student = await Student.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user.userId
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    }

    if (!student) {
      return res.status(404).json({
        message: "Student not found or access denied"
      });
    }

    res.json(student);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message || "Failed to update student"
    });
  }
});

// DELETE student
router.delete("/:id", async (req, res) => {
  try {
    let student;

    if (req.user.role === "admin") {
      student = await Student.findByIdAndDelete(req.params.id);
    } else {
      student = await Student.findOneAndDelete({
        _id: req.params.id,
        owner: req.user.userId
      });
    }

    if (!student) {
      return res.status(404).json({
        message: "Student not found or access denied"
      });
    }

    res.json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid student ID"
    });
  }
});

module.exports = router;