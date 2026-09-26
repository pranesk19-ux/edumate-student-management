const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const username = "admin";
    const password = "Admin@123";

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      existingUser.name = "College Administrator";
      existingUser.role = "admin";

      await existingUser.save();

      console.log("Existing admin account updated successfully.");
      console.log("Username:", username);

      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "College Administrator",
      username: username,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully.");
    console.log("Username:", username);
    console.log("Password:", password);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("Failed to create/update admin:", error);
    process.exit(1);
  }
}

createAdmin();