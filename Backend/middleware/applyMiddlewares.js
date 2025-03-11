import express from "express";
import cors from "cors";
import dotenv from 'dotenv'

dotenv.config()

const bodyParserMiddleware = (app) => {
    const allowedOrigins = [
         process.env.htmlOrigin, 
         process.env.htmlHost, 
      ];
      app.use(cors({
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }));  

    app.options("*", cors()); 
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};

export default bodyParserMiddleware;
