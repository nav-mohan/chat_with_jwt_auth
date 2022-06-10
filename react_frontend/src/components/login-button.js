import React, { useState } from "react";
import axios from "axios";
import {Button, Form} from 'react-bootstrap'

const NODE_BASEURL = process.env.REACT_APP_NODE_BASEURL

const LoginButton = () => {
    const [username, setUsername] = useState('webadmin')
    const [password, setPassword] = useState('w3b@dm1n_p@55w0rd')
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    const loginFunction = (e) => {
        e.preventDefault();
        console.log("Logging In")

        var loginDetails = {
            'username': username,
            'password': password
        };
        var formBody = [];
        for (var property in loginDetails) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(loginDetails[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        fetch(`${NODE_BASEURL}/login`, {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: formBody
        })
        .then(async (a)=>{
            var aText = await a.text();
            console.log(aText)
            var aJson = JSON.parse(aText)
            console.log(aJson)
            // console.log(JSON.parse(a.text()))
        });
    }
    return (
<Form>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
            We'll never share your email with anyone else.
        </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
    </Form.Group>
    <Button variant='success' onClick={loginFunction}>Log Me in</Button>
    <Button variant="primary" type="submit">Submit</Button>
</Form>
    )
}

export default LoginButton;