/**
 * ===============================================================
 * Environment Variables 
 * ===============================================================
 */

const { 
    secretServerKey, 
    serverPort, 
    wordpressBaseUrl, 
    wordpressJwtPath, 
    authySocketPath,
    nonAuthySocketPath,
    clientOrigins
} = require('./config');

/**
 * ===============================================================
 * Import Modules 
 * ===============================================================
 */
var express    = require('express');
var app        = express();
var httpServer = require('http').Server(app);
var nonAuthyIo = require('socket.io')(httpServer,{path:authySocketPath});
var authyIo    = require('socket.io')(httpServer,{path:nonAuthySocketPath});
var jwt        = require('jsonwebtoken');
var cors       = require('cors');
const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));


console.log(fetch)
app.use(cors({ origin: clientOrigins}))

const https = require('https');

var postData = {
    'username' : 'webadmin',
    'password' : 'w3b@dm1n_p@55w0rd'
};

var options = {
  hostname: wordpressBaseUrl,
  port: 443,
  path: wordpressJwtPath,
  method: 'POST',
  body:postData,
  rejectUnauthorized:false,//this is a secruity threat. update fm949's SSL certificate with a third party cert
};

var req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

//req.write(postData);
req.end();

app.post('/login',async (req,res)=>{
    const response = await fetch(`${wordpressBaseUrl}${wordpressJwtPath}`, {
	    method: 'post',
	    body: JSON.stringify(
            {
                'username':'webadmin',
                'password':'w3b@dm1n_p@55w0rd'
            }
        ),
        strictSSL: false,
	    headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();

    console.log(data);
})

/**
 * ===============================================================
 * Database Configurations
 * ===============================================================
 */
var {mySqlConnection,FETCH_QUERY,INSERT_QUERY} = require('./mySqlConnection');

/**
 * ===============================================================
 * Non-Authenticated Sockets
 * ===============================================================
 */
let nonAuthySockets = [];

const onNonAuthyConnect = (socket) => {
    mySqlConnection.query(FETCH_QUERY,(err, sqlFetchResult) => {
        if (err) throw err;
        socket.emit("ReceiveHistory",sqlFetchResult);
    });    
    nonAuthySockets.push(socket),
    console.log(`${socket.id} has connected non-authy`);
    socket.on('disconnect',(reason)=>{
        console.log(`Non-authy socket ${socket.id} disconnected because ${reason}`)
        nonAuthySockets = nonAuthySockets.filter((sock) => {return (sock.id !== socket.id)});
    })
}
nonAuthyIo.on('connect', (socket) => onNonAuthyConnect(socket))

/**
 * ===============================================================
 * Authenticated Sockets
 * ===============================================================
 */
let authySockets = [];
const authyUse = (socket,next) => {
    console.log((socket.handshake.address.address,socket.handshake.address.port))
    if(socket.handshake.query && socket.handshake.query.token && socket.handshake.query.user_display_name){
        jwt.verify(socket.handshake.query.token,secretServerKey,(err,decoded)=>{
            if(err){return next(new Error(`Authentication Failed - ${err}`));}
            socket.decoded = decoded;
            socket.user_display_name = socket.handshake.query.user_display_name;
            console.log("DECODED",decoded)
            next();
        })
    }
    else{
        console.log(socket.id, " is missing token or user_display_name")
        next(new Error('Authentication Failed - missing token'));
    }
}
const onAuthyConnect = (socket) => {
    authySockets.push(socket)
    console.log(`${socket.user_display_name} has connected authy over socket ${socket.id}`);
    socket.on('disconnect',(reason)=>{
        console.log(`Authy socket ${socket.id} disconnected because ${reason}`)
        authySockets = authySockets.filter((sock) => {return (sock.id !== socket.id)});
    })
    socket.on('sendMessage',(data) => {
        console.log(socket.user_display_name , " sent a message " , data.message , 'at time', data.created_at);
        nonAuthySockets.forEach((sock) => {
            sock.emit('ReceiveMessage',{'message':data.message,'user_display_name':socket.user_display_name, 'created_at':data.created_at})
        });
        log_chat = [[socket.id,socket.user_display_name,data.message]]
        mySqlConnection.query(INSERT_QUERY,[log_chat],(err, result) => {
            if (err) throw err;
            console.log(log_chat.length + " record(s) inserted");
            console.log(result)
        });
    })
}
authyIo.use((socket,next) => authyUse(socket,next));
authyIo.on('connect',(socket) => onAuthyConnect(socket));


/**
 * ===============================================================
 * Render Server
 * ===============================================================
 */

app.use(express.static("public"));

httpServer.listen(serverPort, function(){
    console.log(`SERVER STARTED ON ${serverPort}`);
})