const express = require('express');
const app = express();

const pool = require('./src/db.connect.js');

require('dotenv').config({ path: '../.env' });

const port = process.env.SERVER_PORT;
const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

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


const sanitizeTableName = (tableName) => {
    const allowedTables = [
        'room', 
        'beds', 'beds4', 'sauna'
    ];
    if (allowedTables.includes(tableName)) {
        return tableName;
    } else {
        throw new Error('Invalid table name');
    }
};

app.get('/api/:tableName', async (req, res) => {
    const { tableName } = req.params;
    try {
        var sanitizedTableName = prefix + sanitizeTableName(tableName);
        const result = await pool.query(`SELECT * FROM ${sanitizedTableName}`);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});

app.get('/api/:tableName/:id', async (req, res) => {
    const { tableName, id } = req.params;
    try {
        var sanitizedTableName = prefix + sanitizeTableName(tableName);
        const result = await pool.query(`SELECT * FROM ${sanitizedTableName} WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});


