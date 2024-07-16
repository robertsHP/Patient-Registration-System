
const allowedTables = [
    //Calendar Page
    'patient_type', 'patient', 'floor', 'room', 'bed', 'doctor', 'event'
];

const sanitizeTableName = (tableName) => {
    if (allowedTables.includes(tableName)) {
        return tableName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    } else {
        var error = `Attempted to access table: '${tableName}'. Invalid table name`;

        console.error(error);
        throw new Error(error);
    }
};

const selectFromTable = async (req, res, prefix, pool) => { 
    var params = req.params;

    try {
        var sanitizedTableName = prefix + sanitizeTableName(params.tableName);
        const result = await pool.query(`SELECT * FROM ${sanitizedTableName}`);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}

const selectWithIDFromTable = async (req, res, prefix, pool) => { 
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
} 

const insertIntoTable = async (req, res, prefix, pool) => {
    const { tableName } = req.params;
    const data = req.body; // Assuming JSON body with keys matching table columns
    const sanitizedTableName = prefix + sanitizeTableName(tableName);

    // Prepare columns and values, considering the possibility of 'id' being null
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

    let query = `INSERT INTO ${sanitizedTableName} (${columns}) VALUES (${valuePlaceholders}) RETURNING id`;
    let queryValues = values;

    try {
        const result = await pool.query(query, queryValues);
        res.json(result.rows[0].id)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

const updateInTable = async (req, res, prefix, pool) => { 
    const { tableName, id } = req.params;
    const data = req.body;
    const sanitizedTableName = prefix + sanitizeTableName(tableName);
    
    const updates = Object.keys(data).map((key, index) => `${key} = $${index + 2}`);
    const values = [parseInt(id), ...Object.values(data)];

    try {
        const query = `UPDATE ${sanitizedTableName} SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).send('Row not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}

const deleteFromTable = async (req, res, prefix, pool) => { 
    const { tableName, id } = req.params;
    const sanitizedTableName = prefix + sanitizeTableName(tableName);

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
}

module.exports = {
    sanitizeTableName,
    selectFromTable, selectWithIDFromTable,
    insertIntoTable, updateInTable,
    deleteFromTable
};