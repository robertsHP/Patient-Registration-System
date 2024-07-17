
require('dotenv').config({ path: '../.env' });

exports.sanitizeTableName = (tableName) => {
    const allowedCalendarTables = [
        'patient_type', 'patient', 'floor', 'room', 'bed', 'doctor', 'event'
    ];
    const allowedAdminTables = [
        'user', 'role', 'user_role_relation'
    ];

    tableName = tableName.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (allowedCalendarTables.includes(tableName)) {
        return process.env.CALENDAR_PAGE_TABLE_PREFIX + tableName;
    } else if (allowedAdminTables.includes(tableName)) {
        return process.env.ADMIN_TABLE_PREFIX + tableName;
    } else {
        var error = `Attempted to access table: '${tableName}'. Invalid table name`;

        console.error(error);
        throw new Error(error);
    }
};