import { Sequelize, DataTypes, Model } from "sequelize";


class Order extends Model {}

export const OrderModel = Order.init({
    orderId: {
        
    },
    productName:{

    },
    orderQuantity:{

    },
    productPrice:{

    },
    totalOrderPrice:{

    }
});