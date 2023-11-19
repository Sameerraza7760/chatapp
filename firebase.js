
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged ,updateProfile,sendEmailVerification,updateEmail    }  from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore,collection,addDoc,setDoc,doc,getDoc,getDocs,updateDoc,onSnapshot,query,where,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBD72Keid-64C2vHC8B5NzcgAuhSzfFfrU",
  authDomain: "chat-app-6db4c.firebaseapp.com",
  projectId: "chat-app-6db4c",
  storageBucket: "chat-app-6db4c.appspot.com",
  messagingSenderId: "1081117614307",
  appId: "1:1081117614307:web:1cc078650d838122b765d6",
  measurementId: "G-L1ZSJQHESH"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);





async function SignupFirebase(userInfo) {
  const { email, password,userName } = userInfo
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await addUserToDB(userInfo, userCredential.user.uid)

  
  
}

const  addUserToDB= async(userInfo, id) =>{
  const {email,userName} = userInfo
    await setDoc(doc(db, "users", id), {email,userName,id})
}

async function  signinFirebase(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
}

function keeploggined() {
  onAuthStateChanged(auth, (user) => {
      if (user) {
          // const uid = user.uid;
          console.log("User is loggined");
          
      } else {
          console.log("User is signed out");
        

      }
  });
}
keeploggined()




export {

  signinFirebase,
  addUserToDB,
  SignupFirebase,auth,
  onAuthStateChanged,
  getDoc,doc,db,getDocs,collection,
  sendEmailVerification ,
  updateProfile,
  updateDoc,
  updateEmail,
  onSnapshot,
   query,where,
   serverTimestamp,
   addDoc
  
}
