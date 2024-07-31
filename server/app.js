const express = require('express');
const cors = require('cors');
const app = express();

// const errorHandler = require('./src/middleware/errorHandler.js'); 

const globalRoutes = require('./src/routes/globalRoutes.js'); 
const calendarPageRoutes = require('./src/routes/calendarPageRoutes.js');
const adminRoutes = require('./src/routes/adminRoutes.js');

require('dotenv').config({ path: '../.env' });

const serverPort = process.env.SERVER_PORT;
const clientPort = process.env.CLIENT_PORT;

// Use CORS with default settings (allows all origins)
app.use(cors({
    origin: `http://localhost:${clientPort}`, // Replace with your client domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.listen(serverPort, () => {
    console.log(`Server running at http://localhost:${serverPort}`);
});

app.use(express.json());

// Define your routes
app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.get('/api', (req, res) => {
    res.send('Api is running...');
});

app.use('/api/admin', adminRoutes);
app.use('/api/calendar-page', calendarPageRoutes);
app.use('/api', globalRoutes);

// Error handling middleware
// app.use(errorHandler);