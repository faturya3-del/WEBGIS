// Import db dari firebase.js
import { db } from './firebase.js';
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// --- INISIALISASI PETA ---
const map = L.map('map').setView([-6.200000, 106.816666], 12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

let currentMarker; // Marker sementara untuk form

// Klik peta untuk set koordinat form
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    if (currentMarker) {
        currentMarker.setLatLng(e.latlng);
    } else {
        currentMarker = L.marker(e.latlng).addTo(map);
    }
});

// --- AMBIL DATA MARKER DARI DATABASE ---
async function loadMarkers() {
    try {
        const querySnapshot = await getDocs(collection(db, "laporan"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.koordinat) {
                // Tambahkan marker ke peta dari database
                L.marker([data.koordinat.lat, data.koordinat.lng])
                    .addTo(map)
                    .bindPopup(`<b>${data.kategori}</b><br>${data.keterangan}`);
            }
        });
    } catch (error) {
        console.error("Gagal memuat marker: ", error);
    }
}
// Jalankan fungsi saat halaman dimuat
loadMarkers();


// --- SUBMIT FORM KE FIREBASE ---
const form = document.getElementById('laporanForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const latVal = document.getElementById('lat').value;
    const lngVal = document.getElementById('lng').value;

    if (!latVal || !lngVal) {
        alert("Silakan klik pada peta terlebih dahulu untuk menentukan koordinat lokasi!");
        return;
    }

    submitBtn.innerText = "Mengirim...";
    submitBtn.disabled = true;

    try {
        await addDoc(collection(db, "laporan"), {
            nama: document.getElementById('nama').value,
            kategori: document.getElementById('kategori').value,
            keterangan: document.getElementById('keterangan').value,
            koordinat: { lat: parseFloat(latVal), lng: parseFloat(lngVal) },
            status: "Baru",
            timestamp: serverTimestamp()
        });
        
        alert("Laporan berhasil dikirim!");
        form.reset();
        document.getElementById('lat').value = '';
        document.getElementById('lng').value = '';
        
        // Hapus marker sementara dan muat ulang marker database
        if (currentMarker) map.removeLayer(currentMarker);
        currentMarker = null;
        loadMarkers(); 

    } catch (error) {
        console.error("Error: ", error);
        alert("Gagal mengirim laporan.");
    } finally {
        submitBtn.innerText = "Kirim Laporan";
        submitBtn.disabled = false;
    }
});
