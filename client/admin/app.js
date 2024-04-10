import AdminJS from 'adminjs'
import express from 'express'
import Plugin from '@adminjs/express'
import { Adapter, Database, Resource } from '@adminjs/sql'

// require('dotenv').config({ path: '../../.env' });
// const PORT = process.env.CLIENT_PORT;
const PORT = 5173;

AdminJS.registerAdapter({
    Database,
    Resource,
})

const start = async () => {
  const app = express()

  const db = await new Adapter('postgresql', {
    connectionString: 'postgres://postgres:postgres@localhost:5432/patient_reg_system',
    database: 'patient_reg_system',
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
    ],
  });

  admin.watch()

  const router = Plugin.buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    console.log('app started')
  })
}

start()