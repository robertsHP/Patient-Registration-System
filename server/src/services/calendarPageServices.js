const globalServices = require('./globalServices.js');

require('dotenv').config({ path: '../.env' });

const prefix = process.env.CALENDAR_PAGE_TABLE_PREFIX;

const eventTableName = `${prefix}${globalServices.sanitizeTableName('event')}`;
const patientTableName = `${prefix}${globalServices.sanitizeTableName('patient')}`;
const doctorTableName = `${prefix}${globalServices.sanitizeTableName('doctor')}`;
const roomTableName = `${prefix}${globalServices.sanitizeTableName('room')}`;
const floorTableName = `${prefix}${globalServices.sanitizeTableName('floor')}`;
const patientTypeTableName = `${prefix}${globalServices.sanitizeTableName('patient_type')}`;

function prepareGetEventClauses(year, month, floorId, params) {
    let yearAndMonthCond = '';
    let floorCond = '';

    let eventConditions = [];
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
        eventConditions.push(yearAndMonthCond);
        params.push(year, month);
    }
    
    if (floorId !== null) {
        floorCond = `f.id_floor = $${params.length + 1}`;
        eventConditions.push(floorCond);
        roomConditions.push(floorCond);
        params.push(floorId);
    }
    
    const eventClause = eventConditions.length > 0
        ? 'WHERE ' + eventConditions.join(' AND ')
        : '';
    const roomClause = roomConditions.length > 0
        ? 'WHERE ' + roomConditions.join(' AND ')
        : '';

    return { eventClause, roomClause };
}

exports.buildGetEventQuery = (year, month, floorId, limit, offset) => {
    const params = [];

    const { eventClause, roomClause } = prepareGetEventClauses(year, month, floorId, params);

    let query = `
        WITH EventDetails AS (
            SELECT
                r.id_room,
                jsonb_build_object(
                    'id_event', e.id_event,
                    'begin_date', e.begin_date,
                    'end_date', e.end_date,
                    'notes', e.notes,
                    'patient', jsonb_build_object(
                        'id_patient', p.id_patient,
                        'pat_name', p.pat_name,
                        'phone_num', p.phone_num,
                        'hotel_stay_start', p.hotel_stay_start,
                        'hotel_stay_end', p.hotel_stay_end,
                        'patient_type', jsonb_build_object(
                            'id_pat_type', pt.id_pat_type,
                            'pat_type', pt.pat_type
                        )
                    ),
                    'doctor', jsonb_build_object(
                        'id_doctor', d.id_doctor,
                        'doc_name', d.doc_name
                    )
                ) AS event_data
            FROM 
                ${eventTableName} AS e
                JOIN ${patientTableName} AS p ON e.id_patient = p.id_patient
                JOIN ${doctorTableName} AS d ON e.id_doctor = d.id_doctor
                JOIN ${roomTableName} AS r ON e.id_room = r.id_room
                JOIN ${floorTableName} AS f ON r.id_floor = f.id_floor
                JOIN ${patientTypeTableName} AS pt ON p.id_pat_type = pt.id_pat_type
            ${eventClause}
        )

        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'id_room', r.id_room,
                    'room_num', r.room_num,
                    'events', (
                        SELECT jsonb_agg(event_data)
                        FROM EventDetails ed
                        WHERE ed.id_room = r.id_room
                    )
                )
            ) AS rooms
        FROM 
            ${roomTableName} AS r
            JOIN ${floorTableName} AS f ON r.id_floor = f.id_floor
        ${roomClause}
        GROUP BY r.id_room, r.room_num, f.id_floor, f.floor_name
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2};
    `;

    params.push(limit, offset);

    return {
        query,
        params
    };
}
