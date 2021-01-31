import './App.css';
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import {useEffect, useState} from "react";
import Pusher from 'pusher-js'
import axios from "./axios"
import K from './key.js'

function App() {

    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        axios.get("messages/sync").then((response)=>{
            setMessages(response.data)
        });
    }, []);

    useEffect(() => {
        const pusher = new Pusher(K.pusher_key, {
            cluster: 'ap1'
        });

        const channel = pusher.subscribe('messages');

        channel.bind('inserted', function(newMessage)  {
            setMessages([...messages, newMessage]);
        });

        return ()=>{
            channel.unbind_all();
            channel.unsubscribe();
        }

    }, [messages])

    console.log(messages);

  return (
    <div className={"app"}>
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
