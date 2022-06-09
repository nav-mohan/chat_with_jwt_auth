class SocketHandler {
    constructor(AUTH_URL){
        this.AUTH_URL = AUTH_URL;
        this.authyConnectionStatus = 0;
        this.nonAuthyConnectionStatus = 0;
        this.nonAuthySocket = null;
        this.authySocket = null;
    }

    makeMessageDom = (message,user_display_name,created_at) => {
        return (
            "<div class = 'message-dom'>" + 
                "<div class = 'user-message'>" + 
                    "<div class = 'message-username'>" + user_display_name + "</div>" +
                    "<div class = 'message-body'>" + message + "</div>" + 
                "</div>" + 
                "<div class = 'message-timestamp'>" + created_at + "</div>" +
                "<div class = 'like-button' >" + "Like" + "</div>" + 
            "</div>"
        )
    }

    intializeNonAuthyConnection = () => {
        this.nonAuthySocket = io(this.AUTH_URL,{path:'/non-authy.io/'})
        
        this.nonAuthySocket.on('connect',()=>{
            this.nonAuthyConnectionStatus = 1;
            console.log("Non authy socket connected");
        })
        this.nonAuthySocket.on('connect_error',(err)=>{
            this.nonAuthyConnectionStatus = 0;
            console.log("Non authy socket connect_error",err);
        })
        this.nonAuthySocket.on('disconnect',(socket)=>{
            this.nonAuthyConnectionStatus = 0;
            console.log("Non authy socket disconnected - ",socket);
        })
        this.nonAuthySocket.on('ReceiveMessage',(data)=>{
            console.log("Non authy socket received data",data);
            var messageDom = this.makeMessageDom(data.message,data.user_display_name,data.created_at);
            document.getElementById('message-display').innerHTML += "<br>" + messageDom;
        })
        this.nonAuthySocket.on('ReceiveHistory',(chatHistory)=>{
            chatHistory.forEach(data => {
                var messageDom = this.makeMessageDom(data.message,data.user_display_name,data.created_at);
                document.getElementById('message-display').innerHTML += "<br>" + messageDom;
            });
        })  
    }
    
    intializeAuthyConnection = (jwtPayload) => {
        console.log("INITIALIZING AUTHY CONNECTION USING PAYLOAD",jwtPayload)
        this.authySocket = io(this.AUTH_URL,{path:'/authy.io/',query:{token:jwtPayload.token,user_display_name:jwtPayload.user_display_name}})
        this.authySocket.on('connect',()=>{
            this.authyConnectionStatus = 1;
            console.log("Authy socket connected");
        })
        this.authySocket.on('connect_error',(err)=>{
            this.authyConnectionStatus = 0;
            console.log("Authy socket connect_error",err);
        })
        this.authySocket.on('disconnect',(socket)=>{
            this.authyConnectionStatus = 0;
            console.log("Authy socket disconnected - ",socket);
        })
        this.authySocket.on('ReceiveMessage',(message)=>{
            console.log("Authy Socket Received Message",message)
        })

        this.authySocket.emit("sendMessage",
        {
            'message' : "Hello from authy client!",
            'created_at' :new Date()
        }
        )
    }
    
    sendMessage = (message) => {
        if(this.authySocket && this.authyConnectionStatus && message){
            this.authySocket.emit("sendMessage",
            {
                'message' : message,
                'created_at' :new Date()
            }
            )
        }
    }

    getAuthyConnectionStatus = () => {
        return this.authyConnectionStatus
    }
    getNonAuthyConnectionStatus = () => {
        return this.nonAuthyConnectionStatus
    }
}