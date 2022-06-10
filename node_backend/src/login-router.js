var jwt = require('jsonwebtoken');
const { secretServerKey } = require('./config');

const decryptPayload = (token) => {
    jwt.verify(token, secretServerKey, (err, decoded) => {
        if (err) { return next(new Error(`Authentication Failed - ${err}`)); }
        console.log("DECODED", decoded)
    })
}
var sample_jwt_payload = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NTQ4OTI4ODgsImV4cCI6MTY1NDg5NjQ4OCwiZW1haWwiOiJuYXZAcmFkaW93ZXN0ZXJuLmNhIiwiaWQiOjEsInNpdGUiOiJodHRwczpcL1wvZm05NDkuY2EiLCJ1c2VybmFtZSI6IndlYmFkbWluIiwibXl2YWx1ZSI6eyJyZXN0X3JvdXRlIjoiXC9zaW1wbGUtand0LWxvZ2luXC92MVwvYXV0aCIsInVzZXJuYW1lIjoid2ViYWRtaW4iLCJwYXNzd29yZCI6InczYkBkbTFuX3BANTV3MHJkIn19.J10M7eBgj5VwxHUudgUw_IMmrCxQqo1KMewZ63BXtfE"
decryptPayload(sample_jwt_payload)


const {wordpressBaseUrl,wordpressJwtLoginPath,deployEnvironment} = require('./config');
const express = require('express');
const https = require('https');

const loginRouter = express.Router();
loginRouter.post('/', async (loginRequest,loginResponse)=>{
    var loginBodyBuffer = [];
    loginRequest.on("data", (d) => {loginBodyBuffer.push(d)})
    var postData = {};
    loginRequest.on("end", () => {
        console.log("COLLECTED BODY")
        try {
            var [usernameURI,passwordURI] = decodeURIComponent(loginBodyBuffer).split("&");
            var username = usernameURI.split("=")[1]
            var password = passwordURI.split("=")[1]
            console.log(username,password)
            var postData = {'username': username,'password': password};
            var postOptions = {
                hostname: wordpressBaseUrl,
                port: 443,
                path: wordpressJwtLoginPath,
                method: 'POST',
                headers:{"Content-Type":"application/json"},
                //Must update fm949's SSL certificate to WebNames
                rejectUnauthorized: (deployEnvironment === 'DEVELOPMENT') ? false : true,
            };
        
            var jwtPayloadBuffer = []
            var req = https.request(postOptions, (res) => {
                console.log('statusCode:', res.statusCode);
                console.log(Object.keys(res))
                console.log('headers:', res.headers);

                res.on('data', (d) => {
                    // process.stdout.write(d);
                    jwtPayloadBuffer.push(d.toString())
                });
                
                res.on("end",() => {
                    console.log("ENDED",jwtPayloadBuffer)
                    loginResponse.send((jwtPayloadBuffer[0]));
                })
            });
                
            req.on('error', (e) => {
                console.error("ERROR",e);
                return;
            });
            req.write(JSON.stringify(postData));
            // req.write(postData);
            req.end();

        } 
        catch (error) {
            throw new Error(error);
        }
    })


    
})
    
module.exports = {
    loginRouter
}