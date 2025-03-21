import UserModel from "../models/UserModel.js";
import { verifiedEmails } from "../utils/verifiedEmails.js"; 
import hasher from "../utils/hasher.js";
import logger from "../utils/logger.js";
import { check, validationResult } from "express-validator";

export const validateSignup = [
    check("firstname").notEmpty().withMessage("Firstname is required"),
    check("firstname").isLength({ min: 3, max: 30 }).withMessage("Firstname must be between 3 and 30 characters"),
    check("surname").notEmpty().withMessage("Surname is required"),
    check("surname").isLength({ min: 3, max: 30 }).withMessage("Surname must be between 3 and 30 characters"),
    check("email").isEmail().withMessage("Invalid email format"),
    check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

const signupController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstname, surname, email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        if (!verifiedEmails[normalizedEmail]) {
            return res.status(400).json({ message: "Email is not verified. Please verify before signing up." });
        }
        
        const isExisting = await UserModel.findOne({ where: { email: normalizedEmail } });
        if (isExisting) {
            return res.status(409).json({ message: "Account already exists" });
        }

        const hashedPassword = await hasher(password);
        const newUser = await UserModel.create({ 
            firstname, 
            surname, 
            email: normalizedEmail, 
            password: hashedPassword 
        });

        const { password: _, ...userData } = newUser.toJSON();

        logger.info(`New user created: ${firstname} ${surname} (${normalizedEmail})`);
        delete verifiedEmails[normalizedEmail];

        return res.status(201).json({ message: "Account successfully created", user: userData });

    } catch (error) {
        logger.error("Error in signupController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default signupController;
