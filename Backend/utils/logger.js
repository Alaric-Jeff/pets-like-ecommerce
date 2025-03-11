import winston from "winston";
import path from "path";

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);
const logger = winston.createLogger({
    level: "info",
    format: logFormat,
    transports: [
        new winston.transports.Console({ 
            format: winston.format.combine(
                winston.format.colorize(), 
                logFormat
            )
        }),
        new winston.transports.File({ filename: path.join("logs", "error.log"), level: "error" }), 
        new winston.transports.File({ filename: path.join("logs", "combined.log") })
    ],
});
if (process.env.NODE_ENV === "production") {
    logger.remove(new winston.transports.Console());
}

export default logger;
