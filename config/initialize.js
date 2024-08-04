// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4sDht74GihzodlpnUfi26VGtR_x0zoJY",
    authDomain: "cab-project-bb369.firebaseapp.com",
    projectId: "cab-project-bb369",
    storageBucket: "cab-project-bb369.appspot.com",
    messagingSenderId: "84664996662",
    appId: "1:84664996662:web:99031da73f5a1a73db5997",
    measurementId: "G-P1BM88EXVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };