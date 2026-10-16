# Notas de diseño: landing W Meza.tec

Registro de criterios y decisiones para que la página sea atractiva y coherente.
Última actualización: 30/09/2026.

---

## 1. Qué hace que una página sea atractiva

Una página "linda" casi nunca es por un efecto puntual. Es la suma de **coherencia** (todo parece hecho por la misma mano) y **una sola cosa memorable**.

### Coherencia (el sistema)
Cada decisión visual se toma una vez y se repite en toda la página.

| Elemento | Regla | Por qué importa |
|---|---|---|
| **Redondeo** | Pocos valores y siempre los mismos: botones, tarjetas, campos. | Mezclar 4px, 6px, 10px y píldoras al azar es lo que hace que algo "se vea raro" aunque no se sepa por qué. |
| **Colores** | 1 color de marca (naranja/amarillo del logo), 1 de acción (verde WhatsApp), neutros (grises). Nada más. | Cuantos más colores, más barato se ve. El color de acción es solo para lo que se toca. |
| **Tipografía** | Una sola familia (Archivo), con 3 o 4 tamaños fijos. | Muchos tamaños parecidos = desorden. |
| **Espaciado** | Una escala fija (8, 16, 24, 32, 48, 64…). Mismo aire entre secciones. | El ojo detecta cuando un bloque está "apretado" y otro "suelto". |
| **Sombras** | Un solo estilo de sombra, usado en pocos lugares. | Sombras distintas en cada tarjeta = aspecto de plantilla. |
| **Íconos** | Mismo grosor de línea, mismo tamaño, mismo estilo. | Íconos de 3 packs distintos delatan improvisación. |

### Jerarquía (qué se mira primero)
- En cada pantalla tiene que haber **una** cosa principal. Si todo grita, nada se lee.
- El título más grande, el botón más visible, el resto en segundo plano.
- Contraste de tamaño fuerte (título enorme, texto normal) se ve más profesional que todo mediano.

### Aire (espacio en blanco)
- El espacio vacío no es desperdicio: es lo que hace que lo importante respire.
- Textos de máximo ~65 caracteres por línea.

### Lo humano (lo que la IA suele no tener)
- **Fotos reales** de la persona y de trabajos: es lo que más confianza genera en servicios técnicos. Ninguna ilustración o foto de stock lo reemplaza.
- **Lenguaje concreto** del oficio ("bornes flojos", "térmica que salta") en vez de frases genéricas ("soluciones integrales").
- **Detalles que solo alguien del rubro pondría** (el semáforo del informe, la cuenta de la hora parada).
- **Imperfección controlada**: la hoja del informe levemente girada, por ejemplo.

### Lo que hace que se vea "hecha por IA" (evitar)
- Etiquetas en MAYÚSCULAS espaciadas arriba de cada título.
- Una palabra del título en otro color.
- Grillas de tarjetas idénticas con degradés de adorno.
- Animaciones de entrada en todo, sin criterio.
- Frases vacías y promesas genéricas.
- Fotos de stock o ilustraciones 3D genéricas.

---

## 2. Sistema aplicado en la página

### Redondeo (unificado el 30/09/2026)
Se tomó como referencia el botón de WhatsApp del header (píldora), que gustó.

| Token | Valor | Dónde se usa |
|---|---|---|
| `--r-boton` | `999px` (píldora) | Todos los botones, links del menú, botón "Menú" |
| `--r-tarjeta` | `24px` | Tarjetas de servicios, pasos del diagnóstico, calculadora, hoja del informe, foto |
| `--r-campo` | `999px` (píldora) | Campos de la calculadora y display del resultado |
| círculo | `50%` | Íconos de servicios, botón flotante de WhatsApp |

### Colores (del logo)
| Token | Hex | Uso |
|---|---|---|
| `--carbon` | `#232323` | Fondo del header, hero y pie (mismo gris del logo) |
| `--oro` | `#FFC107` | Inicio del degradado de marca |
| `--naranja` | `#F9A01B` | Acentos, íconos, bordes superiores |
| `--naranja-osc` | `#E07B00` | Final del degradado |
| `--wsp` | `#25D366` | **Solo** botones de acción de WhatsApp |
| `--chapa` | `#E3E4DF` | Fondo del cuerpo |
| `--papel` | `#F7F7F3` | Tarjetas |

Provisorios hasta que Walter complete el cuestionario.

### Tipografía
Archivo (Google Fonts), una sola familia. Títulos en ancho condensado (`wdth` 70–85) y peso 800; cuerpo en ancho normal.

---

## 3. Qué falta para que sea realmente atractiva (propuestas por prioridad)

1. **Fotos reales** (lo que más suma). Walter con casco en la sección "Quién soy", y 3 a 6 fotos de tableros o trabajos (antes/después). Hoy hay un recuadro "pendiente". Pregunta 10 y 43 del cuestionario.
2. **Sección de trabajos con casos reales**: qué encontré → qué hice → resultado, con foto. Reemplaza cualquier testimonio inventado. Pregunta 33.
3. **Testimonios reales** (aunque sea sin nombre de empresa). Pregunta 44.
4. **Escala de espaciado estricta**: pasar todos los márgenes y paddings a tokens (`--e-1`… `--e-6`) como se hizo con el redondeo.
5. **Unificar sombras**: un solo token de sombra para calculadora, tarjetas en hover e informe.
6. **Fondo con textura sutil** en las secciones claras (por ejemplo, chapa o plano técnico muy tenue) para que no se vean planas.
7. **Una franja de confianza** debajo del hero, cuando haya datos: matrícula, ART, seguro, factura A. Preguntas 26 a 28.
8. **Mapa de zona de cobertura** simple (Mar del Plata y alrededores), cuando se confirme hasta dónde viaja. Pregunta 7.

---

## 4. Registro de cambios

| Fecha | Cambio |
|---|---|
| 30/09/2026 | Primera versión: hero con calculadora, servicios, diagnóstico, sectores, Walter, contacto. |
| 30/09/2026 | Header con menú fijo; animaciones al bajar y al tocar botones; contador de años. |
| 30/09/2026 | Servicios en tarjetas con íconos; logo vectorizado (carpeta `logo/`); paleta tomada del logo. |
| 30/09/2026 | Hero y servicios ajustados para entrar en una pantalla; tarjetas del mismo alto. |
| 30/09/2026 | Calculadora con ejemplos en gris (placeholder) y signo $ en montos. |
| 30/09/2026 | Redondeo unificado: botones píldora, tarjetas 16px, campos 10px. |
| 30/09/2026 | Números con rodillos tipo tragamonedas usando [NumberFlow](https://number-flow.barvian.me/) 0.5.12 (CDN jsDelivr) y su plugin `continuous`: resultado de la calculadora y contador de años (más grande). Si la librería no carga, se muestran los números normales. |
| 30/09/2026 | Todo redondeado: campos y resultado en píldora, tarjetas a 24px, pasos del diagnóstico como tarjetas. |
| 30/09/2026 | Botones sin borde: degradé a 135° y sombra a 45° hacia abajo a la derecha (`--sombra-boton`). |
| 30/09/2026 | Sombra más dura (5px 5px 5px). Resultado centrado con degradé y sombra; campos con degradé suave y sombra (`--sombra-campo`). |
| 30/09/2026 | Campos hundidos: sombra interior a 45° con brillo abajo a la derecha. |
| 30/09/2026 | Campos: color plano sin degradé, solo sombra interior; contorno naranja al tocar también hacia adentro. |
| 30/09/2026 | Encabezados de sección: título + barra naranja 9px + texto en un solo bloque; en Servicios, botón "¿No sabés cuál necesitás? Contame". |
| 30/09/2026 | Línea del header con degradé en ciclo horizontal (6 s); calculadora con franja superior igual a las tarjetas; anclas ajustadas al alto real del header. |
| 30/09/2026 | Animaciones al bajar se repiten cada vez que la sección vuelve a pantalla o se elige en el menú. Tarjetas de servicios se reparten como cartas (caen giradas, una tras otra, cada 95 ms). |
| 30/09/2026 | Sectores en tarjetas con ícono y franja naranja a la izquierda (3 columnas); se quitó "Cada rubro tiene su punto débil". |
| 30/09/2026 | Diagnóstico: título "Primero, un diagnóstico"; pasos con número grande sobre un cuarto de círculo naranja en la esquina, gap 20px, animación de cartas; informe del mismo ancho que las tres tarjetas. |
| 30/09/2026 | Cartas: entran derechas desde arriba (sin giro), 0,6 s cada una, 140 ms entre tarjetas. |
| 30/09/2026 | Cartas: se deslizan de izquierda a derecha desde la primera columna; cada una pasa por encima de la anterior (z-index creciente). |
| 30/09/2026 | Contacto: WhatsApp, Teléfono, Zona e Instagram con ícono en círculo; WhatsApp, teléfono e Instagram son links. |
| 30/09/2026 | Cartas más lentas (0,95 s, 170 ms entre cada una). Corregido el rebote: arrancan con 25 % visible y se reinician solo al salir del todo; sin hover mientras se reparten. |
| 30/09/2026 | Cartas entran desde fuera de la pantalla (izquierda) y cruzan por encima de las colocadas; evita la ilusión de que la primera "vuelve atrás". 1,1 s por carta. |
| 30/09/2026 | Rendimiento: header sin desenfoque de fondo; línea naranja animada con transform (sin repintar); will-change en las cartas mientras se reparten. |
| 30/09/2026 | Sectores: misma animación de cartas (izquierda a derecha). Diagnóstico: las cartas bajan desde el borde superior de la sección. |
| 30/09/2026 | Informe: título más grande; al terminar las cartas de los pasos, repasa cada hallazgo en orden (se enciende la fila y el punto late dos veces), uno por segundo. |
| 30/09/2026 | Contador de años y resultado de la calculadora se reinician al salir de pantalla y repiten el conteo al volver al inicio. |
| 30/09/2026 | Informe: título "Informe de diagnóstico" en su renglón, grande y en negrita; repaso en cadena (cada punto arranca cuando termina el anterior). |
| 30/09/2026 | Sombras en dos capas (cercana suave + larga difuminada): el degradé empieza cerca del objeto, sin borde duro. |
| 30/09/2026 | Celular (una columna): cada tarjeta aparece sola cuando llega a la pantalla al bajar. |
| 30/09/2026 | Arreglo: en una columna las cartas de Servicios y Sectores no aparecían (quedaban recortadas por la sección y el IntersectionObserver no las veía). Ahora se detectan por posición vertical al hacer scroll. Verificado con Chrome real a 504 y 1082 px. |
| 30/09/2026 | Publicada en GitHub Pages: https://ciroamalosexcels-byte.github.io/Wmezatec.com.ar/ (repo `ciroamalosexcels-byte/Wmezatec.com.ar`, rama `main`). Se subió la carpeta `logo/`, que faltaba. |
