const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../utils/mailer");

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    await sendOTP(email);
    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const valid = verifyOTP(email, otp);
  if (!valid) return res.status(401).json({ success: false, error: "Invalid OTP" });

  res.json({ success: true, message: "OTP verified" });
});

module.exports = router;
