

const sanitizeTableName = (tableName) => {
    console.log(`Sanitizing table name: ${tableName}`);
    const allowedTables = [
        'room', 'patient', 
        
        'beds', 'sauna'
    ];
    const normalizedTableName = tableName.toLowerCase();

    if (allowedTables.includes(normalizedTableName)) {
        return normalizedTableName;
    } else {
        var error = `Attempted to access table: '${tableName}'. Invalid table name`;

        console.error(error);
        throw new Error(error);
    }
};

module.exports = {
    sanitizeTableName
};