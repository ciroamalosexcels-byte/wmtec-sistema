# Estado del proyecto: W Meza.tec

Cliente: Walter Martín Meza (@wmeza.tec), electromecánico industrial en Mar del Plata.
Agencia: Biomarketing.
Última actualización: 02/10/2026.

**Página publicada:** https://ciroamalosexcels-byte.github.io/Wmezatec.com.ar/ (GitHub Pages, provisoria hasta tener dominio).

---

## 1. Carpetas

```
Wmezatec/
├── 01_Auditoria/                  Auditoría del Instagram (puntaje 37/100)
├── 02_Plan_implementacion/        Plan de 30 días con textos listos (Paso 0 a 8)
├── 03_Cuestionario_cliente/       60 preguntas para Walter/Martín
├── 04_Propuesta_web/              Propuesta de landing + dominio (2 versiones de marca)
├── 05_Capturas_Instagram_2026-09-30/  Capturas del perfil y logo original
├── 06_Landing_web/                La página
│   ├── index.html                 Landing completa (un solo archivo)
│   ├── logo/                      Logo vectorizado (5 versiones SVG)
│   └── NOTAS_DISENO.md            Criterios de diseño y registro detallado de cambios
└── ESTADO_PROYECTO.md             Este archivo
```

---

## 2. Lo que está hecho

### Organización
- Archivos ordenados en carpetas numeradas; capturas de Instagram renombradas por contenido.

### Logo
- Vectorizado en SVG: W facetada amarilla/naranja con rayo, texto convertido a trazos (no depende de fuentes).
- Versiones: fondo oscuro, fondo claro, transparente, horizontal (header) e isotipo (favicon).

### Landing (`06_Landing_web/index.html`)
**Secciones**
1. **Header** fijo: logo, menú (Servicios, Diagnóstico, Sectores, Quién soy, Contacto), botón de WhatsApp; menú desplegable en celular; línea naranja con degradé en movimiento.
2. **Inicio**: titular, bajada, botones (diagnóstico por WhatsApp y llamar), contador "30 años en el rubro" y **calculadora de la hora parada** (ejemplos en gris, formato $ y miles al escribir, resultado con rodillos y botón para mandarle la cuenta a Walter).
3. **Lo que hago**: 6 tarjetas de servicios con íconos + botón "¿No sabés cuál necesitás? Contame".
4. **Diagnóstico**: 3 pasos con número grande sobre cuarto de círculo + ejemplo de informe con semáforo que se repasa ítem por ítem.
5. **En qué lugares trabajo**: 6 rubros en tarjetas con ícono.
6. **Quién soy**: cita de Walter + recuadro para la foto.
7. **Contacto**: WhatsApp, teléfono, zona e Instagram con íconos y links.

**Diseño**
- Paleta tomada del logo: gris carbón, amarillo/naranja con degradé, verde solo para WhatsApp.
- Tipografía Archivo (una sola familia).
- Redondeo coherente: botones y campos en píldora, tarjetas 24 px.
- Botones sin borde, con degradé y sombra a 45° en dos capas; campos hundidos con sombra interior.
- Criterios anti "página hecha por IA" documentados en `NOTAS_DISENO.md`.

**Animaciones**
- Números con rodillos (librería NumberFlow): contador 0→30 y monto $0→$280.000; ritmo parejo y frenado en el último tercio; se repiten al volver al inicio.
- Tarjetas que se reparten como cartas (izquierda a derecha; en Diagnóstico de arriba hacia abajo); se repiten al volver a la sección o al elegirla en el menú.
- En celular, cada tarjeta aparece sola al llegar a la pantalla.
- Botones que se hunden al apretarlos, con onda.
- Respeta "reducir movimiento" del sistema (salvo el conteo y la línea del header).

**Técnico**
- SEO básico: título, descripción, Open Graph, datos estructurados de electricista, favicon.
- Responsive: compu, tablet y celular.
- Arreglos verificados: rebote de tarjetas, rendimiento (header sin desenfoque), tarjetas que no aparecían en una columna (medido en Chrome real a 504, 742 y 1082 px).

### Publicación en GitHub Pages
- Repositorio: https://github.com/ciroamalosexcels-byte/Wmezatec.com.ar (público, rama `main`, cuenta `ciroamalosexcels-byte`).
- Contenido del repo: `index.html` (igual al de `06_Landing_web/`) y carpeta `logo/` con los 5 SVG. La carpeta `logo/` no estaba subida y hacía falta para el logo del header y el favicon.
- Pages activado desde `main`, carpeta raíz (`/`), con HTTPS. Primera publicación correcta: la página y el logo responden.
- Dirección provisoria: https://ciroamalosexcels-byte.github.io/Wmezatec.com.ar/
- **Para actualizar la página**: subir el `index.html` nuevo (y lo que cambie en `logo/`) al repo; GitHub la vuelve a publicar sola en 1 o 2 minutos. La carpeta local es un repositorio git privado (`wmtec-sistema`); la landing publicada es otro repositorio (`Wmezatec.com.ar`).

---

## 3. Lo que falta

### Depende del cuestionario (en el código están marcados `PENDIENTE P#`)
| Pregunta | Dato | Dónde impacta |
|---|---|---|
| P1 | Nombre: ¿Walter, Martín o Walter Martín Meza? | Header, textos, título de la página |
| P4 | Horarios de atención | Contacto |
| P6 | Urgencias: días, horarios y recargo | Inicio, tarjeta Urgencias |
| P7 | Zona real de trabajo | Contacto, SEO |
| P8 | Si la dirección de Pringles es local o domicilio | Mostrar u ocultar |
| P9 | Años (desde 1997 = 29, confirmado en LinkedIn) y rubros reales | Contador, bajada, sección Sectores |
| P10 | Foto de Walter con casco | Sección Quién soy, imagen para redes (og:image) |
| P16 | Plazo real de entrega del informe (hoy dice 48 h) | Paso 2 del diagnóstico |
| P26-P28 | Matrícula, ART, seguros, factura A | Franja de confianza (a crear) |
| P33 / P43 / P44 | Trabajos reales, fotos y testimonios | Sección de trabajos (a crear) |

### Contenido a sumar cuando haya material
- [ ] Foto real de Walter (reemplaza el recuadro "pendiente").
- [ ] Sección **Trabajos**: casos reales "qué encontré → qué hice → resultado" con fotos.
- [ ] **Testimonios** reales (aunque sea sin nombre de empresa).
- [ ] **Franja de confianza** debajo del inicio: matrícula, ART, seguro, factura A.
- [ ] Mapa o descripción de la zona de cobertura.

### Marca
- [ ] Definir el nombre de marca: WMEZATEC, WMSatec o W Meza.tec. Hay dos propuestas web en `04_Propuesta_web`; quedarse con una.
- [ ] Confirmar colores definitivos (los actuales son provisorios, tomados del logo).

### Publicación
- [x] Subir la página a internet (GitHub Pages, dirección provisoria; ver sección 2).
- [ ] Registrar el dominio (.com.ar o .ar) **a nombre de Walter** en NIC Argentina (sin pedirle la Clave Fiscal).
- [ ] Conectar el dominio: en el repo, Settings → Pages → Custom domain, y configurar los DNS del dominio apuntando a GitHub Pages (o pasar a Cloudflare Pages si se prefiere).
- [ ] Completar `og:url`, `canonical` y `og:image` con el dominio real.
- [ ] Alta en Google Search Console y ficha de Google Business Profile.
- [ ] Revisión final en celulares reales (Android e iPhone).

### Mejoras de diseño propuestas (opcionales)
- [ ] Pasar todos los espaciados a tokens (como se hizo con redondeos y sombras).
- [ ] Textura muy sutil en las secciones claras para que no se vean planas.
- [ ] Exportar el logo en PNG de alta resolución para Instagram y WhatsApp.

### Fuera de la web (del plan de implementación)
- Perfil de Instagram (nombre, bio, destacadas), WhatsApp Business, guiones de reels, prospección y medición: ver `02_Plan_implementacion`.

---

## 4. Branding y sistema de clientes (16/10/2026)

- **Logo definitivo:** ligadura WM (base L1) con "TEC" abajo. Archivos en `06_Landing_web/logo/` (`wmtec-logo-oscuro`, `wmtec-logo-claro`, `wmtec-isotipo`) y copia en `07_Branding_WMTEC/`. Ya está en la landing.
- **Sistema de clientes y diagnósticos:** `08_Sistema_Clientes/`. Se abre con doble clic en `iniciar.bat`; guarda solo en `datos/datos.json` (con copia diaria en `datos/copias/`). Incluye panel, calendario, embudo, cartera, diagnósticos, presupuestos (formato Biomarketing: 3 opciones, precio en efectivo, validez 15 días, pago 50/50), cobros y trabajos/mantenimiento. Trae 3 clientes de ejemplo, borrarlos desde cada ficha.
- **No subir `08_Sistema_Clientes/datos/` a GitHub** (datos de clientes; ya está en `.gitignore`).

- **Diseñador de tableros** (`08_Sistema_Clientes/tableros/`): editor de diagramas unifilares de código abierto (sldeditor, MIT) con símbolos de QElectroTech (CC BY 3.0), en español. Los diagramas se guardan por cliente desde la pestaña Tableros. Ver `tableros/THIRD_PARTY_NOTICES.md`.
- **Tarjeta:** rediseñada sobre la marca (`07_Branding_WMTEC/tarjeta.html` y `tarjeta-doble-faz.pdf`).
