import { verificationCodes } from "../utils/verificationCodes.js";
import { verifiedEmails } from "../utils/verifiedEmails.js"; // New: Store verified emails
import logger from "../utils/logger.js";

const verifyCode = (req, res) => {
  const { email, code } = req.body;


  console.log(`entered code: ${code}`);

  if (!email || !code) {
    return res.status(400).json({ message: "Email and verification code are required" });
  }

  const storedData = verificationCodes[email];

  if (!storedData) {
    return res.status(400).json({ message: "Invalid or expired verification code" });
  }

  console.log(`Stored data for ${email}:`, storedData);
  logger.info(`Stored verification code for ${email}: ${storedData.code}, expires at: ${new Date(storedData.expires).toISOString()}`);

  const { code: storedCode, expires } = storedData;

  if (Date.now() > expires) {
    delete verificationCodes[email];
    logger.warn(`Verification code expired for email: ${email}`);
    return res.status(400).json({ message: "Verification code has expired" });
  }

  if (storedCode !== code) {
    logger.warn(`Verification code mismatch for email: ${email}`);
    return res.status(400).json({ message: "Invalid verification code" });
  }

  // ✅ Mark email as verified
  verifiedEmails[email] = true;

  delete verificationCodes[email]; 
  logger.info(`Email verified successfully: ${email}`);
  res.status(200).json({ message: "Email verified successfully" });
};

export default verifyCode;
