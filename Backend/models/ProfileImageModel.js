import {DataTypes, Model} from 'sequelize'
import UserModel from './UserModel.js'
import {db} from '../config/database.js'

class ProfileImage extends Model {}

const ProfileImageModel = ProfileImage.init({
    profileImageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid:{
        type: DataTypes.INTEGER,
        references:{
            model: UserModel,
            key: "userid"
        }
    },
    image:{
        type: DataTypes.STRING
    }
},{
    sequelize: db,
    modelName: "Profile_Image",
    tableName: "Profile_Image",
    timestamps: true
});

export default ProfileImageModel;