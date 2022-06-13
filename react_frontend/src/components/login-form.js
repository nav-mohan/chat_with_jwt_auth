import React, { useEffect, useState } from "react";
import axios from "axios";
import {Button,Form} from 'react-bootstrap'
import validator from 'validator';
import { nodeBaseUrl, loginPath } from "../config";


const LoginForm = () => {

    const [usernameEmail,setUsernameEmail] = useState('')
    const [password,setPassword] = useState('')

    const loginFunction = (e) => {
        e.preventDefault();
        console.log("Logging In");

        // Construct the POST body
        var postData = {'password':password};
        if (validator.isEmail(usernameEmail)){
            var formBody = encodeURIComponent(`email=${usernameEmail}`) + "&" + encodeURIComponent(`password=${password}`);
        }
        else{
            var formBody = encodeURIComponent(`username=${usernameEmail}`) + "&" + encodeURIComponent(`password=${password}`);
        }
        
        // Send POST request to Node
        fetch(`${nodeBaseUrl}${loginPath}`, {
            method: 'POST',
            headers:{"Content-Type":"application/json"},
            body: formBody
        })
        .then(async (res)=>{
            if(res.status == 200){
                // Just becase it's 200 doesn't mean it's all good. the jwtPayload has a 'success':true property within
                var resJson = await res.json();
                console.log(resJson)
                return resJson;
            }
            throw new Error(`login attempt res.status=${res.status}`)

        })
        .catch((err) => {
            console.log("err",err);
        });
    }

    useEffect(()=>{
        console.log('usernameEmail',usernameEmail,'password',password);
    },[usernameEmail,password])

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicUsernameEmail">
                <Form.Label>Username/email</Form.Label>
                <Form.Control type="email" placeholder="Enter username or email" value = {usernameEmail} onChange={(e) => setUsernameEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value = {password}  onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>

            <Button variant='success' onClick={loginFunction}>Log Me in</Button>
        </Form>
    )
}

export default LoginForm;