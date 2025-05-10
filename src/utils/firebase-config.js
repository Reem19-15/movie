
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB16kE0IeJBHgX09ELsrjLZunoD3hXChuY",
  authDomain: "movie-recomendation-5148a.firebaseapp.com",
  projectId: "movie-recomendation-5148a",
  storageBucket: "movie-recomendation-5148a.firebasestorage.app",
  messagingSenderId: "891790161829",
  appId: "1:891790161829:web:589828ebf48a795f8d1a4c",
  measurementId: "G-08T72YHW4E"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth =getAuth(app);