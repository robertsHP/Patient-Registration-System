
const express = require('express');
const app = express();

const pool = require('./src/db.connect.js');
const func = require('./src/util.functions.js');
require('dotenv').config({ path: '../.env' });

const port = process.env.SERVER_PORT;
const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

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

app.get('/api/:tableName', async (req, res) => {
    const { tableName } = req.params;
    try {
        var sanitizedTableName = prefix + func.sanitizeTableName(tableName);
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
        var sanitizedTableName = prefix + func.sanitizeTableName(tableName);
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

app.post('/api/:tableName', async (req, res) => {
    const { tableName } = req.params;
    const data = req.body; // Assuming JSON body with keys matching table columns
    const sanitizedTableName = prefix + func.sanitizeTableName(tableName);
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

    try {
        const result = await pool.query(`INSERT INTO ${sanitizedTableName} (${columns}) VALUES (${valuePlaceholders}) RETURNING *`, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});

app.put('/api/:tableName/:id', async (req, res) => {
    const { tableName, id } = req.params;
    const data = req.body;
    const sanitizedTableName = prefix + func.sanitizeTableName(tableName);
    const updates = Object.keys(data).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(data);
    values.push(id);

    try {
        const result = await pool.query(`UPDATE ${sanitizedTableName} SET ${updates.join(', ')} WHERE id = $1 RETURNING *`, values);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});

app.delete('/api/:tableName/:id', async (req, res) => {
    const { tableName, id } = req.params;
    const sanitizedTableName = prefix + func.sanitizeTableName(tableName);

    try {
        const result = await pool.query(`DELETE FROM ${sanitizedTableName} WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});