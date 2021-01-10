const path = require('path');
const express = require('express');
require('dotenv').config();
const app = express();
const firebase = require('firebase');


// body parser
app.use(express.json());
// set static folder
app.use(express.static(path.join(__dirname,'public')))
// firebase config
var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    databaseURL: process.env.databaseURL,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
  };
var firebaseApp = firebase.initializeApp(firebaseConfig);

// download file
app.get('/api/files/:downloadCode', function (req, res) {
    // check if exists
    res.send(req.params.downloadCode)
})

// get keys
app.get('/api/keys', function (req, res) {
    res.send(firebaseConfig)
})

// upload file
app.post('/api/files', function (req, res) {
    if("downloadCode" in req.body && "password" in req.body && "expireTime" in req.body){
        try{
            addToDB(req.body.downloadCode,req.body.password,req.body.expireTime);
            res.send({"message":"added to db"})
        }catch(error){
            console.log(error)
            res.status(500).json("server error")
        }
    }
    else
        res.status(400).json("missing parameter")
})

async function addToDB(downloadCode,password,expireTime){

    const res = await firebaseApp.database().ref("users/"+downloadCode).set({
      downloadCode:downloadCode,
      password:password,
      expireTime:expireTime
    });  
}


const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running ${process.env.NODE_ENV} on port ${PORT}`));
console.log(process.env.apiKey)
