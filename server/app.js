const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

const crypto = require('crypto');

// const errorHandler = require('./src/middleware/errorHandler.js'); 

const globalRoutes = require('./src/routes/globalRoutes.js'); 
const calendarPageRoutes = require('./src/routes/calendarPageRoutes.js');
const adminRoutes = require('./src/routes/adminRoutes.js');
const sessionRoutes = require('./src/routes/sessionRoutes.js');

require('dotenv').config({ path: '../.env' });

const serverPort = process.env.SERVER_PORT;
const clientPort = process.env.CLIENT_PORT;

// Use CORS with default settings (allows all origins)
app.use(cors({
    origin: `http://localhost:${clientPort}`, // Replace with your client domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: crypto.randomBytes(64).toString('hex'), // Automatically generate a random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true if running over HTTPS
}));

app.listen(serverPort, () => {
    console.log(`Server running at http://localhost:${serverPort}`);
});

app.get('/', (req, res) => { res.send('Server is running...'); });
app.get('/api', (req, res) => { res.send('Api is running...'); });

app.use('/api', sessionRoutes);
app.use('/api', adminRoutes);
app.use('/api', calendarPageRoutes);
app.use('/api', globalRoutes);

// Error handling middleware
// app.use(errorHandler);