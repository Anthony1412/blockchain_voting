require("dotenv").config();
const { sendOTP } = require("./utils/mailer");

sendOTP("your-email@gmail.com")
  .then(() => console.log("Test email sent!"))
  .catch(err => console.error("Error:", err));
