const path = require('path');
const express = require('express');
require('dotenv').config();
const app = express();
const firebase = require('firebase');
var admin = require("firebase-admin");
var urls=[]


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
firebase.initializeApp(firebaseConfig);

var serviceAccount = require("./fir-storagetest-98e1a-firebase-adminsdk-2sjrd-e890b78adf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-storagetest-98e1a-default-rtdb.firebaseio.com"
});

var bucket = admin.storage().bucket(process.env.storageBucket);

// download file
app.get('/api/files/:downloadCode', function (req, res) {
    // check if exists
    //res.send(req.params.downloadCode)
    getDownloadLink(req.params.downloadCode);
    res.send(urls);
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

async function getDownloadLink(code) {
  //var code = document.getElementById("downloadCode").value;
  //console.log(code);
  
  const ref = await bucket.getFiles(function(err, files) {
      if (!err) {
        console.log('https://firebasestorage.googleapis.com/v0/b/' +  files[0].storage.projectId + files[0].metadata.mediaLink + )
      }
      else
      {
        console.log(err);
      }
  });
  

  // do we have to check if the code exists?
  // const fileNamesElement = document.querySelector('#fileNames');
  /*
  ref.listAll().then(function(res) {
    res.items.forEach(function(item) {
        item.getDownloadURL().then(function(url) {
          urls.push(url);
          fileNames = fileNames+' '+item.name;
          fileNamesElement.innerHTML = fileNames;
        })
        
    })
    
  })

  const imageRef = await ref.child(code);
  console.log(urls);
  */

  //return urls;
}


const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running ${process.env.NODE_ENV} on port ${PORT}`));
console.log(process.env.apiKey)
