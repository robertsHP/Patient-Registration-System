const globalServices = require('./globalServices.js');

const dragAppointmentTableName = globalServices.sanitizeTableName('drag_table_appointment');
const patientTableName = globalServices.sanitizeTableName('patient');
const doctorTableName = globalServices.sanitizeTableName('doctor');
const roomTableName = globalServices.sanitizeTableName('room');
const floorTableName = globalServices.sanitizeTableName('floor');
const appointmentTypeTableName = globalServices.sanitizeTableName('appointment_type');

function prepareGetAppointmentClauses(year, month, floorId, params) {
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

exports.buildGetAppointmentQuery = (year, month, floorId, limit, offset) => {
    const params = [];

    const { appointmentClause, roomClause } = prepareGetAppointmentClauses(year, month, floorId, params);

    let query = `
        WITH AppointmentDetails AS (
            SELECT
                r.id,
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
                LEFT JOIN ${patientTableName} AS p          ON e.id_patient = p.id
                LEFT JOIN ${doctorTableName} AS d           ON e.id_doctor = d.id
                LEFT JOIN ${roomTableName} AS r             ON e.id_room = r.id
                LEFT JOIN ${floorTableName} AS f            ON r.id_floor = f.id
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
                            WHERE ed.id = r.id
                        ), 
                        '[]'::jsonb
                    )
                )
            ) AS rooms
        FROM 
            ${roomTableName} AS r
            LEFT JOIN ${floorTableName} AS f ON r.id_floor = f.id
        ${roomClause}
        GROUP BY r.id, r.room_num, f.id, f.floor_name
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2};
    `;

    params.push(limit, offset);

    return {
        query,
        params
    };
}

exports.checkPatientAndDoctor = async (data) => {
    // Handling patient data
    if (data.patient) {
        if (data.patient.id === null) {
            data.id_patient = null;
        } else if (data.patient.id) {
            // If patient id exists, update the patient record
            const patientResult = await updateInTable('patient', data.patient.id, data.patient);
            data.id_patient = patientResult.rows[0].id;
        }
    }

    // Handling doctor data
    if (data.doctor) {
        if (data.doctor.id === null) {
            data.id_doctor = null;
        } else if (data.doctor.id) {
            // If doctor id exists, update the doctor record
            const doctorResult = await updateInTable('doctor', data.doctor.id, data.doctor);
            data.id_doctor = doctorResult.rows[0].id;
        }
    }

    return data;
};
