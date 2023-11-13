// import Firebase SDK: app, auth, and firestore
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// Function that will initialize our Firestore Database
const firebaseConfig = {
    apiKey: "AIzaSyCsjeWRfwYigzH_MaY-22K3XlThBDryeO0",
    authDomain: "rnfirebase-ce618.firebaseapp.com",
    projectId: "rnfirebase-ce618",
    storageBucket: "rnfirebase-ce618.appspot.com",
    messagingSenderId: "335531412072",
    appId: "1:335531412072:web:7868737e5ced3c660749dd",
    measurementId: "G-ZJNTPM8PVZ"
  };

// Checks whether there is already a Firestore Database initialized
if (!firebase.apps.length > 0) {
    firebase.initializeApp(firebaseConfig)
}

// Export firebase
export { firebase }