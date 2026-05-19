# 🎟️ RIFA PRO FONDOS — Skill Completa

## ¿Cuándo activar esta skill?
Activa esta skill SIEMPRE que el usuario mencione: talonario, rifa, boleta, sorteo,
lotería, panel admin de rifa, licencias de talonario, números de rifa, desprendible
WhatsApp, mini-admin de cliente, congelar rifa, activar rifa, extender licencia,
o cualquier modificación al sistema RIFA PRO FONDOS.

---

## 🏗️ ARQUITECTURA GENERAL

```
RIFA PRO FONDOS — GitHub Pages + Firebase
├── /index.html              → Talonario público (rifa por defecto)
├── /r/{rifaId}              → Talonario público por ID único
├── /admin.html              → Super Admin (solo el dueño de la plataforma)
└── /miadmin.html?id={rifaId}→ Cliente Admin (mini-admin por talonario)
```

### Stack
- Firebase Firestore → base de datos en tiempo real
- Firebase Hosting / GitHub Pages → despliegue
- Firebase Auth → login Super Admin con email/contraseña
- HTML + CSS + JS vanilla con módulos ES6 (imports Firebase CDN)
- NO React, NO Node.js, NO build tools — archivos HTML puros

### Firebase config del proyecto
```js
const firebaseConfig = {
  apiKey: "AIzaSyA4auC2caQVgCXvRnCMabDr2k8WVvCTzBw",
  authDomain: "rifas-online-d0bae.firebaseapp.com",
  projectId: "rifas-online-d0bae",
  storageBucket: "rifas-online-d0bae.firebasestorage.app",
  messagingSenderId: "905341315838",
  appId: "1:905341315838:web:6b2d6321af6797643f93af"
};
```

---

## 🔐 TRES NIVELES DE USUARIO

```
Super Admin (dueño de la plataforma)
│  URL: /admin.html
│  Auth: Firebase Auth — email + contraseña real
│  Puede: TODO — crear rifas, gestionar licencias, congelar,
│          extender plazos, ver todos los clientes
│
├── Cliente Admin (cada cliente que compra una licencia)
│   URL: /miadmin.html?id=navidad2025
│   Auth: contraseña simple guardada en Firestore (campo: claveAdmin)
│   Puede: editar SU talonario, ver SUS ventas, aprobar SUS pagos,
│          configurar SU número WhatsApp, SUS fotos, SU precio, SU lotería
│
└── Comprador (público general)
    URL: /index.html o /r/navidad2025
    Auth: ninguna — acceso público
    Puede: ver números, reservar, enviar comprobante por WhatsApp
```

---

## 📦 ESTRUCTURA FIRESTORE COMPLETA

```
rifas/
  {rifaId}/
    rifaId:          "navidad2025"
    clienteNombre:   "Juan Pérez"
    clienteWhatsApp: "3001234567"    ← botón WhatsApp del talonario usa ESTE número
    claveAdmin:      "rifa2025"      ← contraseña del mini-admin del cliente
    nombre:          "Rifa Navidad 2025"
    estado:          "activa"        ← "activa"|"congelada"|"cerrada"
    cantidadNumeros: 100
    precioNumero:    20000
    loteria:         "Lotería de Bogotá"
    fechaSorteo:     "2025-12-16"
    metodoPago:      "Nequi"
    nequi:           ["3208871253","3114571322"]
    fechaCreacion:   timestamp
    fechaVencimiento:timestamp       ← licencia de 30 días
    diasLicencia:    30
    badge:           "🎟️ Rifa Oficial"
    titulo:          "Rifa Navidad"
    subtitulo:       "Juega el 16 de diciembre"
    premio1:         "Televisor Samsung 55"
    premio2:         "Bicicleta Trek"
    causa:           "Fondos para el colegio"
    fotoIzquierda:   "https://..."
    fotoDerecha:     "https://..."

  {rifaId}/numeros/{00..99}/
    numero:   "42"
    estado:   "libre"    ← "libre"|"reservado"|"pagado"
    nombre:   "María López"
    telefono: "3001234567"
    tiempo:   timestamp
    aprobado: false      ← true cuando el cliente admin aprueba el pago

licencias/
  {rifaId}/
    rifaId:           "navidad2025"
    clienteNombre:    "Juan Pérez"
    clienteWhatsApp:  "3001234567"
    fechaCreacion:    timestamp
    fechaVencimiento: timestamp
    diasLicencia:     30
    estado:           "activa"  ← "activa"|"por_vencer"|"vencida"|"congelada"
```

---

## 🎨 DESIGN SYSTEM — Tokens CSS

Siempre usar estas variables. Estética SaaS oscuro tipo Stripe/Linear:

```css
:root {
  --bg-base:          #0a0a0f;
  --bg-surface:       #12121a;
  --bg-elevated:      #1a1a26;
  --bg-hover:         #22223a;
  --accent-primary:   #6366f1;
  --accent-secondary: #8b5cf6;
  --accent-glow:      rgba(99,102,241,0.2);
  --num-libre:        #22c55e;
  --num-reservado:    #f59e0b;
  --num-pagado:       #ef4444;
  --num-bloqueado:    #374151;
  --text-primary:     #f1f5f9;
  --text-secondary:   #94a3b8;
  --text-muted:       #475569;
  --border-subtle:    rgba(255,255,255,0.06);
  --border-normal:    rgba(255,255,255,0.12);
  --border-accent:    rgba(99,102,241,0.4);
  --whatsapp:         #25d366;
  --whatsapp-dark:    #128c7e;
  --status-activa:    #22c55e;
  --status-por-vencer:#f59e0b;
  --status-vencida:   #ef4444;
  --status-congelada: #6366f1;
  --shadow-card:      0 4px 24px rgba(0,0,0,0.4);
  --shadow-glow:      0 0 20px rgba(99,102,241,0.15);
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;
}
```

### Tipografía (incluir en cada <head>)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```
- Títulos/headings: `font-family: 'Sora', sans-serif`
- Cuerpo/UI: `font-family: 'Inter', sans-serif`
- Números de talonario y códigos: `font-family: 'JetBrains Mono', monospace`

### Botones de números
```css
.numero-btn {
  aspect-ratio: 1; border-radius: var(--radius-md);
  border: 2px solid transparent;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.15s ease;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.numero-btn.libre     { background: var(--num-libre);     color: white; }
.numero-btn.libre:hover { transform: scale(1.12); box-shadow: 0 4px 16px rgba(34,197,94,0.5); }
.numero-btn.reservado { background: var(--num-reservado); color: #000; cursor: not-allowed; animation: pulse-yellow 2s infinite; }
.numero-btn.pagado    { background: var(--num-pagado);    color: white; cursor: not-allowed; }
.numero-btn.bloqueado { background: var(--num-bloqueado); color: var(--text-muted); cursor: not-allowed; }
```

### Grid responsive de números
```css
.grid-numeros { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
@media (min-width: 400px) { .grid-numeros { grid-template-columns: repeat(7, 1fr); } }
@media (min-width: 520px) { .grid-numeros { grid-template-columns: repeat(10, 1fr); } }
```

### Botón WhatsApp
```css
.btn-whatsapp {
  background: var(--whatsapp); color: white; border: none;
  border-radius: var(--radius-md); padding: 14px 24px;
  font-weight: 700; font-size: 15px; cursor: pointer;
  display: flex; align-items: center; gap: 10px; width: 100%;
  justify-content: center; font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(37,211,102,0.3);
}
.btn-whatsapp:hover { background: var(--whatsapp-dark); transform: translateY(-2px); }
```

### SVG ícono WhatsApp (usar siempre este)
```html
<svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:white;flex-shrink:0">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.856L0 24l6.335-1.502A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.733.885.918-3.638-.234-.374A9.768 9.768 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
</svg>
```

### Animaciones globales
```css
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse-yellow {
  0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(245,158,11,0); }
}
.spinner { width:32px; height:32px; border:3px solid var(--border-normal); border-top-color:var(--accent-primary); border-radius:50%; animation:spin 0.8s linear infinite; }
```

### Badges de estado
```css
.badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:var(--radius-full); font-size:12px; font-weight:600; }
.badge.activa     { background:rgba(34,197,94,0.15);  color:var(--status-activa); }
.badge.por-vencer { background:rgba(245,158,11,0.15); color:var(--status-por-vencer); }
.badge.vencida    { background:rgba(239,68,68,0.15);  color:var(--status-vencida); }
.badge.congelada  { background:rgba(99,102,241,0.15); color:var(--status-congelada); }
```

---

## 🔥 FIREBASE — Importación estándar (usar en todos los archivos)

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, getDocs,
         collection, onSnapshot, updateDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);
```

### Operaciones Firebase esenciales

**Verificar licencia** (llamar SIEMPRE al cargar talonario público):
```js
async function verificarLicencia(rifaId) {
  const snap = await getDoc(doc(db, "rifas", rifaId));
  if (!snap.exists()) return { valida: false, razon: "no_existe" };
  const data = snap.data();
  if (data.estado === "congelada") return { valida: false, razon: "congelada" };
  if (data.estado === "cerrada")   return { valida: false, razon: "cerrada" };
  const vence = data.fechaVencimiento?.toDate?.() || new Date(data.fechaVencimiento);
  if (new Date() > vence) return { valida: false, razon: "vencida" };
  return { valida: true, data };
}
```

**Reservar número** (comprador):
```js
async function reservarNumero(rifaId, numero, nombre, telefono) {
  const ref  = doc(db, "rifas", rifaId, "numeros", numero);
  const snap = await getDoc(ref);
  if (snap.exists() && snap.data().estado !== "libre") throw new Error("Número no disponible");
  await setDoc(ref, { numero, estado: "reservado", nombre, telefono, tiempo: serverTimestamp(), aprobado: false });
}
```

**Aprobar pago** (Cliente Admin):
```js
async function aprobarPago(rifaId, numero) {
  await updateDoc(doc(db, "rifas", rifaId, "numeros", numero),
    { estado: "pagado", aprobado: true, fechaAprobacion: serverTimestamp() });
}
```

**Liberar número** (Cliente Admin):
```js
async function liberarNumero(rifaId, numero) {
  await updateDoc(doc(db, "rifas", rifaId, "numeros", numero),
    { estado: "libre", nombre: "", telefono: "", tiempo: null, aprobado: false });
}
```

**Congelar / Activar** (Super Admin):
```js
async function toggleEstadoRifa(rifaId, nuevoEstado) {
  await updateDoc(doc(db, "rifas", rifaId), { estado: nuevoEstado });
  await updateDoc(doc(db, "licencias", rifaId), { estado: nuevoEstado });
}
```

**Extender licencia** (Super Admin):
```js
async function extenderLicencia(rifaId, diasExtra) {
  const snap = await getDoc(doc(db, "rifas", rifaId));
  const venc = snap.data().fechaVencimiento?.toDate?.() || new Date();
  venc.setDate(venc.getDate() + diasExtra);
  await updateDoc(doc(db, "rifas", rifaId), { fechaVencimiento: venc });
  await updateDoc(doc(db, "licencias", rifaId), { fechaVencimiento: venc, estado: "activa" });
}
```

**Escuchar números en tiempo real**:
```js
function escucharNumeros(rifaId, callback) {
  return onSnapshot(collection(db, "rifas", rifaId, "numeros"), snap => {
    const numeros = {};
    snap.forEach(d => { numeros[d.id] = d.data(); });
    callback(numeros);
  });
}
```

**Login Cliente Admin** (contraseña simple):
```js
async function loginClienteAdmin(rifaId, claveIngresada) {
  const snap = await getDoc(doc(db, "rifas", rifaId));
  if (!snap.exists()) throw new Error("Talonario no encontrado");
  if (snap.data().claveAdmin !== claveIngresada) throw new Error("Contraseña incorrecta");
  sessionStorage.setItem("clienteAdminRifaId", rifaId);
  return snap.data();
}
```

**Crear rifa completa** (Super Admin):
```js
async function crearRifaCompleta(formData) {
  const rifaId = formData.nombre.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s]/g,"").trim().replace(/\s+/g,"-")
    + "-" + new Date().getFullYear();

  const diasLicencia = parseInt(formData.diasLicencia) || 30;
  const vencimiento  = new Date();
  vencimiento.setDate(vencimiento.getDate() + diasLicencia);

  await setDoc(doc(db, "rifas", rifaId), {
    rifaId, ...formData, estado: "activa",
    fechaCreacion: serverTimestamp(), fechaVencimiento: vencimiento, diasLicencia,
    badge: "🎟️ Rifa Oficial", fotoIzquierda: "", fotoDerecha: "",
  });

  const promesas = [];
  for (let i = 0; i < 100; i++) {
    const n = i.toString().padStart(2,"0");
    promesas.push(setDoc(doc(db,"rifas",rifaId,"numeros",n),
      { numero:n, estado:"libre", nombre:"", telefono:"", tiempo:null, aprobado:false }));
  }
  await Promise.all(promesas);

  await setDoc(doc(db, "licencias", rifaId), {
    rifaId, clienteNombre: formData.clienteNombre,
    clienteWhatsApp: formData.clienteWhatsApp,
    fechaCreacion: serverTimestamp(), fechaVencimiento: vencimiento,
    diasLicencia, estado: "activa",
  });

  return { rifaId, linkTalonario: `/r/${rifaId}`, linkAdmin: `/miadmin.html?id=${rifaId}` };
}
```

**Guardar config del cliente** (whitelist de campos editables):
```js
async function guardarConfigCliente(rifaId, cambios) {
  const permitidos = ["badge","titulo","subtitulo","premio1","premio2",
    "loteria","precioNumero","causa","fotoIzquierda","fotoDerecha",
    "metodoPago","nequi","clienteWhatsApp"];
  const filtrado = {};
  permitidos.forEach(c => { if (cambios[c] !== undefined) filtrado[c] = cambios[c]; });
  await updateDoc(doc(db, "rifas", rifaId), filtrado);
}
```

---

## 📲 WHATSAPP — Desprendible automático

**REGLA CRÍTICA**: El número de WhatsApp SIEMPRE viene de `rifaData.clienteWhatsApp` en Firestore. NUNCA hardcodear.

```js
function abrirWhatsapp(rifaData, numSelected, nombreComprador, telefonoComprador) {
  const numero = (rifaData.clienteWhatsApp || "").replace(/\D/g, "");
  if (!numero) { mostrarToast("⚠️ Talonario sin WhatsApp configurado","warning"); return; }

  const fecha = new Date().toLocaleDateString("es-CO",
    { day:"2-digit", month:"long", year:"numeric" });
  const nequiLineas = Array.isArray(rifaData.nequi) && rifaData.nequi.length
    ? rifaData.nequi.map((n,i) => `  ${i+1}. ${n}`).join("\n")
    : "  " + (rifaData.metodoPago || "Consultar con el organizador");

  const msg =
`🎟️ *COMPROBANTE DE RESERVA*
━━━━━━━━━━━━━━━━━━━━
📋 *Rifa:* ${rifaData.titulo || rifaData.nombre}
🔢 *Número elegido:* *${numSelected}*
👤 *Nombre:* ${nombreComprador}
📱 *Teléfono:* ${telefonoComprador}
💵 *Valor:* $${Number(rifaData.precioNumero||0).toLocaleString("es-CO")}
🎯 *Lotería:* ${rifaData.loteria || "—"}
📅 *Fecha sorteo:* ${rifaData.fechaSorteo || "—"}
━━━━━━━━━━━━━━━━━━━━
💳 *INSTRUCCIONES DE PAGO*
Pagar por ${rifaData.metodoPago || "Nequi"} a:
${nequiLineas}
━━━━━━━━━━━━━━━━━━━━
📸 Adjunta tu comprobante de pago.
_Reserva realizada: ${fecha}_`;

  window.open(`https://wa.me/57${numero}?text=${encodeURIComponent(msg)}`, "_blank");
}
```

**Cuándo mostrar el botón WhatsApp**: SOLO después de que el número fue reservado exitosamente en Firestore. El botón aparece en la sección de éxito del modal, NO antes.

---

## 🔑 LICENCIAS — Estados y lógica

| Estado | Descripción | Talonario público |
|---|---|---|
| `activa` | Funcionando normal | ✅ Visible |
| `por_vencer` | ≤5 días restantes | ✅ Visible + banner amarillo |
| `congelada` | Admin la pausó | 🔒 Pantalla de bloqueo |
| `vencida` | Fecha superada | 🔒 Pantalla de bloqueo |
| `cerrada` | Rifa terminada | 🔒 Pantalla de cierre |

**Mostrar bloqueo:**
```js
function mostrarBloqueo(razon) {
  const msgs = {
    congelada: { icon:"⏸️", titulo:"Talonario pausado",   desc:"Este talonario está temporalmente inactivo." },
    vencida:   { icon:"⏰", titulo:"Talonario vencido",    desc:"La licencia de este talonario ha expirado." },
    cerrada:   { icon:"🏆", titulo:"Rifa finalizada",      desc:"Esta rifa ya concluyó. ¡Gracias por participar!" },
    no_existe: { icon:"❌", titulo:"No encontrado",         desc:"Este talonario no existe." },
  };
  const m = msgs[razon] || msgs.no_existe;
  document.body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                min-height:100vh;text-align:center;gap:16px;padding:32px;
                background:var(--bg-base);font-family:'Inter',sans-serif;color:var(--text-primary)">
      <div style="font-size:72px;opacity:0.5">${m.icon}</div>
      <h2 style="font-family:'Sora',sans-serif;font-size:24px">${m.titulo}</h2>
      <p style="color:var(--text-secondary);max-width:320px">${m.desc}</p>
      <p style="color:var(--text-muted);font-size:12px">Si eres el organizador, contacta al administrador de la plataforma.</p>
    </div>`;
}
```

**Calcular barra de progreso de licencia:**
```js
function calcularBarraLicencia(fechaCreacion, fechaVencimiento) {
  const inicio = fechaCreacion?.toDate?.()  || new Date(fechaCreacion);
  const fin    = fechaVencimiento?.toDate?.() || new Date(fechaVencimiento);
  const ahora  = new Date();
  const pct    = Math.min(100, Math.max(0, ((ahora-inicio)/(fin-inicio))*100));
  const dias   = Math.max(0, Math.floor((fin-ahora)/86400000));
  const color  = pct < 50 ? "var(--status-activa)" : pct < 80 ? "var(--status-por-vencer)" : "var(--status-vencida)";
  return { pct, dias, color };
}
```

---

## 👤 CLIENTE ADMIN — Mini-panel por talonario

URL: `/miadmin.html?id={rifaId}`
Auth: contraseña simple vs `claveAdmin` en Firestore.

**Flujo de login:**
```js
const rifaId = new URLSearchParams(window.location.search).get("id");
if (!rifaId) { /* mostrar error */ return; }

const sesion = sessionStorage.getItem("clienteAdminRifaId");
if (sesion === rifaId) {
  cargarPanelCliente(rifaId);
} else {
  // Mostrar formulario de contraseña
}
```

**Secciones del panel cliente:**
1. 📊 Estadísticas en tiempo real (libres / reservados / pagados / recaudado)
2. ✏️ Editor de encabezado (badge, título, subtítulo, premios, lotería, precio, fotos, WhatsApp, Nequi)
3. 📋 Lista de compradores (reservados y pagados, ordenados por tiempo)
4. ✅ Aprobar / rechazar pagos con un botón
5. ⚠️ Banner si licencia vence en ≤5 días

**Campos que el cliente PUEDE editar** (whitelist estricta):
`badge`, `titulo`, `subtitulo`, `premio1`, `premio2`, `loteria`, `precioNumero`,
`causa`, `fotoIzquierda`, `fotoDerecha`, `metodoPago`, `nequi`, `clienteWhatsApp`

**El cliente NO puede editar:** `estado`, `fechaVencimiento`, `diasLicencia`, `claveAdmin`, `rifaId`

**Card de comprador:**
```html
<div class="comprador-card" style="display:flex;align-items:center;gap:16px;
  background:var(--bg-elevated);border-radius:var(--radius-md);padding:14px 16px;
  margin-bottom:8px;border-left:4px solid {color_segun_estado}">
  <span style="font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;min-width:48px;text-align:center">{numero}</span>
  <div style="flex:1">
    <strong>{nombre}</strong>
    <div style="font-size:12px;color:var(--text-secondary)">📱 {telefono}</div>
    <div style="font-size:12px;color:var(--text-muted)">{tiempo}</div>
  </div>
  <div style="display:flex;gap:8px">
    <!-- Si reservado: botón aprobar + botón liberar -->
    <!-- Si pagado: badge verde "✅ Pagado" -->
  </div>
</div>
```

---

## 🖥️ SUPER ADMIN — Panel completo

URL: `/admin.html`
Auth: Firebase Auth (email + contraseña real).

**Proteger panel:**
```js
onAuthStateChanged(auth, user => {
  if (user) {
    loginScreen.style.display = "none";
    adminPanel.style.display  = "block";
    cargarDashboard();
  } else {
    loginScreen.style.display = "flex";
    adminPanel.style.display  = "none";
  }
});
```

**Secciones del Super Admin:**
1. 📊 Dashboard KPIs: rifas activas / congeladas / vencidas, clientes por vencer
2. 🔑 Panel de licencias: cards con barra de tiempo, congelar/activar, extender, copiar links
3. ➕ Crear nueva rifa: formulario completo → genera rifaId automático
4. 📋 Ver números de cualquier rifa desde el panel
5. ⬇️ Exportar CSV de cualquier rifa

**Copiar links al portapapeles:**
```js
function copiarLink(rifaId)      { navigator.clipboard.writeText(`${location.origin}/r/${rifaId}`); mostrarToast("🔗 Link del talonario copiado"); }
function copiarLinkAdmin(rifaId) { navigator.clipboard.writeText(`${location.origin}/miadmin.html?id=${rifaId}`); mostrarToast("🔑 Link del admin cliente copiado"); }
```

**Exportar CSV:**
```js
function exportarCSV(rifaId, tipo="todo") {
  getDocs(collection(db,"rifas",rifaId,"numeros")).then(snap => {
    const filas = [["Número","Estado","Nombre","Teléfono","Tiempo"]];
    snap.forEach(d => {
      const data = d.data();
      if (data.estado === "libre") return;
      if (tipo !== "todo" && data.estado !== tipo) return;
      filas.push([d.id, data.estado, data.nombre, data.telefono,
        data.tiempo?.toDate?.()?.toLocaleString("es-CO") || ""]);
    });
    const blob = new Blob([filas.map(f=>f.join(",")).join("\n")],{type:"text/csv"});
    const a = Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:`${rifaId}-${tipo}.csv`});
    a.click();
  });
}
```

---

## 🔔 TOAST — Notificaciones (usar en toda la app)

```js
function mostrarToast(msg, tipo="success") {
  const colores = { success:"var(--status-activa)", error:"var(--status-vencida)", warning:"var(--status-por-vencer)", info:"var(--accent-primary)" };
  const t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:24px;right:16px;z-index:9999;
    background:var(--bg-elevated);color:var(--text-primary);
    border:1px solid ${colores[tipo]||colores.info};border-left-width:3px;
    border-radius:var(--radius-md);padding:13px 18px;
    font-size:13px;font-weight:500;font-family:'Inter',sans-serif;
    box-shadow:0 8px 32px rgba(0,0,0,0.5);max-width:300px;
    animation:fadeInUp 0.25s ease;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
```

---

## ⚙️ REGLAS CRÍTICAS — Nunca violar

1. **NUNCA** hardcodear el número de WhatsApp del admin — siempre de `rifaData.clienteWhatsApp`
2. **SIEMPRE** verificar licencia al cargar talonario público — si inválida, mostrar bloqueo
3. El botón WhatsApp aparece SOLO después de reserva exitosa en Firestore
4. Super Admin usa Firebase Auth; Cliente Admin usa contraseña vs `claveAdmin` en Firestore
5. El cliente admin solo puede editar su whitelist de campos — no puede cambiar estado ni licencia
6. Congelar una rifa bloquea el talonario público inmediatamente (onSnapshot en tiempo real)
7. Al vencer licencia: mismo comportamiento que congelada
8. Todos los archivos son HTML puro con `<script type="module">` — sin bundlers ni Node.js
9. Siempre mobile-first: el talonario se usa principalmente desde celular
10. El mensaje WhatsApp incluye siempre: rifa, número, nombre, teléfono, valor, lotería, fecha sorteo, instrucciones de pago

---

## 📁 ARCHIVOS DEL PROYECTO

```
RIFA-PRO-FONDOS/
├── public/
│   ├── index.html       → Talonario público
│   ├── admin.html       → Super Admin
│   └── miadmin.html     → Cliente Admin
├── firebase.json        → Config hosting Firebase
└── .gitignore
```

### firebase.json
```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json","**/.*","**/node_modules/**"],
    "rewrites": [
      { "source": "/r/**", "destination": "/index.html" },
      { "source": "**",    "destination": "/index.html" }
    ]
  }
}
```
