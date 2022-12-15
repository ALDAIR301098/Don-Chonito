const mysql = require('mysql');

const DB_HOST = process.env.DB_HOST || 'containers-us-west-163.railway.app'
const BD_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD ||'9HhVXJlw4YBGv7Ad6Ph0'
const DB_NAME = process.env.DB_DATABASE || 'railway'
const DB_PORT = process.env.DB_PORT || '5542'

const connection =  mysql.createConnection({
    host: 'containers-us-west-163.railway.app',
    user: 'root',
    password: 'pepito123',
    database: 'railway',
    port: '5542'
});

connection.connect((error) => {
    if(error){
        console.log("Error de conexion: " + error);
        return;
    } 
    console.log("Conectado a la base de datos");
});

module.exports = connection;