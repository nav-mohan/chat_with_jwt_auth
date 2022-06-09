const SOCKET_URL = "http://localhost:3000";
const JWT_URL    = "https://fm949.ca/wp-json/jwt-auth/v1/token";

let socketHandler = new SocketHandler(SOCKET_URL);
socketHandler.intializeNonAuthyConnection();

const submitLogin = (username,password) => {
    url = JWT_URL
    loginData = new FormData()
    loginData.append('username',username)
    loginData.append('password',password)

    fetch(url,{
        method:'post',
        body:loginData,
        // mode:'cors'
    })
    .then((res)=>{
        console.log(res);
        if(res.status==200){
            alert("Your username and password checks out!")
            return res.json();
        }
        else{
            alert("Incorrect Username or Password");
            console.log(res.json())
            return;
        }
    })
    .then((jwtPayload) => {
        if (jwtPayload && jwtPayload.token){
            console.log("Received jwtPayload",jwtPayload)
            socketHandler.intializeAuthyConnection(jwtPayload)
        }
        else{
            console.log("Failed to obtain a JWT from the response of the server...");
            throw new Error("FAILED TO RECEIVE A VALID JWT! ");
        }
    })
    .catch((error)=>{
        console.log("CAUGHT AN ERROR:",error);

    })
}

