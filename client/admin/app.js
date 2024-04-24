
import AdminJS, { DefaultAuthProvider, locales as AdminJSLocales } from 'adminjs'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import AdminJSExpress, { buildAuthenticatedRouter } from '@adminjs/express'
import { Adapter, Database, Resource } from '@adminjs/sql'

import CustomAuthProvider from './CustomAuthProvider.js';


// import { DefaultAuthProvider } from 'adminjs'

const PORT = 5173;

const db = await new Adapter('postgresql', {
    connectionString: 'postgres://postgres:postgres@localhost:5432/calendar_system',
    database: 'calendar_system',
}).init();

const start = async () => {
    const app = express();

    // const authentication = new DefaultAuthProvider('admin', {
    //     authenticate: async (email, password) => {
    //         const user = await User.findOne({ where: { email } });
    //         if (user && (await user.comparePassword(password))) {
    //             return user;
    //         }
    //         return null;
    //     },
    //     cookiePassword: 'some-very-long-secret',
    // });

    AdminJS.registerAdapter({
        Database,
        Resource,
        // authentication
    })

    const admin = new AdminJS({
        resources: [{
            resource: db.table('users'),
            options: {
                properties: {
                    role: {
                        isRequired: true,
                        availableValues: [
                            { label: 'Admin', value: 'ADMIN' },
                            { label: 'Client', value: 'CLIENT' },
                        ],
                    },
                },
            },
        }],
        auth: {
            authenticate: async (email, password) => {
              return CustomAuthProvider.authenticate({ payload: { email, password } });
            },
            logout: async () => {
              return CustomAuthProvider.logout({ payload: {} });
            },
        },
        // rootPath: '/admin',
    });
    admin.watch();

    // const loginRouter = express.Router();
    // loginRouter.post('/login', buildAuthenticatedRouter(
    //     admin, 
    //     {
    //         // "authenticate" was here
    //         cookiePassword: 'test',
    //         provider: authentication,
    //     },
    //     null,
    //     {
    //         secret: 'test',
    //         resave: false,
    //         saveUninitialized: true,
    //     }
    // ));
    // loginRouter.get('/login', (req, res) => res.sendFile(`${__dirname}/login.html`));

    const authenticate = new DefaultAuthProvider('admin', {
        authenticate: async (email, password) => {
            const user = await User.findOne({ where: { email } });
            if (user && (await user.comparePassword(password))) {
                return user;
            }
            return null;

            // const { email, password } = req.body;
            
            // try {
            //     const user = await admin.authenticate(email, password);
            //     req.session.user = user;
            //     res.redirect('/admin/dashboard');
            // } catch (error) {
            //     res.status(401).send('Invalid credentials');
            // }

        },
        cookiePassword: 'some-very-long-secret',
    });

    const authRouter = buildAuthenticatedRouter(admin, {
        authenticate,
        cookieName: 'username',
        cookiePassword: 'password',
    })
    app.use(admin.options.rootPath, authRouter)
    // app.post('/admin/login', async (req, res) => {
    //     const { email, password } = req.body;
        
    //     try {
    //         const user = await admin.authenticate(email, password);
    //         req.session.user = user;
    //         res.redirect('/admin/dashboard');
    //     } catch (error) {
    //         res.status(401).send('Invalid credentials');
    //     }
    // });

    const router = AdminJSExpress.buildRouter(admin)
    app.use(admin.options.rootPath, router)
    app.get('/admin/dashboard', async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/admin/login');
        }
        // Render the dashboard
    });

    // const dashboardRouter = AdminJSExpress.buildRouter(admin);
    // app.use('/admin/dashboard', dashboardRouter);
    // app.use('/admin/login', loginRouter);

    app.listen(PORT, () => {
        console.log('app started')
    })
};

start();




