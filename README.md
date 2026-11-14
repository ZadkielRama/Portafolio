# RAMIREZ.SYS — Portafolio Profesional

Portafolio web personal y profesional de **Adrián Ezequiel Ramírez** (Systems & AI Architect).

Este proyecto ha sido reestructurado siguiendo las mejores prácticas de la industria:
- **Separación estricta de responsabilidades**: HTML5 semántico, CSS modularizado y JavaScript encapsulado.
- **Seguridad y privacidad**: Protección anti-cosecha de correos (*anti-scraping* / *anti-spam*).
- **Rendimiento y experiencia visual**: Ilustraciones vectoriales dinámicas, diagramas de arquitectura en SVG de alta resolución, modo oscuro/claro y notificaciones flotantes modernas (*Toasts*).

---

## 📁 Estructura del Proyecto

```text
Portafolio/
├── index.html                      # Estructura semántica, accesible y limpia
├── css/
│   └── styles.css                  # Variables de diseño (tokens), temas, efectos de imágenes
├── js/
│   └── app.js                      # Lógica interactiva, módulo anti-spam y visor de diagramas
├── assets/
│   └── img/                        # Galería de imágenes y diagramas técnicos
│       ├── avatar.svg              # Avatar técnico de perfil (reemplazable por foto real)
│       ├── mockup-tiendarg.svg      # Vista previa interactiva de TiendArg POS & E-Commerce
│       ├── mockup-softwarg.svg      # Vista previa de SoftwArg (Agentes IA & Automatización)
│       ├── mockup-triviabiblica.svg # Vista previa de TriviaBíblica PWA (WebSockets & SignalR)
│       ├── mockup-enroque.svg       # Vista previa de Facturación Mayorista AFIP
│       ├── diagram-dotnet.svg      # Diagrama de Clean Architecture & CQRS (.NET 11)
│       ├── diagram-cloud.svg       # Diagrama de Cloud Serverless & CI/CD (AWS + Azure)
│       ├── diagram-data.svg        # Diagrama de Motores de Datos, GIS & Redis
│       └── diagram-web.svg         # Diagrama de Blazor WASM & SignalR Real-Time
└── README.md                       # Documentación del proyecto (en español)
```

---

## 🖼️ Personalización de Imágenes

### ¿Cómo colocar tu propia fotografía de perfil?
1. Guarda tu fotografía personal con el nombre `avatar.jpg` o `avatar.png` dentro de la carpeta `assets/img/`.
2. En [index.html](file:///c:/Users/eramirez/Downloads/Luana/Portafolio/index.html), busca la etiqueta:
   ```html
   <img src="assets/img/avatar.svg" alt="Adrián Ezequiel Ramírez" ... />
   ```
3. Cámbiala por:
   ```html
   <img src="assets/img/avatar.jpg" alt="Adrián Ezequiel Ramírez" ... />
   ```
El marco de diseño, el indicador verde de estado en vivo (`ONLINE`) y las sombras de acento se adaptarán automáticamente a tu foto.

---

## 🛡️ ¿Cómo funciona la Protección Anti-Spam del Correo?

### El problema habitual:
Cuando colocas tu correo en texto plano o en un enlace clásico (`href="mailto:tu-correo@dominio.com"`), los robots rastreadores de spam (*spambots* o *crawlers*) extraen la dirección y la agregan a listas de correo basura.

### Solución implementada:
1. **Cero texto plano en el HTML estático**:
   - En el archivo `index.html` original no existe el correo ni el protocolo `mailto:`.
2. **Ofuscación y ensamblado en tiempo de ejecución**:
   - El usuario y dominio se encuentran codificados en Base64 en memoria dentro de `js/app.js`.
3. **Acciones activadas por interacción humana**:
   - Al pulsar el botón **CONTACTO**, el cliente de correo se dispara de forma programática.
   - En el pie de página (*footer*) y en la **Paleta de Comandos** (`Ctrl + K`), se provee la opción de copiar la dirección al portapapeles con confirmación visual elegante (*Toast Notification*).

---

## 🚀 Buenas Prácticas Aplicadas

1. **Ilustraciones vectoriales dinámicas**:
   - Se crearon diagramas técnicos y mockups en formato SVG puro, lo que garantiza una nitidez total en pantallas 4K y móviles sin retrasos de carga ni imágenes borrosas.
2. **Diagramas interactivos en el visor de arquitectura**:
   - Al seleccionar cualquier capa (.NET, Cloud, Datos, Web), se actualiza dinámicamente el diagrama explicativo de la arquitectura correspondiente.
3. **Eliminación de código intrusivo**:
   - Cero atributos `onclick="..."` en línea. Todo se gestiona mediante eventos (`addEventListener`) en `js/app.js`.
4. **Paleta de Comandos Interactiva (`Ctrl + K`)**:
   - Búsqueda en tiempo real con filtrado instantáneo.
5. **Persistencia de Tema**:
   - Almacenamiento local en `localStorage` y detección automática del modo del sistema operativo (`prefers-color-scheme`).

---

## 💻 Visualización Local

Para ver el portafolio en tu navegador:
1. Haz doble clic en `index.html`, o
2. Ábrelo con cualquier servidor local (como la extensión Live Server de VS Code).
