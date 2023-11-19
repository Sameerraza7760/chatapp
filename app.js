
import { signinFirebase, SignupFirebase,auth,onAuthStateChanged,getDocs,doc,db,getDoc,collection,updateDoc,updateEmail,addDoc,query,serverTimestamp,where,sendEmailVerification,onSnapshot  } from "./firebase.js";


 window.Signup=async()=>{
    let  userName = document.getElementById('username').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    
    console.log(userName,email,password);
 
    try {
        await SignupFirebase({userName,email,password})
        alert("Registered Successfully")

        
        
 
    } catch (e) {
        alert(e.message);
        
    }
  
}




 window.Signin = async () => {
    let email = document.getElementById('loginemail').value;
    let password = document.getElementById('loginpassword').value;
    
    try {
        await signinFirebase(email, password);
        alert("Logged in Successfully");
        window.location.href='profile.html'
    } catch (e) {
        console.log(e);
    }
}




window.logout=async()=> {
  
    await auth.signOut();

    alert("logout")
    window.location.href = '/sigup.html';}


//////////////////////////////////////////////////////////////////////////////
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
  
        try {
      getUsers(user.uid,displayUserName);
      getAllUSers(user.email)
    
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
        console.log('User is signed in:', user.uid);
      } else {
 
        console.log('User is signed out');
      
      }
    });
    ///////////////////////////////////////////////////
    const getUsers = async (id,displayUserName) => {

      const userDocRef = doc(db, "users", id);
      return onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          displayUserName(docSnapshot.data()) 
        } else {
          console.log("User document not found");
        }
      });
    
    
    }
///////////////////////////////////////////
const displayUserName = (data) => {
  console.log(data);
  if (window.location.href.includes('profile.html') || window.location.href.includes('chat.html')) {
    document.getElementById('username').innerHTML = data.userName;
    document.getElementById('useremail').innerHTML = data.email;
 
  }
}

//////////////////////////////////////////////////////
    const updateProfileinfirestore = async (userInfo) => {
      const { userName, email, id } = userInfo;
  
      try {
          const data = doc(db, "users", id);
          await updateDoc(data, {
              email: email,
              userName: userName,
          });
       
  
          console.log('Firestore user document updated successfully.');
      } catch (error) {
          console.log(error.message);
      }
  }
  
//////////////////////////////////////////////////////  




window.ubdateProfile=async()=>{
  const user=auth.currentUser
  if (user) {
   
   const userName=document.getElementById('Ubdateusername').value
   const email=document.getElementById('email').value
   const id=user.uid
   
     console.log(email,userName,id);
   
  try {
   updateProfileinfirestore({userName,email,id})
   } catch (error) {
     console.log(error);
   }

  }

 }
 /////////////////////////////////////////////////////////////
    window.openModal=() =>{
      document.getElementById('myModal').style.display = 'block';
  }

  window.closeModal=()=> {
      document.getElementById('myModal').style.display = 'none';
  }

  window.onclick = function(event) {
      var modal = document.getElementById('myModal');
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }

  window.openMessaging=()=>{
    window.location.href='chat.html'
  }

  /////////////////////
         
 


// const users = ['User 1', 'User 2', 'User 3'];

// const userList = document.getElementById('userList');
// users.forEach(user => {
//     const listItem = document.createElement('li');
//     listItem.innerText = user;
//     userList.appendChild(listItem);
// });





const getAllUSers=async(email)=>{
  const usersCollection= query (collection(db,'users'),where("email",'!=',email))
  const users=await getDocs(usersCollection)


 const usersArray=[]

 users.forEach((doc)=>{
  usersArray.push({id:doc.id,...doc.data()})
 })



const userList = document.getElementById('userList');
usersArray.forEach(user => {
    const userName = document.createElement('li');
    // userName.addEventListener('click', () => handleUserClick(user));

    userName.addEventListener('click',()=>handleUserClick(user))
   
    userName.innerText = user.userName;
    userList.appendChild(userName);
});
}



let friendiD;
let chatRoomId;

const handleUserClick = (userData) => {
  
  document.getElementById('Selectuseremail').innerHTML=userData.email;
  document.getElementById('Selectusername').innerHTML=userData.userName
  const yourId=auth.currentUser.uid
  friendiD=userData.id


 
  if (yourId<friendiD) {
   chatRoomId=yourId+friendiD
  }
  else{
    chatRoomId=friendiD+yourId
  }
 

  getAllMesseges(chatRoomId)
 
}






window.Sendmessage =async () => {
  console.log("Dost==>",friendiD);
  const messageInput = document.getElementById('messageInput').value
  const messagesDiv = document.getElementById('messages');
  

try {
  
const docref= await addDoc(collection(db,"messeges"),{


  messege:messageInput,
  chatRoomId:chatRoomId,
  timestamp:serverTimestamp()
})

console.log("messege send");
localStorage.setItem('CHAT_ID',chatRoomId)

} catch (error) {
  console.log(error.message);
}

};


const getAllMesseges=(chatid)=>{
  const q=query(collection(db,'messeges'),where("chatRoomId",'==',chatid))
  const unsubscribe=onSnapshot(q,(querySnapshot)=>{
    const messeges=[]
    querySnapshot.forEach((doc)=>{
      messeges.push(doc.data())
    })
    console.log(messeges);
    displayMesseges(messeges)
  })


 
}


const displayMesseges=(messege)=>{

  const divmessege=document.getElementById('messages')
  divmessege.innerHTML = '';
  if (messege !== '') {
    messege.map((item)=>{
     
    
      const newMessage = document.createElement('div');
   
      newMessage.classList.add('message');
      newMessage.innerText = `You: ${item.messege}`;
      divmessege.appendChild(newMessage);

    })

      
    }
}
