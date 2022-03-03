import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCptclDmlQPVgFFgbOOGV-FFaJWQK-fo2E",
    authDomain: "ammtracker-1303c.firebaseapp.com",
    projectId: "ammtracker-1303c",
    storageBucket: "ammtracker-1303c.appspot.com",
    messagingSenderId: "736019759206",
    appId: "1:736019759206:web:55e5f11ad4c63ed69aada7"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
