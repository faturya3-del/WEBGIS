var map = L.map('map').setView([-0.947,100.417],12);

var osm = L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

var marker;

map.on('click',function(e){

var lat = e.latlng.lat;
var lng = e.latlng.lng;

document.getElementById("lat").value = lat;
document.getElementById("lng").value = lng;

if(marker){
map.removeLayer(marker);
}

marker = L.marker([lat,lng]).addTo(map);

});

document.getElementById("laporanForm")
.addEventListener("submit",function(e){

e.preventDefault();

var laporan = {
nama:document.getElementById("nama").value,
daerah:document.getElementById("daerah").value,
kontak:document.getElementById("kontak").value,
keterangan:document.getElementById("keterangan").value,
lat:document.getElementById("lat").value,
lng:document.getElementById("lng").value
};

var data = JSON.parse(localStorage.getItem("laporan")) || [];

data.push(laporan);

localStorage.setItem("laporan",JSON.stringify(data));

alert("Laporan berhasil dikirim");

location.reload();

});

var laporan = JSON.parse(localStorage.getItem("laporan")) || [];

laporan.forEach(function(row){

var marker = L.marker([row.lat,row.lng]).addTo(map);

marker.bindPopup(
"<b>"+row.nama+"</b><br>"+
row.keterangan+"<br>"+
row.daerah
);

});