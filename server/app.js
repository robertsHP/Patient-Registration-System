const express = require('express');
const app = express();
require('dotenv').config();

// const port = process.env.SERVER_PORT;
const port = 5000;

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

app.get('/data', (req, res) => {
    res.json({
        name: "John Doe",
        age: 20,
        courses: ["Math", "Science", "English"]
    });
});
app.post('/data', (req, res) => {
    console.log(req.body);
});

app.get('/api', async (req, res) => {
    try {
        // const result = await pool.query('SELECT * FROM your_table');
        // res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});
app.post('/api', async (req, res) => {
    try {
        // const text = 'INSERT INTO your_table(column1, column2) VALUES($1, $2)';
        // const values = [req.body.value1, req.body.value2];
        // await pool.query(text, values);
        // res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});