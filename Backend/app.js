import express from 'express'
import dotenv from 'dotenv'
import initializeDatabaseSetup from './config/initializeDatabaseSetup.js'
import initializeRoutes from './config/initializeRoutes.js'
import initializeTableSetup from './config/initializeTablesSetup.js'
import bodyParserMiddleware from './middleware/applyMiddlewares.js'

dotenv.config()
const app = express()

await initializeDatabaseSetup();
await initializeTableSetup();
bodyParserMiddleware(app);
initializeRoutes(app);

app.listen(process.env.port, () =>{
    console.log(`app is listening on port ${process.env.port}`)
})

