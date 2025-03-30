import { DataTypes, Model } from 'sequelize';
import UserModel from './UserModel.js';
import { db } from '../config/database.js';

class UserProfile extends Model {}

const UserProfileModel = UserProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true
    },
    userid: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "userid"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE" 
    },
    address: {
      type: DataTypes.STRING
    },
    mobileNumber: {
      type: DataTypes.STRING 
    },
    chosenDiet: {
      type: DataTypes.STRING
    },
    chosenBreed: {
      type: DataTypes.STRING
    },
    chosenLifeStage: {
      type: DataTypes.STRING
    },
    isHealthyTreat: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    sequelize: db,
    modelName: "UserProfile",
    tableName: "user_profiles",
    timestamps: true 
  }
);

export default UserProfileModel;
