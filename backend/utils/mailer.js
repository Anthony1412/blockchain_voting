const nodemailer = require("nodemailer");

// Temporary storage for OTPs
let otpStore = {};

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
async function sendOTP(email) {
  const otp = generateOTP();
  otpStore[email] = otp;

  try {
    const info = await transporter.sendMail({
      from: `"Voting System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    console.log("📧 Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send OTP:", err.response || err);
    throw new Error("Failed to send OTP");
  }
}

// Verify OTP
function verifyOTP(email, otp) {
  return otpStore[email] && otpStore[email] === otp;
}

module.exports = { sendOTP, verifyOTP };
