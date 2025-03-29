import UserModel from '../models/UserModel.js';
import ProfileImageModel from '../models/ProfileImageModel.js';
import logger from '../utils/logger.js';

const getProfile = async (req, res) => {
  const { userid } = req.user;
  console.log(`userid fetched: ${userid}`);
  try {
    const user = await UserModel.findOne({
      where: { userid },
      include: [{
        model: ProfileImageModel,
        as: "ProfileImage",
        attributes: ["image"]
      }]
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "successfully retrieved", user });
  } catch (error) {
    logger.error("Error occurred in getting profiles:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getProfile;
