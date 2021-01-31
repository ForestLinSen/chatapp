import React, {useState} from 'react';
import {SearchOutlined, AttachFile, MoreVert} from "@material-ui/icons";
import {Avatar, IconButton} from "@material-ui/core"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import '../Chat.css';
import axios from '../axios'

const Chat = ({messages}) => {

    const [input, setInput] = useState("");

    const sendMessage = async(e) =>{
        e.preventDefault();

        await axios.post('/messages/new', {

            message: input,
            name: "Demo Name",
            timestamp: "now",
            received: false

        });

        setInput("")
    }

    return (
        <div className="chat">
            {/*header of the chat component*/}
            <div className='chat_header'>

                <Avatar />

                <div className='chat_headerInfo'>
                    <h3>Room Name</h3>
                    <p>Last seen at...</p>
                </div>

                <div className='chat_headerRight'>
                    <IconButton>
                        <SearchOutlined/>
                    </IconButton>
                    <IconButton>
                        <AttachFile/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </div>
            </div>

            <div className='chat_body'>

                <p className='chat_message'>
                    <span className='chat_name'>Sunny</span>
                    This is a message.
                    <span className='chat_timestamp'>{new Date().toUTCString()}</span>
                </p>



                {messages.map((message)=>(
                    <p className={`chat_message ${message.received && 'chat_receiver'}`}>
                        <span className='chat_name'>{message.name}</span>
                        {message.message}
                        <span className='chat_timestamp'>{new Date().toUTCString()}</span>
                    </p>
                ))}

            </div>


            <div className='chat_footer'>
                <InsertEmoticonIcon/>
                <form>
                    <input value={input} onChange={ (e) => setInput(e.target.value)} placeholder="Type a message" type="text"/>
                    <button  onClick={sendMessage} type="submit">Send a Message</button>
                </form>
                <MicIcon/>
            </div>



        </div>
    );
};

export default Chat;
