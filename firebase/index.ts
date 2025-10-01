import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBXJg-SwyGzRM4VMo0z7mTPbVGs0EzhYOI",
  authDomain: "engi9-website.firebaseapp.com",
  projectId: "engi9-website",
  storageBucket: "engi9-website.firebasestorage.app",
  messagingSenderId: "738484744139",
  appId: "1:738484744139:web:6cccd9096d96f0c048104e",
  measurementId: "G-TLMLJVRKNS"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
