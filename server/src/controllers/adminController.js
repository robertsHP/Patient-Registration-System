const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/User');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await createUser(name, email, hashedPassword);
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = {
        user: {
            id: user.id
        }
        };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        // Generate reset token (for simplicity, just send a response here)
        res.status(200).json({ msg: 'Password reset link sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
