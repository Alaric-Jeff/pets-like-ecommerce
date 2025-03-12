import signupRoute from '../routers/signupRoute.js'
import loginRoute from '../routers/loginRoute.js'
import sendCodeRoute from '../routers/sendCodeRoute.js'
import verifyCodeRoute from '../routers/verifycode.js'

const initializeRoutes = (app)=> {
    app.use('/signup', signupRoute);
    app.use('/login', loginRoute);
    app.use('/send-code', sendCodeRoute);
    app.use('/verify-code', verifyCodeRoute)
}

export default initializeRoutes;