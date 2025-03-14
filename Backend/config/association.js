import UserModel from "../models/UserModel.js";
import UserProfileModel from "../models/UserProfileModel.js";
import OrderModel from "../models/OrderModel.js";



const AssociationConfig = async ()=> {

    UserModel.hasOne(UserProfileModel)
    UserProfileModel.belongsTo(UserModel)

    UserModel.hasMany(OrderModel)
    OrderModel.belongsTo(UserModel)

}

export default AssociationConfig;