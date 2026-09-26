const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Student = require("./models/Student");
const User = require("./models/User");

dotenv.config();

async function assignExistingStudents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await User.findOne({
      username: "admin"
    });

    if (!admin) {
      console.log("Admin account not found.");
      await mongoose.disconnect();
      return;
    }

    const result = await Student.updateMany(
      {
        owner: { $exists: false }
      },
      {
        $set: {
          owner: admin._id
        }
      }
    );

    console.log("Existing students assigned to admin successfully.");
    console.log("Students updated:", result.modifiedCount);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Migration failed:", error);
    await mongoose.disconnect();
  }
}

assignExistingStudents();