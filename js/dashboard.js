import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

async function loadDashboardData() {
    try {
        // Query ambil data, urutkan berdasarkan waktu terbaru (maksimal 100 data untuk dashboard)
        const q = query(collection(db, "laporan"), orderBy("timestamp", "desc"), limit(100));
        const querySnapshot = await getDocs(q);

        let total = 0;
        let baru = 0;
        let selesai = 0;
        
        // Objek untuk menghitung jumlah per kategori
        let kategoriCount = {
            "Pencurian": 0,
            "Perampokan": 0,
            "Kekerasan": 0,
            "Narkoba": 0
        };

        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Kosongkan tabel loading

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            total++;

            // Hitung status
            if(data.status === "Baru") baru++;
            if(data.status === "Selesai") selesai++;

            // Hitung kategori
            if(kategoriCount[data.kategori] !== undefined) {
                kategoriCount[data.kategori]++;
            }

            // Render baris tabel untuk 5 data pertama saja
            if(total <= 5) {
                const tr = document.createElement('tr');
                tr.className = "border-b border-slate-100";
                
                // Badge warna status
                let statusClass = "bg-red-100 text-red-600";
                if(data.status === "Diproses") statusClass = "bg-yellow-100 text-yellow-600";
                if(data.status === "Selesai") statusClass = "bg-green-100 text-green-600";

                tr.innerHTML = `
                    <td class="py-3">${data.nama}</td>
                    <td class="py-3">${data.kategori}</td>
                    <td class="py-3">
                        <span class="px-2 py-1 rounded text-xs font-semibold ${statusClass}">
                            ${data.status || 'Baru'}
                        </span>
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        });

        // Update Kartu Statistik
        document.getElementById('totalLaporan').innerText = total;
        document.getElementById('laporanBaru').innerText = baru;
        document.getElementById('laporanSelesai').innerText = selesai;

        // Render Chart.js
        renderChart(kategoriCount);

    } catch (error) {
        console.error("Gagal memuat data dashboard: ", error);
        document.getElementById('tableBody').innerHTML = `<tr><td colspan="3" class="text-center py-4 text-red-500">Gagal memuat data database. Pastikan rules Firestore publik (test mode).</td></tr>`;
    }
}

function renderChart(dataKategori) {
    const ctx = document.getElementById('kategoriChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(dataKategori),
            datasets: [{
                data: Object.values(dataKategori),
                backgroundColor: [
                    '#ef4444', // Merah - Pencurian
                    '#eab308', // Kuning - Perampokan
                    '#3b82f6', // Biru - Kekerasan
                    '#22c55e'  // Hijau - Narkoba
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

// Jalankan saat load
loadDashboardData();