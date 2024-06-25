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




// app.get('/api/events', (req, res) => {
//     res.json({
//         0: [
//             401, 
//             'Vladislavs', 
//             '2024-03-28', 
//             '2024-04-04'
//         ],
//         1: [
//             403, 
//             'Katrīna', 
//             '2024-01-20', 
//             '2024-01-30'
//         ],
//         2: [
//             403, 
//             'Anda', 
//             '2024-04-15', 
//             '2024-04-19'
//         ],

//     });
// });

// app.get('/api/rooms', (req, res) => {
//     res.json({
//         0: [
//             401, 
//             [ 'lielā gulta', 'dīvāns' ]
//         ],
//         1: [
//             402, 
//             [ 'lielā gulta', 'izv.dīv.' ]
//         ],
//         2: [
//             403, 
//             [ '', '4 vienv.g.', '', '' ]
//         ],
//         3: [
//             404, 
//             [ 'gulta', '', '', 'gulta' ]
//         ],
//     });
// });


// app.post('/data', (req, res) => {
//     console.log(req.body);
// });

// app.post('/api', async (req, res) => {
//     try {
//         // const text = 'INSERT INTO your_table(column1, column2) VALUES($1, $2)';
//         // const values = [req.body.value1, req.body.value2];
//         // await pool.query(text, values);
//         // res.json({ status: 'success' });
//     } catch (err) {
//         console.error(err);
//         res.send("Error " + err);
//     }
// });

// app.get('/users', async (req, res) => {
//     try {
//         let column = req.column;
//         let value = req.value;
//         if(typeof column === 'string' && typeof value === 'string') {
//             let sql = `SELECT * FROM users WHERE ${column} = $1`;
//             pool.query(sql, [value], (err, results) => {
//                 if(err) throw err;
//                 res.send(results);
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         res.send("Error " + err);
//     }
// });

// app.put('/users/:id', (req, res) => {
//     let sql = 'UPDATE users WHERE id = $1';
//     let id = req.params.id;
//     pool.query(sql, id, (err, result) => {
//         if (err) throw err;
//         res.send(`User with ID ${id} deleted.`);
//     });
// });

// app.delete('/users/:id', (req, res) => {
//     let sql = 'DELETE FROM users WHERE id = $1';
//     let id = req.params.id;
//     pool.query(sql, id, (err, result) => {
//         if (err) throw err;
//         res.send(`User with ID ${id} deleted.`);
//     });
// });



// app.post('/api', async (req, res) => {
//     try {
//         // const text = 'INSERT INTO your_table(column1, column2) VALUES($1, $2)';
//         // const values = [req.body.value1, req.body.value2];
//         // await pool.query(text, values);
//         // res.json({ status: 'success' });
//     } catch (err) {
//         console.error(err);
//         res.send("Error " + err);
//     }
// });