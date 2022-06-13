var jwt = require('jsonwebtoken');

const {wordpressBaseUrl,wordpressJwtLoginPath,wordpressJwtAuthKey,deployEnvironment} = require('./config');
const express = require('express');
const https = require('https');

const loginRouter = express.Router();
loginRouter.post('/', (nodeLoginRequest,nodeLoginResponse)=>{
    
    // receive the Login Form from React
    var nodeLoginBodyBuffer = [];
    nodeLoginRequest.on("data", (d) => {nodeLoginBodyBuffer.push(d)})
    
    // Initialize the postData with the Wordpress JWT Auth Key (Not the secretServerKey)
    var postData = {'AUTH_KEY':wordpressJwtAuthKey};
    
    nodeLoginRequest.on("end", () => {
        console.log("Login Form Received from React");
        
        // prepare the Login Form for Wordpress
        try {
            var nodeLoginBody = decodeURIComponent(nodeLoginBodyBuffer).split("&");
            console.log(nodeLoginBodyBuffer.toString());
            nodeLoginBody.forEach(loginDetail => {
                postData[loginDetail.split("=")[0]] = loginDetail.split("=")[1];
            });
        } 
        catch (error) {
            console.log('Unable to decode Login Form');
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
    
        // forward the Login Form to Wordpress
        var wpLoginRequest = https.request(postOptions, (wpLoginResponse) => {
            
            var jwtPayloadBuffer = [];
            wpLoginResponse.on('data', (d) => {
                // process.stdout.write(d);
                jwtPayloadBuffer.push(d.toString())
            });
            
            wpLoginResponse.on("end",async () => {

                console.log("Received Wordpress response to auth attempts")
                console.log(jwtPayloadBuffer)

                // try parsing the payload
                try{
                    jwtPayload = await JSON.parse(jwtPayloadBuffer);
                }
                catch(error){
                    console.log("Unable to parse jwtPayloadBuffer")
                    console.log(error)
                    nodeLoginResponse.send({
                        'success':false,
                        "wpStatusCode":wpLoginResponse.statusCode,
                        "wpStatusMessage":wpLoginResponse.statusMessage,
                        "erroDetails":error
                    })
                    return;
                }
                
                // if the auth attempt failed
                if(wpLoginResponse.statusCode !== 200){
                    console.log("Wordpress Login Failed with ",wpLoginResponse.statusMessage)
                    nodeLoginResponse.send({
                        'success':false,
                        "wpStatusCode":wpLoginResponse.statusCode,
                        "wpStatusMessage":wpLoginResponse.statusMessage,
                        "wpPayloadMessage":jwtPayload.data.message
                    })
                    return;
                }

                // if the auth attempt succeeded
                if(jwtPayload.success==true && jwtPayload.data && jwtPayload.data.jwt){
                    nodeLoginResponse.send(jwtPayload.data);// Now send just the jwt 
                    console.log(jwtPayload.user_info.roles)// For more important things you will also do an if-else check for the jwtPayload.user_info.roles before sendint the jwt over to the client
                    return;
                }
                else{
                    console.log("jwtPayload missing some properties",jwtPayload)
                    nodeLoginResponse.send(jwtPayload);
                    return;
                }
            })
        });

        // if Node fails to connect to Wordpress
        wpLoginRequest.on('error', (error) => {
            console.error("wpLoginError");
            console.log(error)
            console.log(wpLoginRequest)
            nodeLoginResponse.send({
                "success":false,
                "wpStatusCode":404,
                "wpStatusMessage":"Wordpress site is probably down",
                "wpErrorMessage":error
            })
        });
        wpLoginRequest.write(JSON.stringify(postData));
        wpLoginRequest.end();
    })
})
    
module.exports = {
    loginRouter
}