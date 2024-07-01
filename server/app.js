
const express = require('express');
const app = express();

const defaultTableRoute = require('./src/routes/defaultTableRoute.js'); 

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

app.use('/api', defaultTableRoute); 


// app.get('/api/beds', async (req, res) => {
//     try {
//         // Sanitize and prefix the table names
//         const sanitizedBedsTableName = prefix + func.sanitizeTableName("beds");
//         const sanitizedRoomTableName = prefix + func.sanitizeTableName("room");
//         const sanitizedPatientTableName = prefix + func.sanitizeTableName("patient");

//         // Define the query with the prefixed and sanitized table names
//         const query = `
//             SELECT 
//                 b.id_beds, 
//                 b.begin_date, 
//                 b.end_date, 
//                 b.notes, 
//                 r.room_num, 
//                 p.pat_name, 
//                 p.phone_num,
//                 p.hotel_stay_start,
//                 p.hotel_stay_end
//             FROM ${sanitizedBedsTableName} b
//             JOIN ${sanitizedRoomTableName} r ON b.id_room = r.id_room
//             JOIN ${sanitizedPatientTableName} p ON b.id_patient = p.id_patient;
//         `;

//         // Execute the query
//         const result = await pool.query(query);

//         // Send the result as a JSON response
//         res.json(result.rows);
//     } catch (err) {
//         // Log the error and send a server error response
//         console.error(err.message);
//         res.status(500).send('Server error: ' + err.message);
//     }
// });