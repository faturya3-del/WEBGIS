import { db } from "./firebase.js";

import {

collection,
onSnapshot

}

from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


onSnapshot(collection(db,"laporan"),(snapshot)=>{

let total=0
let baru=0
let progress=0
let selesai=0

snapshot.forEach(doc=>{

let d=doc.data()

total++

if(d.status=="baru")baru++
if(d.status=="progress")progress++
if(d.status=="selesai")selesai++

})


document.getElementById("total").innerText=total
document.getElementById("baru").innerText=baru
document.getElementById("progress").innerText=progress
document.getElementById("selesai").innerText=selesai

})