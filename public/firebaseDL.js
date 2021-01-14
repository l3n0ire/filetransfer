const baseUrl = "https://file2go.herokuapp.com"
//const baseUrl = "http://localhost:5000"
// Your web app's Firebase configuration
fetch(baseUrl+'/api/keys')
  .then(res=>res.json())
  .then(firebaseConfig=>{
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log(firebase);
  });

  async function getDownloadLink() {
    
        const linksElement = document.querySelector("#links");
    let downloadCode = document.getElementById("downloadCode").value;
  
    // get downloadLinks
    let res = await fetch(baseUrl+'/api/files/'+downloadCode);
    let data = await res.json();
  
    // invalid code
    if(res.status == 400)
    {
      console.log(data)
    }
    else if(data.urls != undefined){
      data.urls.forEach(url=>{
        // create a tags for each link
        let a = document.createElement("A");
        let br = document.createElement("br");
        a.classList.add("link")
        a.href = url;
        a.innerHTML=url
        linksElement.appendChild(a);
        linksElement.appendChild(br);
      });
    }
    else{
      console.log(data)
    }

    document.getElementById("getDownloadLink").disabled = true;
    
    
  }