import React from 'react'
import { app, db } from './FirebaseConfig';
import { useState, useEffect } from 'react'
import { collection, setDoc, query, where, onSnapshot } from "firebase/firestore"; 
import { doc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";



// const SignUpUser=()=>{
//     const auth = getAuth();
// setDoc(doc(db, "Accounts",email), {
// "user":{
// "Property" : "value"
// } 

// });
// createUserWithEmailAndPassword(auth, email, password)
// .then((userCredential) => {
// alert("Your Account Is Created")
// const user = userCredential.user;

// })
// .catch((error) => {
// alert("An Error Occured")
// const errorCode = error.code;
// const errorMessage = error.message;
// // ..
// });
 
// }

// export {SignUpUser}


// const uploadPhoto = () => {
//     let d = new Date();
//     let t = d.getTime();
//     let files = inputRef.current.files[0];
//     const storageRef = ref(storage, `/${user.email}/${t}`);
//     const uploadTask = uploadBytesResumable(storageRef, files);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       },
//       (error) => {
//         alert("An Error Occured During Uploading Your Picture");
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//          let userPhoto = downloadURL;
//           setDoc(doc(db, "Accounts", user.email), {
//             ...user,
//             userPhoto
//           });

//           navigate("/home");
//         })
//       }
//     );
//   };



const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
  });



  const UploadPost=()=>{
    let date = new Date();
    let time = date.getTime().toString();

    let files = document.getElementById("contained-button-file").files[0];
    let caption = document.getElementById("caption").value;

    const storageRef = ref(storage, `/${email}/${time}`);
    const uploadTask = uploadBytesResumable(storageRef, files);
   
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        alert("An Error Occured During Uploading Your Picture");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          let pic = downloadURL;
          setDoc(doc(db, "Accounts", email , "post" ,time), {
          pic,
          caption
          });
       
        });
      }
    );
}