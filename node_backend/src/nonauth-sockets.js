const {secretServerKey} = require('./config')
console.log(secretServerKey)
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
    const jwt = require('jsonwebtoken');
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
    socket.on("joinRequest",(token)=>{
        console.log("REQUEST RECEIVED",token);
        jwt.verify(token, secretServerKey, (err, decoded) => {
            if(err){
                console.log("err");
                console.log(err)
                // if token expired
                if(err.name=='TokenExpiredError'){
                    socket.emit('ALERT',`Your login expired at ${err.expiredAt}`)
                }
                else{
                    
                }
            }
            if(decoded){
                socket.emit('ALERT',`You are connected. Your login will expire in ${decoded.exp}`);
            }
        })

    });
    socket.on('disconnect', (reason) => {
        console.log(`Non-authy socket ${socket.id} disconnected because ${reason}`)
        nonAuthySockets = nonAuthySockets.filter((sock) => { return (sock.id !== socket.id) });
    })
}

module.exports = {onNonAuthyConnect}
