

const allowedTables = [
    //Calendar Page
    'patient_type', 'patient', 'floor', 'room', 'bed', 'doctor', 'event'
];

exports.sanitizeTableName = (tableName) => {
    if (allowedTables.includes(tableName)) {
        return tableName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    } else {
        var error = `Attempted to access table: '${tableName}'. Invalid table name`;

        console.error(error);
        throw new Error(error);
    }
};