const db = require('../db.connect.js');
const func = require('../util.functions.js');

require('dotenv').config({ path: '../../../.env' });

const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

// Get all sauna sessions with patient and doctor details
exports.getAllSaunaSessions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT sauna.*, patient.pat_name, doctor.doc_name
            FROM sauna
            JOIN patient ON sauna.id_patient = patient.id_patient
            JOIN doctor ON sauna.id_doctor = doctor.id_doctor
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get sauna sessions by month with patient and doctor details
exports.getSaunaSessionsByMonth = async (req, res) => {
    const { month } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT sauna.*, patient.pat_name, doctor.doc_name
            FROM sauna
            JOIN patient ON sauna.id_patient = patient.id_patient
            JOIN doctor ON sauna.id_doctor = doctor.id_doctor
            WHERE MONTH(sauna.date_and_time) = ?
        `, [month]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new sauna session
exports.createSaunaSession = async (req, res) => {
    const { id_sauna, date_and_time, id_patient, notes, id_doctor } = req.body;
    try {
        // Check if the patient and doctor exist
        const [patientCheck] = await db.query('SELECT * FROM patient WHERE id_patient = ?', [id_patient]);
        const [doctorCheck] = await db.query('SELECT * FROM doctor WHERE id_doctor = ?', [id_doctor]);

        if (patientCheck.length === 0) {
            return res.status(400).json({ error: 'Patient not found' });
        }
        if (doctorCheck.length === 0) {
            return res.status(400).json({ error: 'Doctor not found' });
        }

        await db.query(
            'INSERT INTO sauna (id_sauna, date_and_time, id_patient, notes, id_doctor) VALUES (?, ?, ?, ?, ?)',
            [id_sauna, date_and_time, id_patient, notes, id_doctor]
        );
        res.status(201).json({ message: 'Sauna session created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a sauna session
exports.updateSaunaSession = async (req, res) => {
    const { id_sauna } = req.params;
    const { date_and_time, id_patient, notes, id_doctor } = req.body;
    try {
        // Check if the patient and doctor exist
        const [patientCheck] = await db.query('SELECT * FROM patient WHERE id_patient = ?', [id_patient]);
        const [doctorCheck] = await db.query('SELECT * FROM doctor WHERE id_doctor = ?', [id_doctor]);

        if (patientCheck.length === 0) {
            return res.status(400).json({ error: 'Patient not found' });
        }
        if (doctorCheck.length === 0) {
            return res.status(400).json({ error: 'Doctor not found' });
        }

        await db.query(
            'UPDATE sauna SET date_and_time = ?, id_patient = ?, notes = ?, id_doctor = ? WHERE id_sauna = ?',
            [date_and_time, id_patient, notes, id_doctor, id_sauna]
        );
        res.json({ message: 'Sauna session updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a sauna session
exports.deleteSaunaSession = async (req, res) => {
    const { id_sauna } = req.params;
    try {
        await db.query('DELETE FROM sauna WHERE id_sauna = ?', [id_sauna]);
        res.json({ message: 'Sauna session deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};