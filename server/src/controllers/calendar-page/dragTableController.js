const pool = require('../../utils/db.connect.js');

const dragTableServices = require('../../services/calendar-page/dragTableServices.js');
const globalServices = require('../../services/globalServices.js');

exports.getRooms = async (req, res) => {
    const { floorId, year = null, month = null, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!floorId) {
        return res.status(400).json({ error: '(getRooms) - Floor ID is a required parameter.' });
    }

    const { query, params } = dragTableServices.buildGetRoomsQuery(
        year, month, floorId, limit, offset
    );

    try {
        const dataResult = await pool.query(query, params);
        const data = dataResult.rows;

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error (getRooms) - ' + err.message });
    }
};

exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        await dragTableServices.deleteAppointmentsForRoom(id);
        await globalServices.deleteFromTable('room', id);
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};

exports.insertAppointmentAndOtherData = async (req, res) => {
    var data = req.body; // Assuming JSON body with keys matching table columns
    try {
        if(data.id != undefined || data.id != null) {
            delete data.id;
        }
        data = await dragTableServices.alterAndUpdateAppointmentObjects(data);

        const result = await globalServices.insertIntoTable(
            'drag_table_appointment', 
            data
        );

        res.json(result.rows[0].id);
    } catch (err) {
        res.status(500).json(
            { error: 'Internal Server Error (insertAppointmentAndOtherData) - ' + err.message }
        );
    }
};

exports.updateAppointmentAndOtherData = async (req, res) => {
    const { id } = req.params;
    var data = req.body; // Assuming JSON body with keys matching table columns

    var result = null;

    try {
        if(data.id != undefined || data.id != null) {
            delete data.id;
        }
        data = await dragTableServices.alterAndUpdateAppointmentObjects(data);
        
        result = await globalServices.updateInTable(
            'drag_table_appointment', 
            id, 
            data
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ 
            error: 'Internal Server Error (updateAppointmentAndOtherData) - ' + err.message,
            // result: result,
            // data: data
        });
    }
};

exports.deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await globalServices.deleteFromTable('drag_table_appointment', id);
        res.send('Row deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
};