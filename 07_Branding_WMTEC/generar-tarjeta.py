"""Genera la tarjeta personal WM TEC (90 x 50 mm) y la plancha A3 para imprimir doble faz.

Uso:  python generar-tarjeta.py
Crea tarjeta.html (una cara por pagina) y tarjeta-A3.html (frente y dorso, 20 tarjetas por hoja, con sangrado y marcas de corte).
Despues se exportan a PDF con Chrome (ver el final del archivo).
"""
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
SANGRADO = 36  # 3 mm en unidades del dibujo (12 unidades = 1 mm)
AMARILLO = "#FFB300"  # color plano para barras y lineas (sin degradado, para imprimir bien)

FONT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&display=swap" rel="stylesheet">'
ICONO = 'fill="none" stroke="#F9A01B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'


def frente(sangrado=True):
    b = SANGRADO if sangrado else 0
    vb = f"{-b} {-b} {1080 + 2 * b} {600 + 2 * b}"
    return f'''<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" aria-label="Tarjeta, frente">
  <defs>
    <g id="i-tel" {ICONO}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></g>
    <g id="i-ig" {ICONO}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="#F9A01B" stroke="none"/></g>
    <g id="i-mail" {ICONO}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></g>
    <g id="i-pin" {ICONO}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></g>
  </defs>
  <rect x="{-b}" y="{-b}" width="{1080 + 2 * b}" height="{600 + 2 * b}" fill="#232323"/>
  <image href="../06_Landing_web/logo/wmtec-isotipo.svg" x="560" y="290" width="640" height="328" opacity=".055"/>

  <image href="../06_Landing_web/logo/wmtec-logo-oscuro.svg" x="69" y="175" width="250" height="172"/>
  <text x="194" y="402" font-size="28" font-weight="500" fill="#cfd1c8" text-anchor="middle">Electromecánica industrial</text>
  <rect x="385" y="84" width="6" height="432" fill="#4a4a4a"/>

  <text class="t800" x="440" y="150" font-size="56" fill="#fff">Walter Martín Meza</text>
  <text x="440" y="198" font-size="31" font-weight="500" fill="#E3E4DF">Técnico Electromecánico</text>
  <rect x="440" y="222" width="112" height="12" rx="6" fill="{AMARILLO}"/>

  <use href="#i-tel" transform="translate(440,272) scale(1.7)"/>
  <text x="502" y="303" font-size="37" font-weight="500" fill="#fff">+549 223 5313019</text>
  <use href="#i-ig" transform="translate(440,342) scale(1.7)"/>
  <text x="502" y="373" font-size="37" font-weight="500" fill="#fff">@wmeza.tec</text>
  <use href="#i-mail" transform="translate(440,412) scale(1.7)"/>
  <text x="502" y="443" font-size="37" font-weight="500" fill="#fff">wmeza977@gmail.com</text>
  <use href="#i-pin" transform="translate(440,482) scale(1.7)"/>
  <text x="502" y="513" font-size="31" font-weight="500" fill="#E3E4DF">Mar del Plata y zona, Argentina</text>

  <rect x="{-b}" y="576" width="{1080 + 2 * b}" height="{24 + b}" fill="{AMARILLO}"/>
</svg>'''


def dorso(sangrado=True):
    b = SANGRADO if sangrado else 0
    vb = f"{-b} {-b} {1080 + 2 * b} {600 + 2 * b}"
    return f'''<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" aria-label="Tarjeta, dorso">
  <rect x="{-b}" y="{-b}" width="{1080 + 2 * b}" height="{600 + 2 * b}" fill="#232323"/>
  <image href="../06_Landing_web/logo/wmtec-logo-oscuro.svg" x="375" y="112" width="330" height="246"/>
  <text x="540" y="418" font-size="34" font-weight="500" fill="#cfd1c8" text-anchor="middle">Electromecánica industrial</text>
  <rect x="72" y="530" width="262" height="8" fill="{AMARILLO}"/>
  <rect x="746" y="530" width="262" height="8" fill="{AMARILLO}"/>
  <text x="540" y="548" font-size="38" font-weight="500" fill="#fff" text-anchor="middle">@wmeza.tec</text>
</svg>'''


ESTILO = '''*{box-sizing:border-box}html,body{margin:0}
text{font-family:"Archivo",system-ui,sans-serif}
.t800{font-weight:800;font-variation-settings:"wdth" 76;letter-spacing:-.01em}'''


def tarjeta_html():
    css = ESTILO + '''
@page{size:90mm 50mm;margin:0}
body{background:#bdbeb8}
.cara{width:90mm;height:50mm;margin:0 auto;display:block;overflow:hidden;break-after:page}
.cara svg{display:block;width:90mm;height:50mm}
@media screen{.cara{margin:16px auto;box-shadow:0 8px 30px rgba(0,0,0,.35);width:900px;height:500px}.cara svg{width:900px;height:500px}}'''
    return f'<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><title>Tarjeta WM TEC</title>{FONT}<style>{css}</style></head><body>\n<section class="cara">{frente(False)}</section>\n<section class="cara">{dorso(False)}</section>\n</body></html>'


def plancha_html():
    COLS, FILAS, W, Hh = 4, 5, 96, 56  # tarjeta con sangrado, en mm
    ML = (420 - COLS * W) / 2
    MT = (297 - FILAS * Hh) / 2
    css = ESTILO + f'''
@page{{size:420mm 297mm;margin:0}}
body{{background:#999}}
.hoja{{position:relative;width:420mm;height:297mm;background:#fff;overflow:hidden;break-after:page;margin:0 auto}}
.t{{position:absolute;width:{W}mm;height:{Hh}mm}}
.t svg{{display:block;width:{W}mm;height:{Hh}mm}}
.m{{position:absolute;background:#000}}
.nota{{position:absolute;left:{ML}mm;bottom:2.6mm;font:500 6pt "Archivo",Arial,sans-serif;color:#666}}
@media screen{{.hoja{{margin:12px auto;box-shadow:0 6px 24px rgba(0,0,0,.4);zoom:.45}}}}'''
    def hoja(svg, titulo):
        h = ['<section class="hoja">']
        for r in range(FILAS):
            for c in range(COLS):
                h.append(f'<div class="t" style="left:{ML + c * W}mm;top:{MT + r * Hh}mm">{svg}</div>')
        # marcas de corte: en la linea de corte de cada tarjeta (3 mm adentro del sangrado)
        xs = sorted({ML + c * W + 3 for c in range(COLS)} | {ML + c * W + 93 for c in range(COLS)})
        ys = sorted({MT + r * Hh + 3 for r in range(FILAS)} | {MT + r * Hh + 53 for r in range(FILAS)})
        for x in xs:
            h.append(f'<div class="m" style="left:{x - .1}mm;width:.2mm;top:2mm;height:4mm"></div><div class="m" style="left:{x - .1}mm;width:.2mm;top:{297 - 6}mm;height:4mm"></div>')
        for y in ys:
            h.append(f'<div class="m" style="top:{y - .1}mm;height:.2mm;left:2mm;width:{ML - 4}mm"></div><div class="m" style="top:{y - .1}mm;height:.2mm;left:{420 - ML + 2}mm;width:{ML - 4}mm"></div>')
        h.append(f'<div class="nota">{titulo}</div></section>')
        return "\n".join(h)
    cuerpo = hoja(frente(True), "WM TEC · tarjeta 90 x 50 mm con sangrado de 3 mm · hoja 1: FRENTE") + "\n" + \
        hoja(dorso(True), "WM TEC · tarjeta 90 x 50 mm con sangrado de 3 mm · hoja 2: DORSO (imprimir a doble faz, volteando por el borde corto)")
    return f'<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><title>Plancha A3 tarjetas WM TEC</title>{FONT}<style>{css}</style></head><body>\n{cuerpo}\n</body></html>'


if __name__ == "__main__":
    open(os.path.join(AQUI, "tarjeta.html"), "w", encoding="utf-8").write(tarjeta_html())
    open(os.path.join(AQUI, "tarjeta-A3.html"), "w", encoding="utf-8").write(plancha_html())
    print("ok")

# Exportar a PDF (desde esta carpeta, con Chrome):
#   chrome --headless=new --allow-file-access-from-files --virtual-time-budget=5000 --no-pdf-header-footer --print-to-pdf=tarjeta-doble-faz.pdf tarjeta.html
#   chrome --headless=new --allow-file-access-from-files --virtual-time-budget=5000 --no-pdf-header-footer --print-to-pdf=tarjeta-A3-imprenta.pdf tarjeta-A3.html
