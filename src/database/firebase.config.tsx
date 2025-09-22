// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApFkT0Tnr2r6aj4pIrwF5-B1Y4CK7w5bk",
  authDomain: "greendrop-f9fae.firebaseapp.com",
  databaseURL: "https://greendrop-f9fae-default-rtdb.firebaseio.com",
  projectId: "greendrop-f9fae",
  storageBucket: "greendrop-f9fae.firebasestorage.app",
  messagingSenderId: "897300232879",
  appId: "1:897300232879:web:8437d4d0d06e5ccf1ff25a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);