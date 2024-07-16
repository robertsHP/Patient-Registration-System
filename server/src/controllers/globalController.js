const pool = require('../utils/db.connect.js');

const globalServices = require('../services/globalServices.js');

exports.selectFromTable = async (req, res) => {
    res.json({'test': 'test'});
}

// exports.selectFromTable = async (req, res) => {
//     var params = req.params;

//     try {
//         var sanitizedTableName = globalServices.sanitizeTableName(params.tableName);
//         const result = await pool.query(`SELECT * FROM ${sanitizedTableName}`);
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error: ' + err.message);
//     }
// }

// exports.selectWithIDFromTable = async (req, res) => { 
//     const { tableName, id } = req.params;
//     try {
//         var sanitizedTableName = globalServices.sanitizeTableName(tableName);
//         const result = await pool.query(`SELECT * FROM ${sanitizedTableName} WHERE id = $1`, [id]);
//         if (result.rows.length === 0) {
//             return res.status(404).send('Row not found');
//         }
//         res.json(result.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error: ' + err.message);
//     }
// } 

// exports.insertIntoTable = async (req, res) => {
//     const { tableName } = req.params;
//     const data = req.body; // Assuming JSON body with keys matching table columns
//     const sanitizedTableName = globalServices.sanitizeTableName(tableName);

//     // Prepare columns and values, considering the possibility of 'id' being null
//     const columns = Object.keys(data).join(', ');
//     const values = Object.values(data);
//     const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

//     let query = `INSERT INTO ${sanitizedTableName} (${columns}) VALUES (${valuePlaceholders}) RETURNING id`;
//     let queryValues = values;

//     try {
//         const result = await pool.query(query, queryValues);
//         res.json(result.rows[0].id)
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error: ' + err.message);
//     }
// };

// exports.updateInTable = async (req, res) => { 
//     const { tableName, id } = req.params;
//     const data = req.body;
//     const sanitizedTableName = globalServices.sanitizeTableName(tableName);
    
//     const updates = Object.keys(data).map((key, index) => `${key} = $${index + 2}`);
//     const values = [parseInt(id), ...Object.values(data)];

//     try {
//         const query = `UPDATE ${sanitizedTableName} SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;

//         const result = await pool.query(query, values);
//         if (result.rows.length === 0) {
//             return res.status(404).send('Row not found');
//         }
//         res.json(result.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error: ' + err.message);
//     }
// }

// exports.deleteFromTable = async (req, res) => { 
//     const { tableName, id } = req.params;
//     const sanitizedTableName = globalServices.sanitizeTableName(tableName);

//     try {
//         const result = await pool.query(`DELETE FROM ${sanitizedTableName} WHERE id = $1 RETURNING *`, [id]);
//         if (result.rows.length === 0) {
//             return res.status(404).send('Row not found');
//         }
//         res.send('Row deleted');
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error: ' + err.message);
//     }
// }
