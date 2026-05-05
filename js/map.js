import { db, storage } from './firebase.js';
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

// Inisialisasi Peta (Area Jakarta sesuai screenshot)
const map = L.map('map').setView([-6.175392, 106.827153], 12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & CARTO'
}).addTo(map);

let currentMarker;
const form = document.getElementById('laporanForm');
const fileInput = document.getElementById('foto');


import { auth, provider } from "./firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const teksStatus = document.getElementById("teksStatusLogin");

// Fungsi Login
btnLogin.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        alert("Gagal Login: " + error.message);
    }
});

// Fungsi Logout
btnLogout.addEventListener("click", () => {
    signOut(auth);
});

// Pantau Status Login
onAuthStateChanged(auth, (user) => {
    if (user) {
        teksStatus.innerText = `Halo, ${user.displayName}. Anda melapor sebagai Member.`;
        btnLogin.classList.add("hidden");
        btnLogout.classList.remove("hidden");
    } else {
        teksStatus.innerText = "Anda melaporkan sebagai Anonim.";
        btnLogin.classList.remove("hidden");
        btnLogout.classList.add("hidden");
    }
});
// Load Data Laporan ke Peta
async function loadMarkers() {
    const querySnapshot = await getDocs(collection(db, "laporan"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if(data.koordinat) {
            L.marker([data.koordinat.lat, data.koordinat.lng])
             .addTo(map)
             .bindPopup(`<b>${data.kategori}</b><br>${data.keterangan}`);
        }
    });
}
loadMarkers();

// Klik Peta
map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    document.getElementById('lat').value = lat.toFixed(6);
    document.getElementById('lng').value = lng.toFixed(6);
    
    if (currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.marker(e.latlng).addTo(map);
});

// Update Nama File
fileInput.addEventListener('change', (e) => {
    document.getElementById('fileName').innerText = e.target.files[0]?.name || "";
});

// Submit Form
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const lat = document.getElementById('lat').value;

    if (!lat) return alert("Silakan klik lokasi pada peta terlebih dahulu!");

    btn.disabled = true;
    btn.innerText = "Mengirim...";

    try {
        let fotoUrl = null;
        if (fileInput.files[0]) {
            const file = fileInput.files[0];
            const storageRef = ref(storage, `laporan/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            fotoUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, "laporan"), {
            nama: document.getElementById('nama').value,
            kategori: document.getElementById('kategori').value,
            keterangan: document.getElementById('keterangan').value,
            fotoUrl: fotoUrl,
            koordinat: { lat: parseFloat(lat), lng: parseFloat(document.getElementById('lng').value) },
            status: "Baru",
            timestamp: serverTimestamp()
        });

        alert("Laporan berhasil dikirim!");
        form.reset();
        document.getElementById('fileName').innerText = "";
        loadMarkers(); // Refresh marker
    } catch (err) {
        alert("Gagal mengirim data: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Kirim Laporan";
    }
});
