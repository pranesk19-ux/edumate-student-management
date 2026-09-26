const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const username = "pranesh19";
        const password = "thanipranesh@1901";

        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            existingAdmin.username = username;
            existingAdmin.password = await bcrypt.hash(password, 12);

            await existingAdmin.save();

            console.log("Admin credentials updated successfully.");
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);

            await User.create({
                name: "EduMate Administrator",
                username: username,
                password: hashedPassword,
                role: "admin"
            });

            console.log("Admin account created successfully.");
        }

        await mongoose.disconnect();

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

createAdmin();