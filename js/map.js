import { db, storage } from "./firebase.js";

import {
collection,
addDoc,
onSnapshot
}

from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {

ref,
uploadBytes,
getDownloadURL

}

from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";



var map = L.map('map').setView([-0.95,100.35],13);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{

maxZoom:19

}).addTo(map);


let marker;



map.on("click",function(e){

let lat=e.latlng.lat;
let lng=e.latlng.lng;

document.getElementById("lat").value=lat;
document.getElementById("lng").value=lng;

if(marker){

map.removeLayer(marker)

}

marker=L.marker([lat,lng]).addTo(map)

})



navigator.geolocation.getCurrentPosition(function(pos){

let user=[pos.coords.latitude,pos.coords.longitude]

L.marker(user).addTo(map)

.bindPopup("Posisi Anda")

map.setView(user,15)

})



const form=document.getElementById("reportForm");


form.addEventListener("submit",async(e)=>{

e.preventDefault();

let nama=document.getElementById("nama").value
let kontak=document.getElementById("kontak").value
let daerah=document.getElementById("daerah").value
let kategori=document.getElementById("kategori").value
let ket=document.getElementById("keterangan").value
let lat=document.getElementById("lat").value
let lng=document.getElementById("lng").value

let file=document.getElementById("foto").files[0]

let url=""

if(file){

const storageRef=ref(storage,"foto/"+file.name)

await uploadBytes(storageRef,file)

url=await getDownloadURL(storageRef)

}

await addDoc(collection(db,"laporan"),{

nama:nama,
kontak:kontak,
daerah:daerah,
kategori:kategori,
keterangan:ket,
lat:lat,
lng:lng,
foto:url,
status:"baru"

})

alert("Laporan berhasil dikirim")

})



onSnapshot(collection(db,"laporan"),(snapshot)=>{

snapshot.forEach(doc=>{

let data=doc.data()

L.marker([data.lat,data.lng])
.addTo(map)
.bindPopup(

"<b>"+data.kategori+"</b><br>"+
data.keterangan

)

})

})