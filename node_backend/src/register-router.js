const {wordpressBaseUrl,wordpressJwtRegisterPath,deployEnvironment} = require('./config');
const express = require('express');
const https = require('https');

const registerRouter = express.Router();
registerRouter.post('/', async (registerRequest,registerResponse)=>{
    var loginBodyBuffer = [];
    registerRequest.on("data", (d) => {loginBodyBuffer.push(d)})
    var postData = {};
    registerRequest.on("end", () => {
        console.log("COLLECTED BODY")
        try {
            var [usernameURI,emailURI] = decodeURIComponent(loginBodyBuffer).split("&");
            var username = usernameURI.split("=")[1]
            var email = emailURI.split("=")[1]
            console.log(username,email)
            var postData = {'username': username,'email': email};
            var postOptions = {
                hostname: wordpressBaseUrl,
                port: 443,
                path: wordpressJwtRegisterPath,
                method: 'POST',
                headers:{"Content-Type":"application/json"},
                //Must update fm949's SSL certificate to WebNames
                rejectUnauthorized: (deployEnvironment === 'DEVELOPMENT') ? false : true,
            };
        
            var jwtPayloadBuffer = []
            var req = https.request(postOptions, (res) => {
                // console.log('statusCode:', res.statusCode);
                // console.log('headers:', res.headers);
                res.on('data', (d) => {
                    // process.stdout.write(d);
                    jwtPayloadBuffer.push(d.toString())
                });
                res.on("end",() => {
                    console.log("ENDED",jwtPayloadBuffer)
                    registerResponse.send(JSON.parse(jwtPayloadBuffer[0]));
                })
            });
                
            req.on('error', (e) => {
                console.error("ERROR",e);
                return;
            });
            req.write(JSON.stringify(postData));
            req.end();

        } 
        catch (error) {
            throw new Error(error);
        }
    })


    
})
    
module.exports = {
    registerRouter
}