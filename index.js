const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const app = express();

//load env variables
dotenv.config({path: './config/config.env'});
// body parser
app.use(express.json());
// set static folder
app.use(express.static(path.join(__dirname,'public')))

// download file
app.get('/api/files/:downloadCode', function (req, res) {
    // check if exists
    res.send(req.params.downloadCode)
})

// upload file
app.post('/api/files', function (req, res) {
    res.send('POST request to the homepage')
})


const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running ${process.env.NODE_ENV} on port ${PORT}`));
console.log(process.env.apiKey)
