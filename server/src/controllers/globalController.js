
const globalServices = require('../services/globalServices.js');

exports.selectFromTable = async (req, res) => {
    const { tableName } = req.params;
    try {
        const result = await globalServices.selectFromTable(tableName);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

exports.selectWithIDFromTable = async (req, res) => {
    const { tableName, id } = req.params;
    try {
        const result = await globalServices.selectWithIDFromTable(tableName, id);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

exports.insertIntoTable = async (req, res) => {
    const { tableName } = req.params;
    const data = req.body; // Assuming JSON body with keys matching table columns
    try {
        const result = await globalServices.insertIntoTable(tableName, data);
        res.json(result.rows[0].id);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

exports.updateInTable = async (req, res) => {
    const { tableName, id } = req.params;
    const data = req.body;
    try {
        const result = await globalServices.updateInTable(tableName, id, data);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

exports.deleteFromTable = async (req, res) => {
    const { tableName, id } = req.params;
    try {
        const result = await globalServices.deleteFromTable(tableName, id);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};