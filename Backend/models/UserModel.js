import { DataTypes, Model } from "sequelize";
import {db} from "../config/database.js";

class User extends Model {}

const UserModel = User.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        firstname:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        surname:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
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
