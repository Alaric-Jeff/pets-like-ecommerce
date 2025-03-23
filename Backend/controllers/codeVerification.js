import nodemailer from "nodemailer";
import logger from "../utils/logger.js";
import { verificationCodes } from "../utils/verificationCodes.js";

const COOLDOWN_PERIOD = 30 * 1000;
const CODE_EXPIRATION = 10 * 60 * 1000;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

if (!process.env.gmailAccount || !process.env.appPassword) {
  logger.error("SMTP credentials are missing in environment variables.");
  throw new Error("Missing SMTP credentials. Check your .env file.");
}

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

    if (!email || !isValidEmail(email)) {
      logger.warn(`Invalid email provided: ${email}`);
      return res.status(400).json({ message: "Invalid email address" });
    }

    const lastSentTime = verificationCodes[email]?.lastSentTime;
    if (lastSentTime && Date.now() - lastSentTime < COOLDOWN_PERIOD) {
      const remainingTime = Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastSentTime)) / 1000);
      logger.warn(`Too many requests for ${email}. Wait ${remainingTime} seconds.`);
      return res.status(429).json({ message: `Please wait ${remainingTime} seconds before requesting a new code` });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = {
      code: verificationCode,
      expires: Date.now() + CODE_EXPIRATION,
      lastSentTime: Date.now(),
    };

    logger.info(`Verification code generated for ${email}: ${verificationCode}`);

    const mailOptions = {
      from: `"PetsLike" <${process.env.gmailAccount}>`,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    
    logger.info(`Verification email sent to ${email}`);
    res.status(200).json({ message: "Verification code sent successfully" });

  } catch (error) {
    logger.error(`Error sending verification code to ${req.body.email}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

export default sendVerificationCode;
