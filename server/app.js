const express = require('express');
const app = express();

const pool = require('./src/db.connect.js');

require('dotenv').config({ path: '../.env' });

const port = process.env.SERVER_PORT;

//----------------USING----------------------
app.use(express.json());

//Remove in production
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.get('/api', (req, res) => {
    res.send('Api is running...');
});


app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM LRC_CALENDAR_PAGE_room');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: '+err.message);
    }
});
app.get('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM LRC_CALENDAR_PAGE_room WHERE id_room = $1', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Bed not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});


app.get('/api/beds', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM LRC_CALENDAR_PAGE_beds');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: '+err.message);
    }
});
app.get('/api/beds/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM LRC_CALENDAR_PAGE_beds WHERE id_beds = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Bed not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});



