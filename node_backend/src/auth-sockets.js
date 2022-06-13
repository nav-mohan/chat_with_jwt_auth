/**
 * ===============================================================
 * Environment Variables 
 * ===============================================================
 */

const { secretServerKey,clientOrigins } = require('./config');

/**
 * ===============================================================
 * Database Configurations
 * ===============================================================
 */

var { mySqlConnection, INSERT_QUERY } = require('./mysql-connection');

/**
 * ===============================================================
 * Authenticated Sockets
 * ===============================================================
 */

var jwt = require('jsonwebtoken');

let authySockets = [];

const authyUse = (socket, next) => {
    console.log((socket.handshake.address.address, socket.handshake.address.port))
    if (socket.handshake.query && socket.handshake.query.token && socket.handshake.query.user_display_name) {
        jwt.verify(socket.handshake.query.token, secretServerKey, (err, decoded) => {
            if (err) { return next(new Error(`Authentication Failed - ${err}`)); }
            socket.decoded = decoded;
            socket.user_display_name = socket.handshake.query.user_display_name;
            console.log("DECODED", decoded)
            next();
        })
    }
    else {
        console.log(socket.id, " is missing token or user_display_name")
        next(new Error('Authentication Failed - missing token'));
    }
}
const onAuthyConnect = (socket) => {
    authySockets.push(socket)
    console.log(`${socket.user_display_name} has connected authy over socket ${socket.id}`);
    socket.on('disconnect', (reason) => {
        console.log(`Authy socket ${socket.id} disconnected because ${reason}`)
        authySockets = authySockets.filter((sock) => { return (sock.id !== socket.id) });
    })
    socket.on('sendMessage', (data) => {
        console.log(socket.user_display_name, " sent a message ", data.message, 'at time', data.created_at);
        nonAuthySockets.forEach((sock) => {
            sock.emit('ReceiveMessage', { 'message': data.message, 'user_display_name': socket.user_display_name, 'created_at': data.created_at })
        });
        log_chat = [[socket.id, socket.user_display_name, data.message]]
        mySqlConnection.query(INSERT_QUERY, [log_chat], (err, result) => {
            if (err) throw err;
            console.log(log_chat.length + " record(s) inserted");
            console.log(result)
        });
    })
}

module.exports = {authyUse,onAuthyConnect}