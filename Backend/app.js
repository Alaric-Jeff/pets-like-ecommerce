import express from 'express'
import dotenv from 'dotenv'
import initializeDatabaseSetup from './middleware/initializeDatabaseSetup.js'
import initializeRoutes from './middleware/initializeRoutes.js'
import initializeTableSetup from './middleware/initializeTablesSetup.js'
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

