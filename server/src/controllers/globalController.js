const pool = require('../utils/db.connect.js');

const calendarPageServices = require('../services/calendarPageServices.js');
const globalServices = require('../services/globalServices.js');

require('dotenv').config({ path: '../.env' });

const prefix = process.env.GLOBAL_TABLE_PREFIX;

exports.selectFromTable = async (req, res) => {
    globalServices.selectFromTable(req, res, prefix, pool);
}

exports.selectWithIDFromTable = async (req, res) => { 
    globalServices.selectWithIDFromTable(req, res, prefix, pool);
} 

exports.insertIntoTable = async (req, res) => {
    globalServices.insertIntoTable(req, res, prefix, pool);
};

exports.updateInTable = async (req, res) => { 
    globalServices.updateInTable(req, res, prefix, pool);
}

exports.deleteFromTable = async (req, res) => { 
    globalServices.deleteFromTable(req, res, prefix, pool);
}
