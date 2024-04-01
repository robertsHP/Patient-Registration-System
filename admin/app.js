import express from 'express'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Adapter, Resource, Database } from '@adminjs/sql'

require('dotenv').config({ path: '../.env' });

// AdminJS.registerAdapter({
//   Database,
//   Resource,
// })

const PORT = process.env.CLIENT_PORT;
// const PORT = 3000

// const start = async () => {
//   const app = express()

//   const admin = new AdminJS({})

//   const adminRouter = AdminJSExpress.buildRouter(admin)
//   app.use(admin.options.rootPath, adminRouter)

//   // const app = express()

//   // const db = await new Adapter('postgresql', {
//   //   connectionString: 'postgres://adminjs:adminjs@localhost:5432/adminjs_panel',
//   //   database: 'adminjs_panel',
//   // }).init();

//   // const admin = new AdminJS({
//   //   resources: [
//   //     {
//   //       resource: db.table('users'),
//   //       options: {},
//   //     },
//   //   ],
//   // });

//   // admin.watch()

//   // const router = Plugin.buildRouter(admin)

//   // app.use(admin.options.rootPath, router)

//   console.log(admin.options.rootPath);

//   app.listen(PORT, () => {
//     console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
//   })
// }

// start()




//----------------USING----------------------
app.use(express.json());
//Remove in production
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//

//----------------LISTEN----------------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//----------------API----------------------

app.get('/', (req, res) => {
    res.send('Hello World!');
});