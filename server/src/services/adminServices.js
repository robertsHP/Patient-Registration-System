const pool = require('../utils/db.connect.js');
const globalServices = require('./globalServices.js');

const userTableName = globalServices.sanitizeTableName('user');
const userRoleRelation = globalServices.sanitizeTableName('user_role_relation');

exports.createUser = async (username, email, hashedPassword) => {
    try {
        const userResult = await pool.query(
            `
                INSERT INTO ${userTableName} (username, email, password_hash) 
                VALUES ($1, $2, $3) RETURNING *
            `,
            [username, email, hashedPassword]
        );

        const newUser = userResult.rows[0];

        await pool.query(
            `INSERT INTO ${userRoleRelation} (user_id, role_id) VALUES ($1, $2)`,
            [newUser.id, 1]  // Assuming role ID 1 is the default 'User' role
        );

        return newUser;
    } catch (error) {
        throw error;
    }
};

exports.findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM ${userTableName} WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};