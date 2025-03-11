import signupRoute from '../routers/signupRoute.js'
import loginRoute from '../routers/loginRoute.js'
const initializeRoutes = (app)=> {
    app.use('/signup', signupRoute);
    app.use('/login', loginRoute);
}

export default initializeRoutes;