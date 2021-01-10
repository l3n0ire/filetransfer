// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAJI6C1VHAB7NwM-VjLx1NcIQ5-CfHREr8",
  authDomain: "fir-storagetest-98e1a.firebaseapp.com",
  projectId: "fir-storagetest-98e1a",
  databaseURL: "https://fir-storagetest-98e1a-default-rtdb.firebaseio.com/",
  storageBucket: "fir-storagetest-98e1a.appspot.com",
  messagingSenderId: "789913035588",
  appId: "1:789913035588:web:57adb28fc34f698bf32d11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

async function random()
{
  let data = {
    "jsonrpc": "2.0",
    "method": "generateStrings",
    "params": {
        "apiKey": "53b56391-d01d-40b7-984b-1a92afe63182",
        "n": 1,
        "length": 6,
        "characters": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "replacement": true
    },
    "id": 42
  }
  const response = await fetch('https://api.random.org/json-rpc/2/invoke', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json; charset=UTF-8"}
  })

  const code = await response.json()
  const randomCode = code.result.random.data[0]
  return randomCode
}

async function addToDB(downloadCode,password,expireTime){

  const res = await firebase.database().ref("users/"+downloadCode).set({
    downloadCode:downloadCode,
    password:password,
    expireTime:expireTime
  });

}
async function uploadImage(){
    let randomCode = await random();
    document.querySelector("#code").innerHTML = randomCode;
    
    const ref = await firebase.storage().ref();

    const files = document.querySelector("#photo").files;

    for(let i=0;i<files.length;i++){
      const name = files[i].name;
      const metadata ={
          contentType:files[i].type
      }

      if (files[i].size > 2097152) {
        alert("File is too big!");
        return;
      }

      const imageRef = await ref.child(randomCode + "/" + name);
      const snapshot = await imageRef.put(files[i],metadata);

    }
    alert("Upload Successful");

    // store in db
    await addToDB(randomCode,"","");
      
}
var urls=[]
var fileNames=""
const linksElement = document.querySelector("#links");


function downloadFiles(){
  console.log(urls.length)
  for(let j =0;j<urls.length;j++){
    console.log("ran")
    let a = document.createElement("A");
    let br = document.createElement("br");
    a.href = urls[j];
    a.innerHTML=j
    linksElement.appendChild(a);
    linksElement.appendChild(br);
    
  }
}
async function getDownloadLink() {
    var code = document.getElementById("downloadCode").value;
    console.log(code);
    
    const ref = await firebase.storage().ref().child(code + "/");

    // do we have to check if the code exists?
    const fileNamesElement = document.querySelector('#fileNames');
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
}