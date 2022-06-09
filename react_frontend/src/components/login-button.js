import React, { useState } from "react";
import axios from "axios";

const NODE_BASEURL = process.env.REACT_APP_NODE_BASEURL

const LoginButton = () => {
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const loginFunction = (e) => {
        e.preventDefault();
        console.log("Logging In")
        const loginForm = new FormData();
        loginForm.append('username','webadmin')
        loginForm.append('password','w3b@dm1n_p@55w0rd')
        fetch(`${NODE_BASEURL}/login`, {
            method: 'POST',
            body: loginForm
        })
        .then((res)=>{
            console.log(res.body)
        });
    }
    return (
        <button onClick={loginFunction}>Login</button>
    )
}

export default LoginButton;