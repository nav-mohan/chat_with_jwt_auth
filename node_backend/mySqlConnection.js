/**
 * ===============================================================
 * Environment Variables 
 * ===============================================================
 */
const { databaseAddress, databaseUser, databasePassword, 
    databaseName, databasePort, tableName } = require('./config');

/**
* ===============================================================
* MySQL Database Driver 
* ===============================================================
*/
var mysql    = require('mysql');
var mySqlConnection = mysql.createConnection({
    host     : databaseAddress,
    user     : databaseUser,
    password : databasePassword,
    database : databaseName,
    port     : databasePort
});
mySqlConnection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + mySqlConnection.threadId);
});
var FETCH_QUERY = "SELECT user_display_name, message, created_at FROM " + tableName;
var INSERT_QUERY = "INSERT INTO " + tableName + " (socket_id,user_display_name,message) VALUES ?"


module.exports = {
    mySqlConnection,
    FETCH_QUERY,
    INSERT_QUERY
}