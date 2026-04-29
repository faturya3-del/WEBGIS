import { db } from "./firebase.js";

import {

collection,
addDoc,
onSnapshot

}

from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const map = L.map("map").setView([-0.95,100.35],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker;

map.on("click",(e)=>{

let lat=e.latlng.lat
let lng=e.latlng.lng

document.getElementById("lat").value=lat
document.getElementById("lng").value=lng

if(marker)map.removeLayer(marker)

marker=L.marker([lat,lng]).addTo(map)

})


const form=document.getElementById("reportForm")

form.addEventListener("submit",async(e)=>{

e.preventDefault()

await addDoc(collection(db,"laporan"),{

nama:document.getElementById("nama").value,
kategori:document.getElementById("kategori").value,
lat:document.getElementById("lat").value,
lng:document.getElementById("lng").value,
status:"baru"

})

alert("Laporan terkirim")

})


onSnapshot(collection(db,"laporan"),(snap)=>{

snap.forEach(doc=>{

let d=doc.data()

L.marker([d.lat,d.lng]).addTo(map)

})

})
