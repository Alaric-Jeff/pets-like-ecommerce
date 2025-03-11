import express from "express";
import cors from "cors";

const bodyParserMiddleware = (app) => {
    const allowedOrigins = [
        "http://127.0.0.1:5500", 
        "http://localhost", 
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
