import express from 'express';
import dotenv from 'dotenv';
import initializeDatabaseSetup from './config/initializeDatabaseSetup.js';
import initializeRoutes from './config/initializeRoutes.js';
import initializeTableSetup from './config/initializeTablesSetup.js';
import bodyParserMiddleware from './middleware/applyMiddlewares.js';
import AssociationConfig from './config/association.js';

dotenv.config();

const app = express();

const startServer = async () => {
    try {
        // Initialize database setup
        await initializeDatabaseSetup();

        // Configure associations
        await AssociationConfig();

        // Initialize table setup
        await initializeTableSetup();

        // Apply middlewares
        bodyParserMiddleware(app);

        // Initialize routes
        initializeRoutes(app);

        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1); // Exit the process with an error code
    }
};

// Call the async function to start the server
startServer();