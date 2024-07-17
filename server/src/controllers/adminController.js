const pool = require('../utils/db.connect.js');
const globalServices = require('../services/globalServices.js');

const userTableName = globalServices.sanitizeTableName('user');

exports.selectFromTable = async (req, res) => {
    const { username, password } = req.query;

    try {
        const result = await pool.query(
            `SELECT * FROM ${userTableName} WHERE username = $1 AND password_hash = $2`, [username, password]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Username or password is incorrect');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}
