
module.exports = (err, req, res, next) => {
    console.error(`Error message: ${err.message}`);
    console.error(`Stack trace: ${err.stack}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
};