
exports.getAll = async (req, res) => {
    if (req.session) {
        res.status(200).json(req.session);
    } else {
        res.status(404).json({ message: 'Session data not found' });
    }
};

exports.get = async (req, res) => {
    const { key } = req.query;
    if (key) {
        const value = req.session[key];
        if (value !== undefined) {
            res.status(200).json({ key, value });
        } else {
            res.status(404).json({ message: 'Key not found in session' });
        }
    } else {
        res.status(200).json(req.session);
    }
};

exports.post = async (req, res) => {
    const { key, value } = req.body;
    if (key && value !== undefined) {  // Check for undefined to allow falsy values like 0 or false
        req.session[key] = value;
        res.status(200).json({ message: 'Session updated', key, value });
    } else {
        res.status(400).json({ message: 'Key and value are required' });
    }
};

exports.delete = async (req, res) => {
    const { key } = req.body;
    if (key) {
        delete req.session[key];
        res.status(200).json({ message: 'Session key deleted', key });
    } else {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ message: 'Failed to clear session' });
            } else {
                res.clearCookie('connect.sid');  // Adjust the cookie name based on your config
                res.status(200).json({ message: 'Session cleared' });
            }
        });
    }
};