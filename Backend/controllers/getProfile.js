import UserModel from '../models/UserModel.js';

const getProfile = async (req, res) => {
    const { userId } = req.body;
    console.log(`userid fetched: ${userId}`)
    try {
        const user = await UserModel.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ fullname: user.fullname, email: user.email });

    } catch (error) {
        console.error("Error occurred in getting profiles:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getProfile;
