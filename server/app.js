
const express = require('express');
const app = express();

const errorHandler = require('./src/middleware/errorHandler.js'); 
const defaultRoute = require('./src/routes/defaultRoutes.js'); 
const calendarPageRoutes = require('./src/routes/calendarPageRoutes.js');

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

app.use('/api', calendarPageRoutes);
app.use('/api', defaultRoute);
app.use(errorHandler);