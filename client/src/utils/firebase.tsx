import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCsArvIN7EPGmxpZZz3ZMlOKoqALpKs-_8",
    authDomain: "trends-autonote.firebaseapp.com",
    projectId: "trends-autonote",
    storageBucket: "trends-autonote.appspot.com",
    messagingSenderId: "270438064064",
    appId: "1:270438064064:web:29caf0a0f67f7e7ff2b225",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };
