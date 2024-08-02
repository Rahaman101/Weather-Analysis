const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, default: null},
    role: {type: String, default: "user"},
    approveTime:{type: Date, default: null},
    requestStatus: {type: Number, default: 101},
    createdAt: {
        type: Date, default: new Date()
    }
});

const User = mongoose.model("users", UserSchema)
module.exports = User;

// 101 = new
// 102 = approved
// 103 = pending
// 104 = discarded