import React, { useState } from "react";
import axios from "axios";

const NODE_BASEURL = process.env.REACT_APP_NODE_BASEURL

const LoginButton = () => {
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const loginFunction = (e) => {
        e.preventDefault();
        console.log("Logging In")

        var loginForm = {'username': 'webadmin'};
        fetch(`${NODE_BASEURL}/login`, {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: loginForm
        })
        .then((a)=>{
            console.log((a.text()))
            // console.log(JSON.parse(a.text()))
        });
    }
    return (
        <button onClick={loginFunction}>Login</button>
    )
}

export default LoginButton;