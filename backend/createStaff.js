const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

async function createStaff() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const name = "Pranesh";
    const username = "pranesh";
    const password = "Pranesh@123";

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("Staff account already exists.");
      console.log("Username:", username);

      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: name,
      username: username,
      password: hashedPassword,
      role: "staff"
    });

    console.log("Staff account created successfully.");
    console.log("Name:", name);
    console.log("Username:", username);
    console.log("Password:", password);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("Failed to create staff account:", error);
    process.exit(1);
  }
}

createStaff();