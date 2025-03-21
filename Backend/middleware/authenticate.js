import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../models/UserModel.js'

dotenv.config()

const authenticateToken = async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"]

    if(!authorizationHeader){
        return res.status(401).json({message : "Authorization failed, no authorization header found"})
    }

    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if(!token){
        console.log("no token provided in the authorizarion header")
        return res.status(401).json({message: "Authentication Failed: Token not provided"})
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findOne({where: {email: decodedToken.email}})
        console.log(`decoded token: ${decodedToken}`)
        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        req.user = {
            userid: user.userid
        }
        next()
    
    }catch(error){
        if(error.name === 'TokenExpiredError'){
            console.log('Token is expired');
            return res.status(401).json({message: 'Unauthorized: token has expired'});
        }
        console.log('Token verification error: ', error);
        return res.status(403).json({message: "Forbidden: token is invalid"});
    }


}

export default authenticateToken;