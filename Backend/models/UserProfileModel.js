import {DataTypes, Model} from 'sequelize'
import UserModel from './UserModel.js';


class UserProfile extends Model {}

const UserProfileModel = UserProfile.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    userid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: UserModel,
            key: "userid"
        }
    },
    address: {
        type: DataTypes.STRING
    },
    mobileNumber:{
        type: DataTypes.INTEGER
    },
    chosenDiet: {
        type: DataTypes.STRING
    },
    chosenBreed: {
        type: DataTypes.STRING
    },
    chosenLifeStage: {
        type: DataTypes.STRING
    },isHealthyTreat: {
        type: DataTypes.BOOLEAN
    }


})

export default UserProfileModel;