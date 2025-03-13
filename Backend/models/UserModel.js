import { DataTypes, Model } from "sequelize";
import {db} from "../config/database.js";

class User extends Model {}

export const UserModel = User.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "user"
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fullname:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db, 
        tableName: "user_table",
        timestamps: false 
    }
);

export default UserModel;
