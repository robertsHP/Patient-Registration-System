const express = require('express');
const cors = require('cors');
const app = express();

const errorHandler = require('./src/middleware/errorHandler.js'); 
const defaultRoute = require('./src/routes/defaultRoutes.js'); 
const calendarPageRoutes = require('./src/routes/calendarPageRoutes.js');

require('dotenv').config({ path: '../.env' });

const port = process.env.SERVER_PORT;

// Use CORS with default settings (allows all origins)
app.use(cors());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use(express.json());

// Define your routes
app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.get('/api', (req, res) => {
    res.send('Api is running...');
});

app.use('/api', calendarPageRoutes);
app.use('/api', defaultRoute);

// Error handling middleware
app.use(errorHandler);