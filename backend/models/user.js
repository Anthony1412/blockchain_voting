// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  hasVoted: { type: Boolean, default: false },
  votedFor: { type: String, default: null }, // candidate ID or name
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
