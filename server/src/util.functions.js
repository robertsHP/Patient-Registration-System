

const sanitizeTableName = (tableName) => {
    const allowedTables = [
        'room', 'patient', 
        'beds', 'sauna'
    ];

    if (allowedTables.includes(tableName)) {
        return tableName;
    } else {
        var error = `Attempted to access table: '${tableName}'. Invalid table name`;

        console.error(error);
        throw new Error(error);
    }
};

module.exports = {
    sanitizeTableName
};