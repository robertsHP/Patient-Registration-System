import AdminJS from 'adminjs'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import Plugin, { buildAuthenticatedRouter } from '@adminjs/express'
import { Adapter, Database, Resource } from '@adminjs/sql'

import { DefaultAuthProvider } from 'adminjs'

// require('dotenv').config({ path: '../../.env' });
// const PORT = process.env.CLIENT_PORT;
const PORT = 5173;

AdminJS.registerAdapter({
    Database,
    Resource,
})

const start = async () => {
    const app = express()
    app.use(session({
        secret: 'very secret',
        resave: false,
        saveUninitialized: false,
    }))

    const db = await new Adapter('postgresql', {
        connectionString: 'postgres://postgres:postgres@localhost:5432/calendar_system',
        database: 'calendar_system',
    }).init();

    const admin = new AdminJS({
        resources: [
            {
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
            },
        ]
    })

    admin.watch()

    const loginRouter = express.Router()

    const authenticate = async (db, username, password) => {
        const user = await db.table('users').findOne({ where: { username } })
    
        if (user && (await bcrypt.compare(password, user.password))) {
            return { id: user.id, username: user.username }
        }
    
        return null
    }

    loginRouter.post('/login', bodyParser.json(), async (req, res) => {
        const { username, password } = req.body

        const user = await authenticate(db, username, password)

        if (user) {
            req.session.user = user
            res.redirect('/admin')
        } else {
            res.send('Invalid username or password')
        }
    })

    loginRouter.get('/logout', (req, res) => {
        req.session.destroy()
        res.redirect('/login')
    })

    const router = buildAuthenticatedRouter(admin, {
        authenticate: async (db, username, password) => {
            const user = await authenticate(db, username, password)

            if (user) {
                req.session.user = user
                return user
            }

            return null
        },
        cookieName: 'username',
        cookiePassword: 'password',
    })

    app.use('/login', loginRouter)
    app.use('/admin', router)
    app.use(bodyParser.json())

    app.listen(PORT, () => {
        console.log('app started')
    })
}

start()


