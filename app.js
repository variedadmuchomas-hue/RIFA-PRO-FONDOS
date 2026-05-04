// ============================================================
//  app.js  —  Talonario público RIFA STEM v4
//  Firebase · Tiempo real · Bloqueo 1h · Config dinámica
//  Soporte dual-combo (dos rifas / dos fechas)
// ============================================================
import { initializeApp }      from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc,
         onSnapshot, setDoc, deleteDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyA4auC2caQVgCXvRnCMabDr2k8WVvCTzBw",
  authDomain:        "rifas-online-d0bae.firebaseapp.com",
  projectId:         "rifas-online-d0bae",
  storageBucket:     "rifas-online-d0bae.firebasestorage.app",
  messagingSenderId: "905341315838",
  appId:             "1:905341315838:web:6b2d6321af6797643f93af"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const UNA_HORA = 60 * 60 * 1000;

// ── Estado global ─────────────────────────────────────────
let config     = {};
let rifaData   = {};   // combo actual
let rifaData2  = {};   // combo 2 (si hay dual)
let combo      = 1;      // combo activo en pantalla
let selNum     = null;
let bloqueando = false;

// ── DOM ───────────────────────────────────────────────────
const grid       = document.getElementById("grid");
const overlay    = document.getElementById("overlay");
const timerAviso = document.getElementById("timerAviso");

// ── Skeleton inicial ──────────────────────────────────────
function skeleton() {
  grid.innerHTML = "";
  for (let i=0;i<100;i++) {
    const b = document.createElement("div");
    b.className="nb sk";
    b.innerHTML=`<span class="n">${String(i).padStart(2,"00")}</span>`;
    grid.appendChild(b);
  }
}
skeleton();

// ── Escuchar CONFIG ───────────────────────────────────────
onSnapshot(doc(db,"config","rifa"), snap => {
  config = snap.exists() ? snap.data() : {};
  aplicarConfig(config);
});

function aplicarConfig(c) {
  const s=(id,v)=>{const e=document.getElementById(id);if(e&&v!==undefined)e.innerHTML=v;};
  s("hBadge",   c.badge   || "🎟️ Rifa Oficial — Apoyo STEM");
  s("hTitulo",  c.titulo  || "Juega el 16 de mayo de 2026<br>con la Lotería de Boyacá");
  s("hSub",     c.sub     || "Dos últimas cifras del número ganador");
  s("hP1",      c.p1      || "Buchanan's DeLuxe 12Y");
  s("hP2",      c.p2      || "Ron Medellín Añejo");
  s("hValor",   c.valor   || "$10.000");
  s("hFecha",   c.fecha   || "16 de mayo de 2026");
  s("hNequi",   c.nequi   || "320 887 1253 · 311 457 1322");
  s("hCausa",   c.causa   || "🎓 Apoya a nuestros niños en las<br>Olimpiadas STEM — Ministerio de Educación");
  s("hCausaSub",c.causaSub|| "Tu número ayuda a financiar la participación de dos estudiantes talentosos.");
  s("mPrecio",  c.valor   || "$10.000");

  // Fotos de fondo
  const f1 = document.getElementById("foto1");
  const f2 = document.getElementById("foto2");
  if (f1 && c.foto1) f1.src = c.foto1;
  if (f2 && c.foto2) f2.src = c.foto2;

  // Dual combo
  const tabCombos = document.getElementById("tabCombos");
  if (tabCombos) tabCombos.style.display = c.dualCombo ? "flex" : "none";
  if (c.dualCombo) {
    const t1=document.getElementById("tabC1");
    const t2=document.getElementById("tabC2");
    if(t1) t1.textContent = c.labelC1 || "Combo 1 — "+( c.fecha||"Mayo 2026");
    if(t2) t2.textContent = c.labelC2 || "Combo 2 — "+(c.fecha2||"Fecha 2");
  }
}

// ── Escuchar números combo 1 ──────────────────────────────
onSnapshot(collection(db,"rifa"), snap => {
  rifaData = {};
  snap.forEach(d => { rifaData[d.id] = d.data(); });
  if (combo===1) { renderGrid(); actualizarStats(); limpiar(rifaData,"rifa"); }
});

// ── Escuchar números combo 2 ──────────────────────────────
onSnapshot(collection(db,"rifa2"), snap => {
  rifaData2 = {};
  snap.forEach(d => { rifaData2[d.id] = d.data(); });
  if (combo===2) { renderGrid(); actualizarStats(); limpiar(rifaData2,"rifa2"); }
});

// ── Estado efectivo ───────────────────────────────────────
function getEstado(k, datos) {
  const d = datos[k];
  if (!d) return "libre";
  if (d.estado==="pagado") return "pagado";
  if (d.estado==="reservado") {
    if (Date.now()-d.tiempo > UNA_HORA) return "libre";
    return "reservado";
  }
  return "libre";
}

// ── Render grid ───────────────────────────────────────────
function renderGrid() {
  const datos = combo===1 ? rifaData : rifaData2;
  grid.innerHTML="";
  const ahora=Date.now();
  let hayRes=false;

  for(let i=0;i<100;i++) {
    const k=String(i).padStart(2,"0");
    const st=getEstado(k,datos);
    const d=datos[k];
    if(st==="reservado") hayRes=true;

    let etiq="libre";
    if(st==="reservado"){ const ms=UNA_HORA-(ahora-d.tiempo); etiq=fmtMin(ms); }
    else if(st==="pagado") etiq="vendido";

    const btn=document.createElement("button");
    btn.className=`nb ${st}`;
    btn.setAttribute("aria-label",`Número ${k}: ${st}`);
    btn.innerHTML=`<span class="n">${k}</span><span class="t">${etiq}</span>`;

    if(st==="libre") btn.addEventListener("click",()=>abrirModal(k));
    else if(st==="reservado") btn.addEventListener("click",()=>toast(`N° ${k} en proceso. Libre en ${etiq}.`,"warn"));
    else btn.addEventListener("click",()=>toast(`N° ${k} ya fue vendido.`,"warn"));

    grid.appendChild(btn);
  }
  timerAviso.classList.toggle("show",hayRes);
}

// ── Stats ─────────────────────────────────────────────────
function actualizarStats() {
  const datos=combo===1?rifaData:rifaData2;
  let l=0,r=0,p=0;
  for(let i=0;i<100;i++) {
    const e=getEstado(String(i).padStart(2,"0"),datos);
    if(e==="libre")l++;else if(e==="reservado")r++;else p++;
  }
  document.getElementById("sL").textContent=l;
  document.getElementById("sR").textContent=r;
  document.getElementById("sP").textContent=p;
  const pct=Math.round((p/100)*100);
  document.getElementById("sPct").textContent=pct+"%";
  document.getElementById("pFill").style.width=pct+"%";
  const v=(config.valor||"$10.000").replace(/\D/g,"");
  const precio=parseInt(v)||10000;
  document.getElementById("sMeta").textContent=
    `${p} vendidos · ${r} en proceso · Recaudado: $${(p*precio).toLocaleString("es-CO")}`;
}

// ── Limpiar expirados ─────────────────────────────────────
async function limpiar(datos, colName) {
  const ahora=Date.now();
  for(const[k,d] of Object.entries(datos)) {
    if(d.estado==="reservado" && ahora-d.tiempo>UNA_HORA) {
      try{await deleteDoc(doc(db,colName,k));}catch(_){}
    }
  }
}

// ── Cambiar combo ─────────────────────────────────────────
window.setCombo = (n, btn) => {
  combo=n;
  document.querySelectorAll(".combo-tab").forEach(t=>t.classList.remove("act"));
  btn.classList.add("act");
  skeleton();
  renderGrid();
  actualizarStats();
  // Actualizar badge de fecha
  const fb=document.getElementById("fechaBadge");
  if(fb) fb.textContent = n===1?(config.fecha||"16 Mayo 2026"):(config.fecha2||"Fecha 2");
};

// ── Modal ─────────────────────────────────────────────────
function abrirModal(k) {
  selNum=k;
  document.getElementById("mNum").textContent=k;
  document.getElementById("iNombre").value="";
  document.getElementById("iWapp").value="";
  overlay.classList.add("show");
  setTimeout(()=>document.getElementById("iNombre").focus(),80);
}

window.cerrarModal = ()=>{overlay.classList.remove("show");selNum=null;};

window.confirmarReserva = async ()=>{
  if(bloqueando) return;
  const nombre=document.getElementById("iNombre").value.trim();
  const wapp=document.getElementById("iWapp").value.trim();
  if(!nombre){toast("Escribe tu nombre completo","warn");return;}
  if(wapp.length<7){toast("Escribe tu número de WhatsApp","warn");return;}

  const k=selNum;
  const colName=combo===1?"rifa":"rifa2";
  const ref=doc(db,colName,k);
  const ahora=Date.now();

  bloqueando=true;
  const btn=document.querySelector(".btn-ok");
  if(btn){btn.textContent="Reservando...";btn.disabled=true;}

  let snap;
  try{snap=await getDoc(ref);}
  catch(_){toast("Error de conexión. Intenta de nuevo.","err");reset();return;}

  if(snap.exists()){
    const d=snap.data();
    if(d.estado==="pagado"||(d.estado==="reservado"&&ahora-d.tiempo<=UNA_HORA)){
      toast("¡Ese número ya fue tomado! Elige otro.","err");
      cerrarModal();reset();return;
    }
  }

  try{
    await setDoc(ref,{estado:"reservado",nombre,whatsapp:wapp,tiempo:ahora,combo});
    cerrarModal();
    toast(`✓ N° ${k} reservado. Tienes 1 hora para pagar.`,"ok",6000);
  }catch(e){toast("Error al reservar. Intenta de nuevo.","err");}
  reset();
};

function reset(){
  bloqueando=false;
  const b=document.querySelector(".btn-ok");
  if(b){b.textContent="✓ Reservar ahora";b.disabled=false;}
}

// ── Toast ─────────────────────────────────────────────────
function toast(msg,tipo="ok",dur=3000){
  const cont=document.getElementById("toasts");
  const el=document.createElement("div");
  el.className=`toast ${tipo}`;el.textContent=msg;
  cont.appendChild(el);
  setTimeout(()=>{el.style.opacity="0";el.style.transition="opacity .3s";setTimeout(()=>el.remove(),310);},dur);
}
window.toast=toast;

function fmtMin(ms){
  if(ms<=0) return "libre";
  const m=Math.floor(ms/60000);
  return m>0?`${m}m`:`${Math.floor(ms/1000)}s`;
}

setInterval(()=>{renderGrid();actualizarStats();},30000);
