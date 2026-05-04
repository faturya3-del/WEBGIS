import { db, storage } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

// Inisialisasi Peta
const map = L.map('map').setView([-6.200000, 106.816666], 12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let currentMarker;
const form = document.getElementById('laporanForm');
const fileInput = document.getElementById('foto');

// Klik peta untuk ambil koordinat
map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    document.getElementById('lat').value = lat.toFixed(6);
    document.getElementById('lng').value = lng.toFixed(6);
    
    if (currentMarker) currentMarker.setLatLng(e.latlng);
    else currentMarker = L.marker(e.latlng).addTo(map);
});

// Update nama file di UI
fileInput.addEventListener('change', (e) => {
    document.getElementById('fileName').innerText = e.target.files[0]?.name || "";
});

// Proses Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const lat = document.getElementById('lat').value;

    if (!lat) return alert("Pilih lokasi di peta!");

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
            fotoUrl,
            koordinat: { lat: parseFloat(lat), lng: parseFloat(document.getElementById('lng').value) },
            status: "Baru",
            timestamp: serverTimestamp()
        });

        alert("Berhasil terkirim!");
        form.reset();
        document.getElementById('fileName').innerText = "";
        if (currentMarker) map.removeLayer(currentMarker);
    } catch (err) {
        alert("Gagal: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Kirim Laporan";
    }
});
