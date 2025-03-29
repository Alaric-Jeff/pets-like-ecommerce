import ProfileImageModel from "../models/ProfileImageModel.js";
import UserModel from "../models/UserModel.js";
import logger from "../utils/logger.js";

const ProfileImageController = async (req, res) => {
    if (!req.file) {
        logger.warn("No file received");
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { userid } = req.user;

    if (!userid) {
        console.log(`user id: ${userid}`)
        logger.warn("Undefined fields in the controller");
        return res.status(401).json({ message: "empty data fields" });
    }
    
    try {
        console.log(`Checking if profile exists with ID: ${userid}`);
        const profile = await UserModel.findByPk(userid);
        if (!profile) {
            console.log("Profile not found");
            return res.status(404).json({ message: "profile not found" });
        }
        
        const imagePath = `/uploads/profilePictures/${req.file.filename}`;
        console.log(`Saving image to database: ${imagePath}`);
        const existingImage = await ProfileImageModel.findOne({ where: { userid } });
        
        if (existingImage) {
            await existingImage.update({ image: imagePath });
            logger.info(`Updated image for profile ID ${userid}: ${imagePath}`);
        } else {
            await ProfileImageModel.create({ userid, image: imagePath });
            logger.info(`New image saved for profile ID ${userid}: ${imagePath}`);
        }
        
        return res.status(200).json({ message: "File uploaded successfully", image: imagePath });
    } catch (error) {
        logger.warn("Error occurred in the profile image controller, error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default ProfileImageController;
