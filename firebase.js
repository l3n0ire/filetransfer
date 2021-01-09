 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyAJI6C1VHAB7NwM-VjLx1NcIQ5-CfHREr8",
    authDomain: "fir-storagetest-98e1a.firebaseapp.com",
    projectId: "fir-storagetest-98e1a",
    storageBucket: "fir-storagetest-98e1a.appspot.com",
    messagingSenderId: "789913035588",
    appId: "1:789913035588:web:57adb28fc34f698bf32d11"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

    async function uploadImage(){
        const ref = await firebase.storage().ref();

        const file = document.querySelector("#photo").files[0];
        const name = new Date() + '-' + file.name;
        const metadata ={
            contentType:file.type
        }

        const imageRef = await ref.child(name);
        const snapshot = await imageRef.put(file,metadata);
        console.log(snapshot)
        const url = await snapshot.ref.getDownloadURL();
        
        console.log(url)
        alert("image Upload Successful")
        const linkElement = document.querySelector('#link');
        linkElement.href = url;
      
}