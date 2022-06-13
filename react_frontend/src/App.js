import './App.css';
import VideoPlayer from "./components/video-player";
import LoginForm from './components/login-form';
import { SocketContext, socket} from './context/socket';
import ChatForm from "./components/chat-form";
import { useState } from 'react';

function App() {
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  return (
  <SocketContext.Provider value = {socket}>
    <div className="App">
      <VideoPlayer/>
      <LoginForm />
      <ChatForm/>
    </div>
  </SocketContext.Provider>
  );
}

export default App;