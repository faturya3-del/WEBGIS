import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

async function loadDashboard() {
    const q = query(collection(db, "laporan"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    
    let total = 0, baru = 0, selesai = 0;
    let kategoriCount = { "Pencurian": 0, "Perampokan": 0, "Kekerasan": 0, "Narkoba": 0 };
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        total++;
        
        if (data.status === "Baru") baru++;
        if (data.status === "Selesai") selesai++;
        if (kategoriCount[data.kategori] !== undefined) kategoriCount[data.kategori]++;

        // Render Table Row
        const tr = document.createElement('tr');
        tr.className = "border-b border-slate-100 last:border-0";
        tr.innerHTML = `
            <td class="py-3">${data.nama}</td>
            <td class="py-3">${data.kategori}</td>
            <td class="py-3">
                <span class="px-2 py-1 text-[10px] font-bold rounded ${data.status === 'Baru' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
                    ${data.status}
                </span>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Update Cards
    document.getElementById('totalLaporan').innerText = total;
    document.getElementById('laporanBaru').innerText = baru;
    document.getElementById('selesaiDitinjau').innerText = selesai;

    // Render Chart
    const ctx = document.getElementById('kriminalChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pencurian', 'Perampokan', 'Kekerasan', 'Narkoba'],
            datasets: [{
                data: [kategoriCount.Pencurian, kategoriCount.Perampokan, kategoriCount.Kekerasan, kategoriCount.Narkoba],
                backgroundColor: ['#ef4444', '#eab308', '#3b82f6', '#22c55e'], // Red, Yellow, Blue, Green
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12 } }
            }
        }
    });
}

loadDashboard();
