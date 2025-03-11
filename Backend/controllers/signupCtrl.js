import { UserModel } from "../models/usermodel.js";
import hasher from "../utils/hasher.js";
import logger from "../utils/logger.js";
import { check, validationResult } from "express-validator";

export const validateSignup = [
    check("email").isEmail().withMessage("Invalid email format"),
    check("fullname").notEmpty().withMessage("Username is required"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const signupController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, fullname, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const isExisting = await UserModel.findOne({ where: { email: normalizedEmail } });
        if (isExisting) {
            return res.status(409).json({ message: "Account already exists" });
        }

        const hashedPassword = await hasher(password);
        const newUser = await UserModel.create({ email: normalizedEmail, fullname, password: hashedPassword });

        const { password: _, ...userData } = newUser.toJSON();

        logger.info(`New user created: ${fullname} (${normalizedEmail})`);
        return res.status(201).json({ message: "Account successfully created", user: userData });

    } catch (error) {
        logger.error("Error in signupController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default signupController;
