// Import fungsi inti dari Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAF1F7swRNaYUYUDk3X8w9Yp5pSnTm1gWg",
    authDomain: "geoportalkriminalitas.firebaseapp.com",
    projectId: "geoportalkriminalitas",
    storageBucket: "geoportalkriminalitas.firebasestorage.app",
    messagingSenderId: "838654341673",
    appId: "1:838654341673:web:3dd1355555d35a27d5e238",
    measurementId: "G-G9EZ4MV3R8"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore Database
const db = getFirestore(app);

// Export db agar bisa di-import di file JS lainnya
export { db };