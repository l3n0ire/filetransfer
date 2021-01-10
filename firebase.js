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

async function addToDB(randomCode,link,password,expireTime){

  const res = await firebase.database().ref("users/"+randomCode).set({
    randomCode:randomCode,
    link:link,
    password:password,
    expireTime:expireTime
  });

}
async function uploadImage(){
    let randomCode = await random();
    document.querySelector("#code").innerHTML = randomCode;
    
    const ref = await firebase.storage().ref();

    const file = document.querySelector("#photo").files[0];
    const name = file.name;
    const metadata ={
        contentType:file.type
    }

    const imageRef = await ref.child(randomCode + "/" + name);
    const snapshot = await imageRef.put(file,metadata);
    console.log(snapshot);
    const url = await snapshot.ref.getDownloadURL();
    
    console.log(url);
    alert("image Upload Successful");
    const linkElement = document.querySelector('#link');
    linkElement.href = url;

    // store in db
    await addToDB(randomCode,url,"","");
      
}

async function getDownloadLink() {
    var code = document.getElementById("downloadCode").value;
    console.log(code);
    
    const ref = await firebase.storage().ref().child(code + "/");

    // do we have to check if the code exists?

    ref.listAll().then(function(res) {
      res.items.forEach(function(item) {
          item.getDownloadURL().then(function(url) {
            const linkElement = document.querySelector('#downloadLink');
            linkElement.href = url;
          })
      })
    })

    const imageRef = await ref.child(code);
}