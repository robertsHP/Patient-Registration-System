
const express = require('express');
const app = express();

const defaultTableRoute = require('./src/routes/defaultTableRoutes.js'); 
const bedsRoutes = require('./src/routes/bedsRoutes.js');
// const saunaRoutes = require('./src/routes/saunaRoutes.js');
// const beds4Routes = require('./src/routes/beds4Routes.js');

require('dotenv').config({ path: '../.env' });

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//----------------USING----------------------
app.use(express.json());

//Remove in production
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.get('/api', (req, res) => {
    res.send('Api is running...');
});

app.use('/api', bedsRoutes);
// app.use('/api', saunaRoutes);
// app.use('/api', beds4Routes);
app.use('/api', defaultTableRoute);