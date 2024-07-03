const db = require('../utils/db.connect.js');
const func = require('../utils/functions.js');

require('dotenv').config({ path: '../.env' });

const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

function buildGetEventQuery (year, month, limit, offset) {
    const eventTableName = `${prefix}${func.sanitizeTableName('event')}`;
    const patientTableName = `${prefix}${func.sanitizeTableName('patient')}`;
    const doctorTableName = `${prefix}${func.sanitizeTableName('doctor')}`;
    const roomTableName = `${prefix}${func.sanitizeTableName('room')}`;
    const floorTableName = `${prefix}${func.sanitizeTableName('floor')}`;
    const patientTypeTableName = `${prefix}${func.sanitizeTableName('patient_type')}`;

    let baseQuery = `
        SELECT 
            e.begin_date,
            e.end_date,
            e.notes,
            p.pat_name AS patient_name,
            d.doc_name AS doctor_name,
            r.room_num,
            f.floor_name,
            pt.pat_type
        FROM 
            ${eventTableName} AS e
            JOIN ${patientTableName} AS p ON e.id_patient = p.id_patient
            JOIN ${doctorTableName} AS d ON e.id_doctor = d.id_doctor
            JOIN ${roomTableName} AS r ON e.id_room = r.id_room
            JOIN ${floorTableName} AS f ON r.id_floor = f.id_floor
            JOIN ${patientTypeTableName} AS pt ON p.id_pat_type = pt.id_pat_type
    `;

    const params = [];
    let whereClause = '';
    if (year && month) {
        whereClause = `WHERE EXTRACT(YEAR FROM e.begin_date) = $${params.length + 1} AND EXTRACT(MONTH FROM e.begin_date) = $${params.length + 2}`;
        params.push(year, month);
    }
    
    let paginationClause = `ORDER BY e.begin_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    return {
        query: `${baseQuery} ${whereClause} ${paginationClause}`,
        params
    };
}

exports.getEvents = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { query, params } = buildGetEventQuery(null, null, limit, offset);

    try {
        const { rows } = await db.query(query, params);
        res.json(rows);

        // res.json(
        //     {'balsss': 'aaaaaaaaaaaaaa'}
        // );
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (getEvents) - '+err.message });
    }
};

exports.getEventsByDate = async (req, res) => {
    const { year, month, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    if (!year || !month) {
        return res.status(400).json({ error: 'Year and month are required parameters.' });
    }
    const { query, params } = buildGetEventQuery(year, month, limit, offset);

    try {
        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (getEventsByDate) - '+err.message });
    }
};

// // Get beds by month with room and patient details
// exports.getBedsByMonth = async (req, res) => {
//     const { month } = req.params;
//     try {
//         const bedsTableName = func.sanitizeTableName(prefix + 'beds');
//         const roomTableName = func.sanitizeTableName(prefix + 'room');
//         const patientTableName = func.sanitizeTableName(prefix + 'patient');

//         const [rows] = await db.query(`
//             SELECT ${prefix}beds.*, ${prefix}room.room_num, ${prefix}patient.pat_name
//             FROM ${func.sanitizeTableName(prefix + 'beds')}
//             JOIN ${func.sanitizeTableName(prefix + 'room')} ON ${func.sanitizeTableName(prefix + 'beds')}.id_room = ${func.sanitizeTableName(prefix + 'room')}.id_room
//             JOIN ${func.sanitizeTableName(prefix + 'patient')} ON ${func.sanitizeTableName(prefix + 'beds')}.id_patient = ${func.sanitizeTableName(prefix + 'patient')}.id_patient
//             WHERE MONTH(${func.sanitizeTableName(prefix + 'beds')}.begin_date) = ? OR MONTH(${func.sanitizeTableName(prefix + 'beds')}.end_date) = ?
//         `, [month, month]);
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Create a new bed entry
// exports.createBed = async (req, res) => {
//     const { id_beds, id_room, id_patient, begin_date, end_date, notes } = req.body;
//     try {
//         // Check if the room and patient exist
//         const [roomCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'room') + ' WHERE id_room = ?', [id_room]);
//         const [patientCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'patient') + ' WHERE id_patient = ?', [id_patient]);

//         if (roomCheck.length === 0) {
//             return res.status(400).json({ error: 'Room not found' });
//         }
//         if (patientCheck.length === 0) {
//             return res.status(400).json({ error: 'Patient not found' });
//         }

//         await db.query(
//             'INSERT INTO ' + func.sanitizeTableName(prefix + 'beds') + ' (id_beds, id_room, id_patient, begin_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
//             [id_beds, id_room, id_patient, begin_date, end_date, notes]
//         );
//         res.status(201).json({ message: 'Bed created successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Update a bed entry
// exports.updateBed = async (req, res) => {
//     const { id_beds } = req.params;
//     const { id_room, id_patient, begin_date, end_date, notes } = req.body;
//     try {
//         // Check if the room and patient exist
//         const [roomCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'room') + ' WHERE id_room = ?', [id_room]);
//         const [patientCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'patient') + ' WHERE id_patient = ?', [id_patient]);

//         if (roomCheck.length === 0) {
//             return res.status(400).json({ error: 'Room not found' });
//         }
//         if (patientCheck.length === 0) {
//             return res.status(400).json({ error: 'Patient not found' });
//         }

//         await db.query(
//             'UPDATE ' + func.sanitizeTableName(prefix + 'beds') + ' SET id_room = ?, id_patient = ?, begin_date = ?, end_date = ?, notes = ? WHERE id_beds = ?',
//             [id_room, id_patient, begin_date, end_date, notes, id_beds]
//         );
//         res.json({ message: 'Bed updated successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Delete a bed entry
// exports.deleteBed = async (req, res) => {
//     const { id_beds } = req.params;
//     try {
//         await db.query('DELETE FROM ' + func.sanitizeTableName(prefix + 'beds') + ' WHERE id_beds = ?', [id_beds]);
//         res.json({ message: 'Bed deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
