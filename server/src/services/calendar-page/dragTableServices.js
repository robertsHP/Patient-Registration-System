const globalServices = require('../globalServices.js');

const dragAppointmentTableName = globalServices.sanitizeTableName('drag_table_appointment');

const patientTableName = globalServices.sanitizeTableName('patient');
const doctorTableName = globalServices.sanitizeTableName('doctor');
const roomTableName = globalServices.sanitizeTableName('room');
const floorTableName = globalServices.sanitizeTableName('floor');
const appointmentTypeTableName = globalServices.sanitizeTableName('appointment_type');


function prepareGetRoomsClauses(year, month, floorId, params) {
    let yearAndMonthCond = '';
    let floorCond = '';

    let appointmentConditions = [];
    let roomConditions = [];
    
    if (year !== null && month !== null) {
        yearAndMonthCond = `
            (
                (EXTRACT(YEAR FROM e.begin_date AT TIME ZONE 'EET') = $${params.length + 1} 
                AND EXTRACT(MONTH FROM e.begin_date AT TIME ZONE 'EET') = $${params.length + 2})
                OR
                (EXTRACT(YEAR FROM e.end_date AT TIME ZONE 'EET') = $${params.length + 1} 
                AND EXTRACT(MONTH FROM e.end_date AT TIME ZONE 'EET') = $${params.length + 2})
            )
        `;
        appointmentConditions.push(yearAndMonthCond);
        params.push(year, month);
    }
    
    if (floorId !== null) {
        floorCond = `f.id = $${params.length + 1}`;
        appointmentConditions.push(floorCond);
        roomConditions.push(floorCond);
        params.push(floorId);
    }
    
    const appointmentClause = appointmentConditions.length > 0
        ? 'WHERE ' + appointmentConditions.join(' AND ')
        : '';
    const roomClause = roomConditions.length > 0
        ? 'WHERE ' + roomConditions.join(' AND ')
        : '';

    return { appointmentClause, roomClause };
}

exports.buildGetRoomsQuery = (year, month, floorId, limit, offset) => {
    const params = [];

    const { appointmentClause, roomClause } = prepareGetRoomsClauses(year, month, floorId, params);

    let query = `
        WITH AppointmentDetails AS (
            SELECT
                r.id AS room_id,
                jsonb_build_object(
                    'id', e.id,
                    'patient', jsonb_build_object(
                        'id', p.id,
                        'pat_name', p.pat_name,
                        'phone_num', p.phone_num
                    ),
                    'begin_date', e.begin_date,
                    'end_date', e.end_date,
                    'notes', e.notes,
                    'doctor', jsonb_build_object(
                        'id', d.id,
                        'doc_name', d.doc_name
                    ),
                    'hotel_stay_start', e.hotel_stay_start,
                    'hotel_stay_end', e.hotel_stay_end,
                    'appointment_type', jsonb_build_object(
                        'id', at.id,
                        'type_name', at.type_name
                    )
                ) AS appointment_data
            FROM 
                ${dragAppointmentTableName} AS e
                LEFT JOIN ${patientTableName} AS p ON e.id_patient = p.id
                LEFT JOIN ${doctorTableName} AS d ON e.id_doctor = d.id
                LEFT JOIN ${roomTableName} AS r ON e.id_room = r.id
                LEFT JOIN ${floorTableName} AS f ON r.id_floor = f.id
                LEFT JOIN ${appointmentTypeTableName} AS at ON e.id_appointment_type = at.id
            ${appointmentClause}
        )

        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'id', r.id,
                    'room_num', r.room_num,
                    'appointments', COALESCE(
                        (
                            SELECT jsonb_agg(appointment_data)
                            FROM AppointmentDetails ed
                            WHERE ed.room_id = r.id
                        ), 
                        '[]'::jsonb
                    )
                )
            ) AS rooms
        FROM 
            ${roomTableName} AS r
            LEFT JOIN ${floorTableName} AS f ON r.id_floor = f.id
        ${roomClause}
        GROUP BY f.id, f.floor_name
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2};
    `;

    params.push(limit, offset);

    return {
        query,
        params
    };
};

exports.alterAndUpdateAppointmentObjects = async (data) => {
    // Helper function to update table and set ID
    const updateRecord = async (table, obj, idField) => {
        if (obj == null || obj.id == null) {
            data[idField] = null;
            delete data[table];
        // } else if (obj.id == null) {
        //     const result = await globalServices.insertIntoTable(table, obj);
        //     data[idField] = result.rows[0].id;
        //     delete data[table];
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

    // Update appointment type record
    await updateRecord('appointment_type', data.appointment_type, 'id_appointment_type');

    return data;
};
