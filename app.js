import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4auC2caQVgCXvRnCMabDr2k8WVvCTzBw",
  authDomain: "rifas-online-d0bae.firebaseapp.com",
  projectId: "rifas-online-d0bae",
  storageBucket: "rifas-online-d0bae.firebasestorage.app",
  messagingSenderId: "905341315838",
  appId: "1:905341315838:web:6b2d6321af6797643f93af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contenedor = document.getElementById("numeros");

// 💰 Nequi
const numerosNequi = [
  "3208871253",
  "3114571322"
];

// ==============================
// 💳 MOSTRAR PAGO
// ==============================
function mostrarPago(numero) {

  alert(
    "💰 PAGO NEQUI\n\n" +
    "Número elegido: " + numero + "\n\n" +
    "📱 Puedes pagar a cualquiera de estos números:\n\n" +
    "1. " + numerosNequi[0] + "\n" +
    "2. " + numerosNequi[1] + "\n\n" +
    "📸 Envía comprobante por WhatsApp"
  );

}

// ==============================
// 🎨 CREAR RIFA
// ==============================
async function crearRifa() {

  for (let i = 0; i < 100; i++) {

    const numero = i.toString().padStart(2, "0");

    const div = document.createElement("div");
    div.innerText = numero;

    div.style.display = "inline-block";
    div.style.margin = "5px";
    div.style.padding = "10px";
    div.style.border = "1px solid black";
    div.style.cursor = "pointer";
    div.style.textAlign = "center";

    const ref = doc(db, "rifa", numero);
    const snap = await getDoc(ref);

    // ==============================
    // 🎨 COLORES (FINAL)
    // ==============================

    if (snap.exists()) {

  const estado = snap.data().estado;

  if (estado === "reservado") {
    div.style.background = "yellow";
    div.style.color = "black";
  } 
  else if (estado === "pagado") {
    div.style.background = "red";
    div.style.color = "white";
  } 
  else {
    div.style.background = "gray";
    div.style.color = "white";
  }

} else {
  // 🟢 disponible
  div.style.background = "green";
  div.style.color = "white";
}

    // ==============================
    // 🖱 CLICK
    // ==============================

    div.onclick = async () => {

      const snap2 = await getDoc(ref);

      if (snap2.exists()) {
        alert("❌ Número no disponible");
        return;
      }

      // 🟡 RESERVA
      await setDoc(ref, {
        estado: "reservado",
        tiempo: Date.now()
      });

      div.style.background = "yellow";

      // 💰 MOSTRAR PAGO
      mostrarPago(numero);
    };

    contenedor.appendChild(div);
  }
}

crearRifa();