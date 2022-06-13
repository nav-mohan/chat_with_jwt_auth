var jwt = require('jsonwebtoken');

const {wordpressBaseUrl,wordpressJwtLoginPath,wordpressJwtAuthKey,deployEnvironment} = require('./config');
const express = require('express');
const https = require('https');

const loginRouter = express.Router();
loginRouter.post('/', (nodeLoginRequest,nodeLoginResponse)=>{
    
    var nodeLoginBodyBuffer = [];
    nodeLoginRequest.on("data", (d) => {nodeLoginBodyBuffer.push(d)})
    
    var postData = {'AUTH_KEY':wordpressJwtAuthKey};
    
    nodeLoginRequest.on("end", () => {
        console.log("COLLECTED BODY");
        try {
            var nodeLoginBody = decodeURIComponent(nodeLoginBodyBuffer).split("&");
            console.log(nodeLoginBodyBuffer.toString());
            nodeLoginBody.forEach(loginDetail => {
                postData[loginDetail.split("=")[0]] = loginDetail.split("=")[1];
            });
        } 
        catch (error) {
            console.log('Unable to decodeURI');
            console.log(error);
        }
        var postOptions = {
            hostname: wordpressBaseUrl,
            port: 443,
            path: wordpressJwtLoginPath,
            method: 'POST',
            headers:{"Content-Type":"application/json"},
            //Must update fm949's SSL certificate to WebNames
            rejectUnauthorized: (deployEnvironment === 'DEVELOPMENT') ? false : true,
        };
    
        var jwtPayloadBuffer = [];
        var wpLoginRequest = https.request(postOptions, (wpLoginResponse) => {

            wpLoginResponse.on('data', (d) => {
                // process.stdout.write(d);
                jwtPayloadBuffer.push(d.toString())
            });
            
            wpLoginResponse.on("end",async () => {

                console.log("RECEIVED WORDPRESS RESPONSE TO AUTH ATTEMPT")
                console.log(jwtPayloadBuffer)

                try{
                    jwtPayload = await JSON.parse(jwtPayloadBuffer);
                }
                catch(error){
                    console.log("Unable to parse jwtPayloadBuffer")
                    console.log(error)
                    nodeLoginResponse.send({
                        'success':"False",
                        "wpStatusCode":wpLoginResponse.statusCode,
                        "wpStatusMessage":wpLoginResponse.statusMessage,
                    })
                    return;
                }
                if(wpLoginResponse.statusCode !== 200){
                    console.log("Wordpress Login Failed with ",wpLoginResponse.statusMessage)
                    nodeLoginResponse.send({
                        'success':"False",
                        "wpStatusCode":wpLoginResponse.statusCode,
                        "wpStatusMessage":wpLoginResponse.statusMessage,
                        "wpPayloadMessage":jwtPayload.data.message
                    })
                    return;
                }

                if(jwtPayload.success==true && jwtPayload.data && jwtPayload.data.jwt){
                    console.log(jwtPayload);
                    d = await decryptPayload(jwtPayload.data.jwt);
                    console.log(await d);
                    nodeLoginResponse.send(jwtPayload.data);// Now send just the jwt 
                    //console.log(jwtPayload.user_info)// For more important things you will also do an if-else check for the jwtPayload.user_info.roles before sendint the jwt over to the client
                    return;
                }
                else{
                    console.log("jwtPayload missing some properties",jwtPayload)
                    nodeLoginResponse.send(jwtPayload);
                    return;
                }
            })
        });
            
        wpLoginRequest.on('error', (error) => {
            console.error("wpLoinError",error);
            throw new Error(`wpLoginRequest errored out with statusCode ${wpLoginResponse.statusCode} : ${error}`)
        });
        wpLoginRequest.write(JSON.stringify(postData));
        wpLoginRequest.end();
    })
    
})
    
module.exports = {
    loginRouter
}