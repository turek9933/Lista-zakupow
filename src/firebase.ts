import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/src/constants/firebase";

// https://console.firebase.google.com/
// fireConfig
// Zawartość plików konfiguracyjnych ze strony Google - Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db  = getFirestore(app);