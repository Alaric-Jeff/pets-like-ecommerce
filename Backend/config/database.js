import { Sequelize } from "sequelize";
import mysql from "mysql2/promise"; 
import dotenv from "dotenv";

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const createDatabaseIfNotExists = async () => {
	try {
		const connection = await mysql.createConnection({
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASSWORD,
		});

		await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
		console.log(`[db] database "${DB_NAME}" is initialized.`);
		await connection.end();
	} catch (error) {
		console.error("error creating database:", error);
		process.exit(1); 
	}
};

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "mysql",
	logging: false,
});


const connectDB = async () => {
	await createDatabaseIfNotExists(); 

	try {
		await db.authenticate();
		console.log("connected to the database");
	} catch (error) {
		console.error("failed to connect to database:", error);
		process.exit(1);
	}
};

export { db, connectDB };
