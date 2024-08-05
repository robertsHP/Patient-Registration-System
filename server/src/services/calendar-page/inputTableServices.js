const globalServices = require('../globalServices.js');

const inputAppointmentTableName = globalServices.sanitizeTableName('input_table_appointment');

const patientTableName = globalServices.sanitizeTableName('patient');
const doctorTableName = globalServices.sanitizeTableName('doctor');
const roomTableName = globalServices.sanitizeTableName('room');
const floorTableName = globalServices.sanitizeTableName('floor');
const appointmentTypeTableName = globalServices.sanitizeTableName('appointment_type');


function prepareGetAppointmentsClauses(year, month, params) {
    let yearAndMonthCond = '';

    let appointmentConditions = [];
    
    if (year !== null && month !== null) {
        yearAndMonthCond = `
            (EXTRACT(YEAR FROM a.begin_date AT TIME ZONE 'EET') = $${params.length + 1} 
            AND EXTRACT(MONTH FROM a.begin_date AT TIME ZONE 'EET') = $${params.length + 2})
        `;
        appointmentConditions.push(yearAndMonthCond);
        params.push(year, month);
    }
    
    const appointmentClause = appointmentConditions.length > 0
        ? 'WHERE ' + appointmentConditions.join(' AND ')
        : '';

    return { appointmentClause };
}

exports.buildGetAppointmentsQuery = (year, month, limit, offset) => {
    const params = [];

    const { appointmentClause } = prepareGetAppointmentsClauses(year, month, params);

    let query = `
        SELECT
            a.id,
            a.begin_date,
            a.notes,
            jsonb_build_object(
                'id', p.id,
                'pat_name', p.pat_name,
                'phone_num', p.phone_num
            ) AS patient,
            jsonb_build_object(
                'id', d.id,
                'doc_name', d.doc_name
            ) AS doctor
        FROM 
            ${inputAppointmentTableName} AS a
            LEFT JOIN ${patientTableName} AS p ON a.id_patient = p.id
            LEFT JOIN ${doctorTableName} AS d  ON a.id_doctor = d.id
        ${appointmentClause}
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2};
    `;

    params.push(limit, offset);

    return {
        query,
        params
    };
};

exports.alterAppointmentObjects = async (data) => {
    // Helper function to update table and set ID
    const updateRecord = async (table, obj, idField) => {
        if (obj == null) {
            data[idField] = null;
            delete data[table];
        } else if (obj.id == null) {
            const result = await globalServices.insertIntoTable(table, obj);
            data[idField] = result.rows[0].id;
            delete data[table];
        } else {
            const result = await globalServices.updateInTable(table, obj.id, obj);
            data[idField] = result.rows[0].id;
            delete data[table];
        }
    };

    // Update patient record
    await updateRecord('patient', data.patient, 'id_patient');

    // Update doctor record
    await updateRecord('doctor', data.doctor, 'id_doctor');

    return data;
};
