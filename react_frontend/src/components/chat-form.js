import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../context/socket';

const ChatForm = ({userId}) => {

  const socket = useContext(SocketContext);

  const [joined, setJoined] = useState(false);

  const handleInviteAccepted = useCallback(() => {
    setJoined(true);
    console.log('joioned=',joined)
  }, []);

  const handleJoinChat = useCallback(() => {
    console.log("SENDING JOINR REQUEST")
    socket.emit("joinRequest",localStorage.getItem('wordpressJWT'));
}, []);

useEffect(() => {
    // as soon as the component is mounted, do the following tasks:
    
    // emit USER_ONLINE event
    socket.emit("USER_ONLINE", userId); 
    
    // subscribe to socket events
    socket.on("JOIN_REQUEST_ACCEPTED", handleInviteAccepted); 
    socket.on("ALERT",(data)=>{console.log("ALERT",data)})
    socket.on("ReceiveHistory", (data)=>{return console.log("RECIEVING CHAT HSITRYO",data)}); 
    
    return () => {
        // unbind all event handlers used in this component before the component is destroyed 
        socket.off("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
        socket.off("ALERT",(data)=>{console.log("ALERT",data)})
        socket.off("ReceiveHistory", (data)=>{return console.log("RECIEVING CHAT HSITRYO",data)}); 
    };
  }, [socket, userId, handleInviteAccepted]);

  return (
    <div>
      { !joined ? (
        <p>Click the button to send a request to join chat!</p>
      ) : (
        <p>Congratulations! You are accepted to join chat!</p>
      ) }
      <button onClick={handleJoinChat}>
        Join Chat
      </button>
    </div>
  );
};

export default ChatForm