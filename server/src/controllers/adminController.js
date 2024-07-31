const bcrypt = require('bcrypt');

const adminServices = require('../services/adminServices');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await adminServices.findUserByEmail(email);
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await adminServices.createUser(username, email, hashedPassword);
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    let user = await adminServices.findUserByEmail(email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.username;
    res.status(200).json({ message: 'Logged in successfully' });
};

// exports.forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     try {
//         let user = await findUserByEmail(email);
//         if (!user) {
//             return res.status(400).json({ msg: 'User not found' });
//         }
//         // Generate reset token (for simplicity, just send a response here)
//         res.status(200).json({ msg: 'Password reset link sent' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
