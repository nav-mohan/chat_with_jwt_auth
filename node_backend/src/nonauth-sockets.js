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

const onJoinRequestReceived = (socket) => {

}

const onNonAuthyConnect = (socket) => {
    try {
        mySqlConnection.query(FETCH_QUERY, (err, sqlFetchResult) => {
            if (err) throw err;
            console.log("SENDING_CHAT_HISTORY")
            socket.emit("ReceiveHistory", sqlFetchResult);
            socket.emit("ALERT",`sql success!`)
        });
    } catch (error) {
        console.log("error while squealing ",error)
        socket.emit("ALERT",`Unable to fetch chat history because ${error}`)
    }
    nonAuthySockets.push(socket),
    console.log(`${socket.id} has connected non-authy`);
    socket.on("SEND_REQUEST",(data)=>{
        console.log("REQUEST RECEIVED",data);
        socket.emit("JOIN_REQUEST_ACCEPTED")
    });
    socket.on('disconnect', (reason) => {
        console.log(`Non-authy socket ${socket.id} disconnected because ${reason}`)
        nonAuthySockets = nonAuthySockets.filter((sock) => { return (sock.id !== socket.id) });
    })
}

module.exports = {onNonAuthyConnect}
