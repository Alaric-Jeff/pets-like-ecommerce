import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import signupRoute from '../routers/signupRoute.js'
import loginRoute from '../routers/loginRoute.js'
import sendCodeRoute from '../routers/sendCodeRoute.js'
import verifyCodeRoute from '../routers/verifycode.js'
import getProfileRoute from '../routers/getProfile.js'
import sendOrderRoute from '../routers/sendOrderRoute.js'
import addProductRoute from '../routers/addProductRoute.js'
import updateProductRoute from '../routers/updateProductRoute.js'
import deleteProductRoute from '../routers/deleteProductRoute.js'
import getAllProductsRoute from '../routers/getAllProducts.js'
import uploadRoute from '../routers/productImageRoute.js'
import adminFetchProduct from '../controllers/adminFetchOrders.js'
import addToCartRoute from '../routers/addToCartRoute.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeRoutes = (app)=> {
    //login and sign up part shit
    app.use('/signup', signupRoute);
    app.use('/login', loginRoute);
    app.use('/send-code', sendCodeRoute);
    app.use('/verify-code', verifyCodeRoute)

    //users' type shit
    app.use('/get-profile', getProfileRoute)
    app.use('/send-order-route', sendOrderRoute)
    app.use('/add-to-cart', addToCartRoute)

    app.use('/uploads', express.static(path.join(__dirname, '../utils/uploads')));
    app.use('/upload-product-image', uploadRoute)

    //admin section
    app.use('/add-product', addProductRoute)
    app.use('/update-product', updateProductRoute)
    app.use('/delete-product', deleteProductRoute)
    app.use('/get-products', getAllProductsRoute)
    app.use('/get-orders', adminFetchProduct)
}

export default initializeRoutes;