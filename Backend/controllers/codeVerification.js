import nodemailer from "nodemailer";
import logger from "../utils/logger.js";
import { verificationCodes } from "../utils/verificationCodes.js";

const COOLDOWN_PERIOD = 30 * 1000; 
const CODE_EXPIRATION = 10 * 60 * 1000; 

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.gmailAccount,
    pass: process.env.appPassword,
  },
});

const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const lastSentTime = verificationCodes[email]?.lastSentTime;

    if (lastSentTime && Date.now() - lastSentTime < COOLDOWN_PERIOD) {
      const remainingTime = Math.ceil(
        (COOLDOWN_PERIOD - (Date.now() - lastSentTime)) / 1000
      );
      return res
        .status(429)
        .json({ message: `Please wait ${remainingTime} seconds before requesting a new code` });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = {
      code: verificationCode,
      expires: Date.now() + CODE_EXPIRATION,
      lastSentTime: Date.now(),
    };

    console.log(`Stored verification code for ${email}: ${verificationCode}`);
    console.log("Current verificationCodes object:", verificationCodes); // Logs all stored data

    const mailOptions = {
      from: "PetsLike@gmail.com",
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    
    logger.info(`Verification code sent to ${email}: ${verificationCode}`);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    logger.error("Error sending verification code:", error);
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

export default sendVerificationCode;
