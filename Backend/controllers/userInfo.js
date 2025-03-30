import UserProfileModel from '../models/UserProfileModel.js';
import UserModel from '../models/UserModel.js';
import logger from '../utils/logger.js';

const getUserInfo = async (req, res) => {
  const { userid } = req.user;
  if (!userid) {
    logger.warn("Missing userid in request");
    return res.status(400).json({ message: "Bad request: Missing userid" });
  }
  try {
    const userInfoInstance = await UserModel.findOne({
      where: { userid },
      include: {
        model: UserProfileModel,
        attributes: ["address", "mobileNumber", "chosenDiet", "chosenBreed", "chosenLifeStage", "isHealthyTreat"]
      }
    });
    if (!userInfoInstance) {
      logger.warn(`User not found for userid: ${userid}`);
      return res.status(404).json({ message: "User not found" });
    }
    const userInfo = userInfoInstance.get({ plain: true });
    return res.status(200).json({ message: `Successfully retrieved info for user: ${userid}`, userInfo });
  } catch (error) {
    logger.error(`Error retrieving user info for userid ${userid}: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getUserInfo;
