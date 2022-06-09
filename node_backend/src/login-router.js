const {wordpressBaseUrl,wordpressJwtPath,deployEnvironment} = require('./config');
const express = require('express');
const https = require('https');

const loginRouter = express.Router();
loginRouter.post('/', async (loginRequest,loginResponse)=>{
    var loginBodyBuffer = [];
    loginRequest.on("data", (d) => {
        loginBodyBuffer.push(d.toString())
    })
    loginRequest.on("end", () => {
        console.log("COLLECTED BODY")
        console.log(loginBodyBuffer[0])
        console.log(Object.values(JSON.parse(loginBodyBuffer[0])))
    })

    var postOptions = {
        hostname: wordpressBaseUrl,
        port: 443,
        path: wordpressJwtPath,
        method: 'POST',
        headers:{"Content-Type":"application/json"},
        //Must update fm949's SSL certificate to WebNames
        rejectUnauthorized: (deployEnvironment === 'DEVELOPMENT') ? false : true,
    };
    // Object.keys(loginRequest).forEach(reqKey => {
    //     console.log("------------------------------------------------")
    //     console.log(reqKey)
    //     console.log(loginRequest[reqKey])
    // });
    try {
        var postData = {
            username: 'webadmin',
            password: 'w3b@dm1n_p@55w0rd'
        };
    } 
    catch (error) {
        throw new Error(error);
    }

    var jwtPayloadBuffer = []
    var req = https.request(postOptions, async (res) => {
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);
        res.on('data', (d) => {
            // process.stdout.write(d);
            jwtPayloadBuffer.push(d.toString())
        });
        res.on("end",() => {
            console.log("ENDED",jwtPayloadBuffer)
            loginResponse.send(JSON.parse(jwtPayloadBuffer[0]));
        })
    });
        
    req.on('error', (e) => {
        console.error("ERROR",e);
        return;
    });
    req.write(JSON.stringify(postData));
    req.end();
    
})
    
module.exports = {
    loginRouter
}