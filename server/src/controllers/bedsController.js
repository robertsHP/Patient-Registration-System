const db = require('../db.connect.js');
const func = require('../util.functions.js');

require('dotenv').config({ path: '../../../.env' });

const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

// Get all beds with room and patient details
exports.getAllBeds = async (req, res) => {
    try {
        const bedsTableName = prefix + func.sanitizeTableName('beds');
        const roomTableName = prefix + func.sanitizeTableName('room');
        const patientTableName = prefix + func.sanitizeTableName('patient');
    
        const rows = await db.query(`
            SELECT ${bedsTableName}.*, ${roomTableName}.room_num, ${patientTableName}.pat_name
            FROM ${bedsTableName}
            JOIN ${roomTableName} ON ${bedsTableName}.id_room = ${roomTableName}.id_room
            JOIN ${patientTableName} ON ${bedsTableName}.id_patient = ${patientTableName}.id_patient
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get beds by month with room and patient details
exports.getBedsByMonth = async (req, res) => {
    const { month } = req.params;
    try {
        const bedsTableName = func.sanitizeTableName(prefix + 'beds');
        const roomTableName = func.sanitizeTableName(prefix + 'room');
        const patientTableName = func.sanitizeTableName(prefix + 'patient');

        const [rows] = await db.query(`
            SELECT ${prefix}beds.*, ${prefix}room.room_num, ${prefix}patient.pat_name
            FROM ${func.sanitizeTableName(prefix + 'beds')}
            JOIN ${func.sanitizeTableName(prefix + 'room')} ON ${func.sanitizeTableName(prefix + 'beds')}.id_room = ${func.sanitizeTableName(prefix + 'room')}.id_room
            JOIN ${func.sanitizeTableName(prefix + 'patient')} ON ${func.sanitizeTableName(prefix + 'beds')}.id_patient = ${func.sanitizeTableName(prefix + 'patient')}.id_patient
            WHERE MONTH(${func.sanitizeTableName(prefix + 'beds')}.begin_date) = ? OR MONTH(${func.sanitizeTableName(prefix + 'beds')}.end_date) = ?
        `, [month, month]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new bed entry
exports.createBed = async (req, res) => {
    const { id_beds, id_room, id_patient, begin_date, end_date, notes } = req.body;
    try {
        // Check if the room and patient exist
        const [roomCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'room') + ' WHERE id_room = ?', [id_room]);
        const [patientCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'patient') + ' WHERE id_patient = ?', [id_patient]);

        if (roomCheck.length === 0) {
            return res.status(400).json({ error: 'Room not found' });
        }
        if (patientCheck.length === 0) {
            return res.status(400).json({ error: 'Patient not found' });
        }

        await db.query(
            'INSERT INTO ' + func.sanitizeTableName(prefix + 'beds') + ' (id_beds, id_room, id_patient, begin_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [id_beds, id_room, id_patient, begin_date, end_date, notes]
        );
        res.status(201).json({ message: 'Bed created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a bed entry
exports.updateBed = async (req, res) => {
    const { id_beds } = req.params;
    const { id_room, id_patient, begin_date, end_date, notes } = req.body;
    try {
        // Check if the room and patient exist
        const [roomCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'room') + ' WHERE id_room = ?', [id_room]);
        const [patientCheck] = await db.query('SELECT * FROM ' + func.sanitizeTableName(prefix + 'patient') + ' WHERE id_patient = ?', [id_patient]);

        if (roomCheck.length === 0) {
            return res.status(400).json({ error: 'Room not found' });
        }
        if (patientCheck.length === 0) {
            return res.status(400).json({ error: 'Patient not found' });
        }

        await db.query(
            'UPDATE ' + func.sanitizeTableName(prefix + 'beds') + ' SET id_room = ?, id_patient = ?, begin_date = ?, end_date = ?, notes = ? WHERE id_beds = ?',
            [id_room, id_patient, begin_date, end_date, notes, id_beds]
        );
        res.json({ message: 'Bed updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a bed entry
exports.deleteBed = async (req, res) => {
    const { id_beds } = req.params;
    try {
        await db.query('DELETE FROM ' + func.sanitizeTableName(prefix + 'beds') + ' WHERE id_beds = ?', [id_beds]);
        res.json({ message: 'Bed deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
