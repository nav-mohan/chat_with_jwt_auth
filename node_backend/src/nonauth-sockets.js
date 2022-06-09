/**
 * ===============================================================
 * Database Configurations
 * ===============================================================
 */
var { mySqlConnection, FETCH_QUERY } = require('./mysql-connection');

/**
 * ===============================================================
 * Non-Authenticated Sockets
 * ===============================================================
 */

let nonAuthySockets = [];

const onNonAuthyConnect = (socket) => {
    mySqlConnection.query(FETCH_QUERY, (err, sqlFetchResult) => {
        if (err) throw err;
        socket.emit("ReceiveHistory", sqlFetchResult);
    });
    nonAuthySockets.push(socket),
        console.log(`${socket.id} has connected non-authy`);
    socket.on('disconnect', (reason) => {
        console.log(`Non-authy socket ${socket.id} disconnected because ${reason}`)
        nonAuthySockets = nonAuthySockets.filter((sock) => { return (sock.id !== socket.id) });
    })
}

module.exports = {onNonAuthyConnect}
