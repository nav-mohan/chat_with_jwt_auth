/**
 * ===============================================================
 * Environment Variables 
 * ===============================================================
 */

const {
    serverPort,
    authySocketPath,
    nonAuthySocketPath,
    clientOrigins
} = require('./config');

/**
 * ===============================================================
 * Import and Configure Modules 
 * ===============================================================
 */
var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
var cors = require('cors');
app.use(cors({ origin: clientOrigins }))


/**
 * ===============================================================
 * Configure Authy and Non-Authy Sockets 
 * ===============================================================
 */
var nonAuthyIo = require('socket.io')(httpServer, { path: authySocketPath });
var authyIo = require('socket.io')(httpServer, { path: nonAuthySocketPath });
const {authyUse,onAuthyConnect} = require('./auth-sockets')
const {onNonAuthyConnect} = require('./nonauth-sockets')
authyIo.use((socket, next) => authyUse(socket, next));
authyIo.on('connect', (socket) => onAuthyConnect(socket));
nonAuthyIo.on('connect', (socket) => onNonAuthyConnect(socket))

/**
 * ===============================================================
 * Login & Register Route
 * ===============================================================
 */

const {loginRouter} = require('./login-router');
const { registerRouter } = require('./register-router');
app.use('/login', loginRouter)
app.use('/register', registerRouter)

/**
 * ===============================================================
 * Render Server
 * ===============================================================
 */
app.use(express.static("public"));

httpServer.listen(serverPort, function () {
    console.log(`SERVER STARTED ON ${serverPort}`);
})
