/**
 * ===============================================================
 * Environment Variables 
 * ===============================================================
 */

const {
    serverPort,
    loginRouterPath,
    registerRouterPath,
    authySocketPath,
    nonAuthySocketPath,
    clientOrigins
} = require('./config');

/**
 * ===============================================================
 * Import and Configure Modules 
 * ===============================================================
 */
console.log(clientOrigins)
var express = require('express');
var cors = require('cors',{cors:clientOrigins});
var app = express();
app.use(cors())
var httpServer = require('http').Server(app);


/**
 * ===============================================================
 * Configure Authy and Non-Authy Sockets 
 * ===============================================================
 */
var nonAuthyIo = require('socket.io')(httpServer, {path:nonAuthySocketPath,cors: {origin: clientOrigins,methods: ["GET", "POST"]}});
var authyIo = require('socket.io')(httpServer, {path:authySocketPath,cors: {origin: clientOrigins,methods: ["GET", "POST"]}});
const {authyUse,onAuthyConnect} = require('./auth-sockets')
authyIo.use((socket, next) => authyUse(socket, next));
authyIo.on('connect', (socket) => onAuthyConnect(socket));
const {onNonAuthyConnect} = require('./nonauth-sockets')
nonAuthyIo.on('connect', (socket) => onNonAuthyConnect(socket))

/**
 * ===============================================================
 * Login & Register Route
 * ===============================================================
 */

const {loginRouter} = require('./login-router');
const { registerRouter } = require('./register-router');
app.use(loginRouterPath, loginRouter)
app.use(registerRouterPath, registerRouter)

/**
 * ===============================================================
 * Render Server
 * ===============================================================
 */
// app.use(express.static("public"));

httpServer.listen(serverPort, function () {
    console.log(`SERVER STARTED ON ${serverPort}`);
})