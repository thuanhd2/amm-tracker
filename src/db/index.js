import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const getFirebaseConfigFromLocalStorage = () => {
    if (!window.localStorage["firebaseConfig"]) return null;

    return JSON.parse(window.localStorage["firebaseConfig"])
}

const firebaseConfig = getFirebaseConfigFromLocalStorage() || {
    apiKey: "AIzaSyBLR5VQrhdmxocYP21Jsoi7jCWkBXhtxrk",
    authDomain: "ammtracker-1303c.firebaseapp.com",
    projectId: "ammtracker-1303c",
    storageBucket: "ammtracker-1303c.appspot.com",
    messagingSenderId: "736019759206",
    appId: "1:736019759206:web:c41bedd85d6191449aada7"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
