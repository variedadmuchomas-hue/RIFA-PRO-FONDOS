# RIFA PRO FONDOS — Paquete limpio, listo para subir a GitHub

## Cómo subirlo
Reemplaza en tu repo `RIFA-PRO-FONDOS` estos archivos por los de esta carpeta y haz commit + push. GitHub Pages se actualiza solo en 1-2 minutos.

## El bug del flyer (404) — encontrado y corregido

**Causa exacta:** tu sitio vive en una subcarpeta de GitHub Pages (`.../RIFA-PRO-FONDOS/`), pero varias funciones armaban el link usando `location.origin`, que solo da el dominio (`https://variedadmuchomas-hue.github.io`) **sin** esa subcarpeta. Dos de ellas además usaban una ruta tipo `/r/<id>`, que solo funciona en Firebase Hosting (gracias a una regla de reescritura en `firebase.json`) — pero como tu sitio real está en GitHub Pages, esa ruta nunca existió como archivo real → 404 seguro, tanto en el link para compartir como en el QR del flyer.

**Encontré 6 lugares con este problema** (3 en `miadmin.html`, incluida la función del flyer, y 5 en `admin.html` con la URL escrita a mano). Los reemplacé todos por una sola función (`obtenerBaseURL()`) que arma el link dinámicamente según dónde esté la página en ese momento — funciona igual en GitHub Pages, Firebase, o si algún día cambias de dominio/nombre de repo, sin tener que tocar el código de nuevo.

## Sobre el rango de números 0-1000 con el formato correcto

Buenas noticias: **esto ya estaba bien implementado** en `admin.html` (función `calcularDigitosInicio`) e `index.html`, y los revisé a fondo — respetan exactamente la regla que pediste:
- 100 números exactos → `00` a `99`
- 1000 números exactos → `000` a `999`
- Cualquier otra cantidad ≤99 → 2 dígitos, empieza en `01`
- Cualquier otra cantidad ≤999 → 3 dígitos, empieza en `001`
- Cantidad >999 (hasta 9999) → 4 dígitos, empieza en `0001`

No necesitó cambios — ya lo tenías resuelto.

## Qué más revisé (y quedó limpio)
- Sintaxis de JavaScript en los 3 archivos (`index.html`, `admin.html`, `miadmin.html`) — validado con un parser, sin errores.
- IDs duplicados en el HTML — ninguno.
- Botones que llamen a funciones inexistentes — ninguno.
- Funciones JavaScript duplicadas que se pisen entre sí — ninguna (encontré una que parecía duplicada, `cambiarSeccion`, pero es un patrón intencional de "envoltura" bien hecho, no un bug).

## Qué quité
- **`app.js`** — era código viejo (generaba siempre exactamente 100 números, sin la lógica de rango configurable). Ningún archivo HTML lo estaba llamando — quedaba huérfano en el repo. Ya no está en este paquete.

## Nota sobre `firebase.json` / `.firebaserc`
Los dejé en el paquete por si algún día quieres desplegar también en Firebase Hosting (tu proyecto de Firebase ya existe, `rifas-online-d0bae`), pero **GitHub Pages no los usa para nada** — no afectan tu sitio actual. Si nunca vas a usar Firebase Hosting, los puedes borrar sin problema.

## Formato del paquete
Te lo entrego en `.zip` en lugar de `.rar` — mi entorno no puede generar archivos `.rar`. Windows lo abre nativo sin instalar nada (clic derecho → Extraer todo).
