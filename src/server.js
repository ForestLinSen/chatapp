// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "../dbMessages.js"
import Pusher from 'pusher'
import cors from 'cors'
import K from "./key.js"

// app config
const app = express();
app.use(cors());
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: K.pusher_appId,
    key: K.pusher_key,
    secret: K.pusher_secret,
    cluster: "ap1",
    useTLS: true
});

// middleware
app.use(express.json())

// DB config
const connectionURL = K.mongodb_URL;

mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true,
})

const db = mongoose.connection

db.once("open", ()=>{
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change)=>{
        console.log("changeStream!!!")
        console.log(change.fullDocument)

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            console.log("Pusher works!")
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message
            })
        }else{
            console.log("Error triggering Pusher!");
        }
    })
})

//???


// API routes
app.get('/', (req, res)=> res.status(200).send("hello world"))

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    })
})

app.post('/messages/new', (req,res)=>{
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send('new message created: \n ' + data)
        }
    })
})

// APP listen
app.listen(port, ()=>{
    console.log("Listening")
});