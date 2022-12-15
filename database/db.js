const mysql = require('mysql');

const DB_HOST = process.env.DB_HOST || 'localhost'
const BD_USER = process.env.DB_USER || 'bakeryAdmin'
const DB_PASSWORD = process.env.DB_PASSWORD ||'pepito123'
const DB_DATABASE = process.env.DB_DATABASE || 'bakery'
const DB_PORT = process.env.DB_PORT || '3306'

const connection =  mysql.createConnection({
    host: DB_HOST,
    user: BD_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
});

connection.connect((error) => {
    if(error){
        console.log("Error de conexion: " + error);
        return;
    } 
    console.log("Conectado a la base de datos");
});

module.exports = connection;