const mysql = require('mysql');
const {promisify} = require('util');

const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err === 'PROTOCOL_CONNECTION_LOST'){
            console.err('La Coneccion a la base de datos ha sido cerrada')
        }
        if(err === 'ER_CON_COUNT_ERROR'){
            console.err('La base de datos tiene muchas conecciones abiertas')
        }
        if(err === 'ECONNREFUSED'){
            console.err('La Coneccion a la base de datos ha sido rechazada')
        }
    }
    if (connection) connection.release();
    console.log('La base de datos esta conectada');
    return;
});

pool.query = promisify(pool.query);
module.exports = pool;