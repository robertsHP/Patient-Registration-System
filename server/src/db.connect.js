// // const { Pool } = require('pg');
// const Sequelize = require('sequelize');

// require('dotenv').config({ path: '../.env' });

// // const pool = new Pool({
// //     user:       process.env.POSTGRES_USER,
// //     password:   process.env.POSTGRES_PASSWORD,
// //     host:       process.env.POSTGRES_HOST,
// //     port:       process.env.POSTGRES_PORT,
// //     database:   process.env.POSTGRES_DB
// // });

// const sequelize = new Sequelize(
//     process.env.POSTGRES_DB, 
//     process.env.POSTGRES_USER, 
//     process.env.POSTGRES_PASSWORD, 
//     {
//         host: process.env.POSTGRES_HOST,
//         port: process.env.POSTGRES_PORT,
//         dialect: 'postgres'
//     }
// );

// module.exports = sequelize;


const { Pool } = require('pg');

require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    user:       process.env.POSTGRES_USER,
    password:   process.env.POSTGRES_PASSWORD,
    host:       process.env.POSTGRES_HOST,
    port:       process.env.POSTGRES_PORT,
    database:   process.env.POSTGRES_DB
});

module.exports = pool;