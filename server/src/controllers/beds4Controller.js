const db = require('../db.connect.js');
const func = require('../util.functions.js');

require('dotenv').config({ path: '../../../.env' });

const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

// Get all beds4 with room and patient details
exports.getAllBeds4 = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT beds4.*, room.room_num, patient.pat_name
            FROM beds4
            JOIN room ON beds4.id_room = room.id_room
            JOIN patient ON beds4.id_patient = patient.id_patient
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get beds4 by month with room and patient details
exports.getBeds4ByMonth = async (req, res) => {
    const { month } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT beds4.*, room.room_num, patient.pat_name
            FROM beds4
            JOIN room ON beds4.id_room = room.id_room
            JOIN patient ON beds4.id_patient = patient.id_patient
            WHERE MONTH(beds4.begin_date) = ? OR MONTH(beds4.end_date) = ?
        `, [month, month]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new bed4 entry
exports.createBed4 = async (req, res) => {
    const { id_beds4, id_room, id_patient, begin_date, end_date, notes } = req.body;
    try {
        // Check if the room and patient exist
        const [roomCheck] = await db.query('SELECT * FROM room WHERE id_room = ?', [id_room]);
        const [patientCheck] = await db.query('SELECT * FROM patient WHERE id_patient = ?', [id_patient]);

        if (roomCheck.length === 0) {
            return res.status(400).json({ error: 'Room not found' });
        }
        if (patientCheck.length === 0) {
            return res.status(400).json({ error: 'Patient not found' });
        }

        await db.query(
            'INSERT INTO beds4 (id_beds4, id_room, id_patient, begin_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [id_beds4, id_room, id_patient, begin_date, end_date, notes]
        );
        res.status(201).json({ message: 'Bed4 created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a bed4 entry
exports.updateBed4 = async (req, res) => {
    const { id_beds4 } = req.params;
    const { id_room, id_patient, begin_date, end_date, notes } = req.body;
    try {
        // Check if the room and patient exist
        const [roomCheck] = await db.query('SELECT * FROM room WHERE id_room = ?', [id_room]);
        const [patientCheck] = await db.query('SELECT * FROM patient WHERE id_patient = ?', [id_patient]);

        if (roomCheck.length === 0) {
            return res.status(400).json({ error: 'Room not found' });
        }
        if (patientCheck.length === 0) {
            return res.status(400).json({ error: 'Patient not found' });
        }

        await db.query(
            'UPDATE beds4 SET id_room = ?, id_patient = ?, begin_date = ?, end_date = ?, notes = ? WHERE id_beds4 = ?',
            [id_room, id_patient, begin_date, end_date, notes, id_beds4]
        );
        res.json({ message: 'Bed4 updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a bed4 entry
exports.deleteBed4 = async (req, res) => {
    const { id_beds4 } = req.params;
    try {
        await db.query('DELETE FROM beds4 WHERE id_beds4 = ?', [id_beds4]);
        res.json({ message: 'Bed4 deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};