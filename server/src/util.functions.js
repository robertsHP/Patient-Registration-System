

const sanitizeTableName = (tableName) => {
    console.log(`Sanitizing table name: ${tableName}`);
    const allowedTables = [
        'room', 'beds', 'sauna'
    ];
    const normalizedTableName = tableName.toLowerCase();
    if (allowedTables.includes(normalizedTableName)) {
        return normalizedTableName;
    } else {
        console.error(`Attempted to access invalid table: ${tableName}`);
        throw new Error('Invalid table name');
    }
};

module.exports = {
    sanitizeTableName
};