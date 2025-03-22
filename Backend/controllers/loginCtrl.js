import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import logger from "../utils/logger.js"; 
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


dotenv.config()

export const validateLogin = [
    check("email").isEmail().withMessage("Invalid email format"),
    check("password").notEmpty().withMessage("Password is required"),
];

    const loginController = async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log(`email: ${email}, password: ${password}`)

    try {
        const account = await UserModel.findOne({ where: { email } });

        if (!account) {
            return res.status(404).json({ message: "Account doesn't exist" });
        }

        const isPasswordMatch = await bcrypt.compare(password, account.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            {userid: account.userid},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )

        logger.info(`user ${email} logged in successfully`);
        return res.status(200).json({ message: "Login successful", token, role: account.role});

    } catch (error) {
        logger.error("Login error:", error);
        return res.status(500).json({ message: "internal server error occurred" });
    }
};

export default loginController;
