const pool = require('../utils/db.connect.js');
const globalServices = require('../services/globalServices.js');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const userTableName = globalServices.sanitizeTableName('user');

exports.authenticate = async (req, res) => {
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

exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if the user already exists
        const userExists = await pool.query(`SELECT * FROM ${userTableName} WHERE username = $1 OR email = $2`, [username, email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const newUser = await pool.query(
            `INSERT INTO ${userTableName} (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *`,
            [username, passwordHash, email]
        );

        res.status(201).json({ success: true, user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await pool.query(`SELECT * FROM ${userTableName} WHERE email = $1`, [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour

        // Store the token in the database (assuming you have reset_token and reset_token_expiration columns)
        await pool.query(
            `UPDATE ${userTableName} SET reset_token = $1, reset_token_expiration = $2 WHERE email = $3`,
            [token, resetTokenExpiration, email]
        );

        // Send email with reset instructions
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n` +
                  `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                  `http://localhost:3000/reset/${token}\n\n` +
                  `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ success: false, message: 'Failed to send reset email' });
            }
            res.status(200).json({ success: true, message: 'Password reset email sent' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};