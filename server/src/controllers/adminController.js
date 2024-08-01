const bcrypt = require('bcrypt');

const adminServices = require('../services/adminServices');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await adminServices.findUserByEmail(email);
        if (user) {
            return res.json('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await adminServices.createUser(username, email, hashedPassword);
        res.json({});
    } catch (err) {
        console.error(err.message);
        res.json('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    let user = await adminServices.findUserByEmail(email);

    if (!user) {
        return res.json('Lietotājs ar šādu e-pastu nav atrasts vai neeksistē.');
    }

    var passedPasswordTrimmed = password.trim();
    var userHashedPasswordTrimmed = user.password_hash.trim();

    const isMatch = await bcrypt.compare(passedPasswordTrimmed, userHashedPasswordTrimmed);

    if (!isMatch) {
        return res.json('Nepareizi ievadīta parole');
    }

    req.session.userId = user.id;
    res.json(user.id);
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err.message);
            return res.json('Server error');
        }
        res.json('Logged out successfully');
    });
};

exports.checkLogin = (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ loggedIn: true, userId: req.session.userId });
    } else {
        res.json({ loggedIn: false });
    }
};