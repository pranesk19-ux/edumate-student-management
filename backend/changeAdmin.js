const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

async function changeAdmin() {
try {
await mongoose.connect(process.env.MONGODB_URI);

```
    // CHANGE THESE TWO VALUES
    const newUsername = "CHANGE_THIS_USERNAME";
    const newPassword = "CHANGE_THIS_PASSWORD";

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
        console.log("Admin account not found.");
        await mongoose.disconnect();
        return;
    }

    admin.username = newUsername;
    admin.password = hashedPassword;

    await admin.save();

    console.log("Admin credentials changed successfully.");
    console.log("Username:", newUsername);

    await mongoose.disconnect();

} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
}
```

}

changeAdmin();
