/* Diseñador del frente de un tablero: caja, rieles DIN, dispositivos a escala, cableado y simulación.
   Un módulo DIN = 18 mm. Uso: Frente.montar(elemento, tablero, alCambiar). */
(function () {
  "use strict";
  const M = 18, H = 88, PASO = 132, MX = 26, MY = 30, TOP = 74, LW = 48, LH = 56, GAP = 34, ISC = 3000;
  const CLS = { termo: "prot", difer: "prot", general: "prot", fusible: "prot", guardamotor: "prot", contactor: "sw", rele: "sw", temporizador: "sw", horario: "sw", relewifi: "sw", voltimetro: "tap", amperimetro: "med", medidor1: "med", medidor3: "med", bornera: "junc", barraN: "junc", barraT: "junc", dps: "tap", monitor: "tap", piloto: "tap", fuente: "carga", reserva: "none", acometida: "src" };

  /* ---------- Dibujos (vista frontal, en mm). v = estado en la simulación ---------- */
  const t = (x, y, s, txt, o) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" font-family="Archivo,Arial,sans-serif" ${o || 'fill="#222"'}>${txt}</text>`;
  const cuerpo = (w, base) => `<rect x=".4" y="0" width="${w - .8}" height="${H}" rx="2.6" fill="${base || "#f3f3ef"}" stroke="#7d7f78" stroke-width=".8"/>` +
    `<rect x=".4" y="0" width="${w - .8}" height="11" rx="2.6" fill="#dbdcd6" stroke="#7d7f78" stroke-width=".8"/><rect x=".4" y="${H - 11}" width="${w - .8}" height="11" rx="2.6" fill="#dbdcd6" stroke="#7d7f78" stroke-width=".8"/>`;
  const palancas = (w, y, h, n, e) => {
    const ph = h * .5, py = e === "off" ? y + h - 3 - ph : e === "trip" ? y + (h - ph) / 2 : y + 3;
    let s = `<rect x="3.4" y="${y}" width="${w - 6.8}" height="${h}" rx="2" fill="#2a2a2a"/>`;
    for (let i = 0; i < n; i++) s += `<rect x="${i * M + 5}" y="${py}" width="8" height="${ph}" rx="1.4" fill="${e === "trip" ? "#c23b2c" : "#4d4d4d"}" stroke="#0f0f0f" stroke-width=".5"/><rect x="${i * M + 6.6}" y="${py + 2}" width="4.8" height="1.2" fill="#d8d8d8"/>`;
    return s;
  };
  const lcd = (w, y, h, txt, fg, sub) => `<rect x="3" y="${y}" width="${w - 6}" height="${h}" rx="1.6" fill="#101a14" stroke="#4a4a4a" stroke-width=".6"/>` + t(w / 2 - (sub ? 3 : 0), y + h * .7, h * .5, txt, `fill="${fg}" font-family="Consolas,monospace" font-weight="700"`) + (sub ? t(w - 6, y + h * .7, h * .28, sub, `fill="${fg}"`) : "");
  const led = (x, y, v, col) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${v && v.sim ? (v.on ? col : "#6b6d66") : col}"/>`;
  const D = {
    termo: (w, p, v) => cuerpo(w) + t(w / 2, 8, 5.4, `${p.curva}${p.amp}`, 'fill="#222" font-weight="700"') + palancas(w, 24, 36, w / M, v.e) + t(w / 2, 72, 4.4, `${p.amp} A`, 'fill="#55574f"'),
    difer: (w, p, v) => cuerpo(w) + t(w / 2, 8, 5, `ID ${p.amp}A`, 'fill="#222" font-weight="700"') + palancas(w, 22, 28, w / M, v.e) +
      `<rect x="${w - 14}" y="55" width="10" height="9" rx="1.6" fill="#2563eb" stroke="#173a8a" stroke-width=".5"/>` + t(w - 9, 61.6, 5, "T", 'fill="#fff" font-weight="700"') + t(w / 2 - 3, 62, 4.4, `${p.sens} mA`, 'fill="#55574f"'),
    general: (w, p, v) => { const y = v.e === "off" ? 38 : v.e === "trip" ? 32 : 26; return cuerpo(w, "#eeeee9") + t(w / 2, 8, 5.4, `${p.amp} A`, 'fill="#222" font-weight="700"') + `<rect x="3.4" y="22" width="${w - 6.8}" height="42" rx="2" fill="#2a2a2a"/><rect x="${w / 2 - 6}" y="${y}" width="12" height="20" rx="1.6" fill="${v.e === "off" ? "#555" : v.e === "trip" ? "#e08a00" : "#c23b2c"}" stroke="#0f0f0f" stroke-width=".5"/>` + t(w / 2, 60, 4.5, "I  -  O", 'fill="#e6e6e0"') + t(w / 2, 74, 4.4, "General", 'fill="#55574f"'); },
    dps: (w, p, v) => cuerpo(w) + t(w / 2, 8, 5, "DPS", 'fill="#222" font-weight="700"') + `<rect x="4" y="30" width="${w - 8}" height="18" rx="2" fill="#2f8a4c"/>` + t(w / 2, 42, 6, "OK", 'fill="#fff" font-weight="700"') + t(w / 2, 66, 4.4, "Tipo 2", 'fill="#55574f"'),
    guardamotor: (w, p, v) => cuerpo(w) + t(w / 2, 8, 5, "GM", 'fill="#222" font-weight="700"') + `<circle cx="${w / 2}" cy="36" r="12" fill="#222" stroke="#666" stroke-width="1"/><line x1="${w / 2}" y1="36" x2="${w / 2 + 6}" y2="29" stroke="#fff" stroke-width="1.6"/>` +
      `<rect x="${w / 2 - 15}" y="54" width="13" height="10" rx="1.6" fill="${v.e === "on" || !v.sim ? "#2f8a4c" : "#3f6b4f"}"/><rect x="${w / 2 + 2}" y="54" width="13" height="10" rx="1.6" fill="${v.e === "on" || !v.sim ? "#8c3a32" : "#c23b2c"}"/>` + t(w / 2 - 8.5, 61.5, 5, "I", 'fill="#fff" font-weight="700"') + t(w / 2 + 8.5, 61.5, 5, "O", 'fill="#fff" font-weight="700"') + t(w / 2, 76, 4.4, `${p.rango || ""} A`, 'fill="#55574f"'),
    fusible: (w, p, v) => cuerpo(w) + `<rect x="3.4" y="24" width="${w - 6.8}" height="38" rx="2" fill="${v.e === "trip" ? "#f3d3cf" : "#e6e6df"}" stroke="#9a9b95" stroke-width=".6"/><rect x="${w / 2 - 2}" y="28" width="4" height="${v.e === "trip" ? 12 : 30}" rx="1.4" fill="${v.e === "trip" ? "#c23b2c" : "#b7b8b2"}"/>` + t(w / 2, 8, 5, `${p.amp} A`, 'fill="#222" font-weight="700"') + t(w / 2, 74, 4.2, v.e === "trip" ? "Fundido" : "Fusible", 'fill="#55574f"'),
    voltimetro: (w, p, v) => cuerpo(w, "#ececE8") + lcd(w, 22, 28, v.txt != null ? v.txt : "230", "#7CFF9B", "V") + `<circle cx="${w / 3}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><circle cx="${w * .66}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>` + t(w / 2, 8, 5, "Voltímetro", 'fill="#222" font-weight="700"'),
    amperimetro: (w, p, v) => cuerpo(w, "#ececE8") + lcd(w, 22, 28, v.txt != null ? v.txt : "16.4", "#ffb84d", "A") + `<circle cx="${w / 3}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><circle cx="${w * .66}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>` + t(w / 2, 8, 5, "Amperímetro", 'fill="#222" font-weight="700"'),
    medidor1: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 8, 5, "Medidor 1~", 'fill="#222" font-weight="700"') + `<rect x="6" y="18" width="${w - 12}" height="22" rx="1.6" fill="#cbd9c4" stroke="#777" stroke-width=".6"/>` + t(w / 2, 32, 8, v.txt != null ? v.txt : "0012345.6", 'fill="#1d2b1d" font-family="Consolas,monospace" font-weight="700"') + t(w - 12, 38, 4, v.sub || "kWh", 'fill="#1d2b1d"') +
      t(w / 2, 52, 4.6, "230 V  ~  50 Hz", 'fill="#55574f"') + `<circle cx="${w - 8}" cy="46" r="1.8" fill="${v.on ? "#e11d1d" : "#8c3a32"}"/><rect x="${w / 2 - 16}" y="62" width="14" height="8" rx="1.4" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><rect x="${w / 2 + 2}" y="62" width="14" height="8" rx="1.4" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>`,
    medidor3: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 8, 5, "Medidor 3~", 'fill="#222" font-weight="700"') + `<rect x="6" y="18" width="${w - 12}" height="22" rx="1.6" fill="#cbd9c4" stroke="#777" stroke-width=".6"/>` + t(w / 2, 32, 9, v.txt != null ? v.txt : "0012345.6", 'fill="#1d2b1d" font-family="Consolas,monospace" font-weight="700"') + t(w - 12, 38, 4, v.sub || "kWh", 'fill="#1d2b1d"') +
      t(w / 2, 52, 4.6, "3 x 230/400 V", 'fill="#55574f"') + ["L1", "L2", "L3"].map((x, i) => `<circle cx="${w / 2 - 14 + i * 14}" cy="60" r="1.8" fill="${v.sim && !v.on ? "#6b6d66" : "#2fe06b"}"/>` + t(w / 2 - 14 + i * 14, 67, 3.6, x, 'fill="#55574f"')).join("") + `<rect x="${w / 2 - 16}" y="70" width="14" height="6" rx="1.2" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><rect x="${w / 2 + 2}" y="70" width="14" height="6" rx="1.2" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>`,
    rele: (w, p, v) => cuerpo(w, "#e8edf5") + led(w / 2, 20, v, "#2fe06b") + `<rect x="3.6" y="28" width="${w - 7.2}" height="24" rx="1.6" fill="#2e5aac" stroke="#1b3a74" stroke-width=".6"/>` + t(w / 2, 43, 4.2, "RELÉ", 'fill="#fff" font-weight="700"') + t(w / 2, 62, 3.8, "A1  A2", 'fill="#55574f"') + t(w / 2, 70, 3.8, p.bobina, 'fill="#55574f"'),
    contactor: (w, p, v) => cuerpo(w, "#d9dad5") + t(w / 2, 8, 4.8, `${p.polos}P ${p.amp}A`, 'fill="#222" font-weight="700"') + `<rect x="${w / 2 - 8}" y="${v.e === "off" ? 33 : 28}" width="16" height="14" rx="1.8" fill="${v.e === "off" ? "#7a7a7a" : "#3a3a3a"}" stroke="#111" stroke-width=".5"/>` + t(w / 2, 52, 4, "A1   A2", 'fill="#222"') + t(w / 2, 62, 3.8, p.bobina, 'fill="#55574f"') + t(w / 2, 74, 4.2, "Contactor", 'fill="#55574f"') + led(w - 6, 18, v, "#2fe06b"),
    temporizador: (w, p, v) => cuerpo(w, "#f1f1ed") + `<circle cx="${w / 2}" cy="38" r="11" fill="#fafaf7" stroke="#333" stroke-width="1"/>` + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${w / 2 + 8.4 * Math.sin(a)}" y1="${38 - 8.4 * Math.cos(a)}" x2="${w / 2 + 10 * Math.sin(a)}" y2="${38 - 10 * Math.cos(a)}" stroke="#333" stroke-width=".6"/>` }).join("") +
      `<line x1="${w / 2}" y1="38" x2="${w / 2 + 6}" y2="33" stroke="#c23b2c" stroke-width="1.4"/>` + led(w - 8, 18, v, "#f59e0b") + t(w / 2, 8, 4.6, "Temporizador", 'fill="#222" font-weight="700"') + t(w / 2, 62, 4.2, "0 - 10 min", 'fill="#55574f"'),
    horario: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 8, 4.8, "Horario", 'fill="#222" font-weight="700"') + lcd(w, 17, 17, "12:30", "#7CFF9B") + `<circle cx="${w / 2}" cy="52" r="9" fill="#fafaf7" stroke="#333" stroke-width="1"/><line x1="${w / 2}" y1="52" x2="${w / 2}" y2="45" stroke="#333" stroke-width="1.2"/><line x1="${w / 2}" y1="52" x2="${w / 2 + 5}" y2="55" stroke="#c23b2c" stroke-width="1.2"/>` + t(w / 2, 74, 4.2, "Prog. diario", 'fill="#55574f"'),
    relewifi: (w, p, v) => cuerpo(w, "#fbfbf9") + led(w / 2, 20, v, "#3b82f6") + [14, 9, 4].map(r => `<path d="M ${w / 2 - r} ${44} A ${r} ${r} 0 0 1 ${w / 2 + r} ${44}" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>`).join("") + `<circle cx="${w / 2}" cy="47" r="1.8" fill="#2563eb"/>` + t(w / 2, 8, 4.8, "Relé WiFi", 'fill="#222" font-weight="700"') + t(w / 2, 64, 4.2, "1 canal · 16 A", 'fill="#55574f"'),
    fuente: (w, p, v) => cuerpo(w, "#dfe0db") + [18, 22, 26, 30].map(y => `<line x1="8" y1="${y}" x2="${w - 8}" y2="${y}" stroke="#9a9b95" stroke-width="1"/>`).join("") + t(w / 2, 8, 5, "Fuente", 'fill="#222" font-weight="700"') + t(w / 2, 48, 8, p.salida, 'fill="#222" font-weight="700"') + led(w - 9, 58, v, "#2fe06b") + t(w / 2, 74, 4.2, "Salida DC", 'fill="#55574f"'),
    monitor: (w, p, v) => cuerpo(w, "#e8edf2") + t(w / 2, 8, 4.4, "Falta de fase", 'fill="#222" font-weight="700"') + ["L1", "L2", "L3"].map((x, i) => led(w / 2 - 10 + i * 10, 30, v, "#2fe06b") + t(w / 2 - 10 + i * 10, 40, 3.8, x, 'fill="#55574f"')).join("") + `<rect x="5" y="50" width="${w - 10}" height="12" rx="1.6" fill="#c9cbc5"/>` + t(w / 2, 72, 4.2, "Monitor", 'fill="#55574f"'),
    piloto: (w, p, v) => { const c = ({ rojo: "#d6342a", verde: "#2fb15a", "ámbar": "#f0a30a", azul: "#2563eb", blanco: "#f4f4f4" })[p.color] || "#d6342a"; return cuerpo(w) + `<circle cx="${w / 2}" cy="40" r="7.4" fill="${v.sim && !v.on ? "#5c5d58" : c}" stroke="#222" stroke-width="1"/>` + (v.sim && v.on ? `<circle cx="${w / 2}" cy="40" r="11" fill="${c}" opacity=".3"/>` : "") + `<circle cx="${w / 2 - 2.4}" cy="37.4" r="2" fill="#fff" opacity=".55"/>` + t(w / 2, 8, 4.4, "Piloto", 'fill="#222" font-weight="700"'); },
    bornera: (w) => { const n = Math.round(w / 9); let s = ""; for (let i = 0; i < n; i++) s += `<rect x="${i * 9 + .5}" y="18" width="8" height="54" rx="1.2" fill="#c9cbc5" stroke="#7d7f78" stroke-width=".6"/><circle cx="${i * 9 + 4.5}" cy="28" r="2.4" fill="#8d8f88"/><line x1="${i * 9 + 3}" y1="28" x2="${i * 9 + 6}" y2="28" stroke="#444" stroke-width=".7"/><rect x="${i * 9 + 2}" y="42" width="5" height="9" rx="1" fill="#6b6d66"/><circle cx="${i * 9 + 4.5}" cy="62" r="2.4" fill="#8d8f88"/>`; return s },
    barraN: (w) => `<rect x=".4" y="26" width="${w - .8}" height="36" rx="2" fill="#3b7fc4" stroke="#215c96" stroke-width=".8"/>` + Array.from({ length: Math.round(w / 6) }, (_, i) => `<circle cx="${3 + i * 6}" cy="38" r="1.9" fill="#173f6b"/><circle cx="${3 + i * 6}" cy="52" r="1.9" fill="#173f6b"/>`).join("") + t(w / 2, 72, 5, "N", 'fill="#215c96" font-weight="700"'),
    barraT: (w) => `<rect x=".4" y="26" width="${w - .8}" height="36" rx="2" fill="#2f8a4c" stroke="#1d5f33" stroke-width=".8"/>` + Array.from({ length: Math.round(w / 8) }, (_, i) => `<rect x="${i * 8 + 1}" y="26" width="4" height="36" fill="#f0c419" opacity=".9"/>`).join("") + Array.from({ length: Math.round(w / 6) }, (_, i) => `<circle cx="${3 + i * 6}" cy="44" r="1.9" fill="#1d3b27"/>`).join("") + t(w / 2, 72, 5, "PE", 'fill="#1d5f33" font-weight="700"'),
    reserva: (w) => `<rect x="1" y="6" width="${w - 2}" height="${H - 12}" rx="2.4" fill="none" stroke="#9a9b95" stroke-width="1" stroke-dasharray="3 2.4"/>` + t(w / 2, 48, 5, "libre", 'fill="#9a9b95"')
  };

  /* Cargas (fuera del tablero) y acometida */
  const LOAD = {
    lampara: { n: "Iluminación", w: 300, cos: 1 }, toma: { n: "Tomacorrientes", w: 2200, cos: 1 }, aire: { n: "Aire acondicionado", w: 1500, cos: .85 },
    heladera: { n: "Heladera", w: 300, cos: .8 }, calefactor: { n: "Estufa / termotanque", w: 2000, cos: 1 }, motor1: { n: "Motor monofásico", w: 1100, cos: .8 },
    motor3: { n: "Motor trifásico", w: 3000, cos: .85, tri: 1 }, bomba: { n: "Bomba de agua", w: 750, cos: .8 }
  };
  function motor(v, txt) {
    return `<rect x="4" y="11" width="24" height="20" rx="4" fill="#4a6fa5" stroke="#274a7a" stroke-width="1"/>` + [9, 13, 17, 21].map(x => `<line x1="${x}" y1="11" x2="${x}" y2="31" stroke="#274a7a" stroke-width=".9"/>`).join("") + `<rect x="28" y="18" width="8" height="6" fill="#b7b8b2" stroke="#7d7f78" stroke-width=".6"/>` + t(16, 24.5, 6.4, txt, 'fill="#fff" font-weight="700"') + (v.on ? `<g class="fr-giro" style="transform-origin:34px 21px"><line x1="34" y1="14" x2="34" y2="28" stroke="#555" stroke-width="1.2"/><line x1="27" y1="21" x2="41" y2="21" stroke="#555" stroke-width="1.2"/></g>` : "");
  }
  const icono = {
    lampara: v => `<circle cx="20" cy="17" r="11" fill="${v.on ? "#ffe27a" : "#ececE8"}" stroke="#7d7f78" stroke-width="1"/><rect x="15" y="28" width="10" height="8" rx="1.5" fill="#9a9b95"/><path d="M15 19 l3 -5 l2 5 l2 -5 l3 5" fill="none" stroke="#a36a00" stroke-width="1"/>` + (v.on ? [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="${20 + 14 * Math.cos(a * Math.PI / 180)}" y1="${17 + 14 * Math.sin(a * Math.PI / 180)}" x2="${20 + 18 * Math.cos(a * Math.PI / 180)}" y2="${17 + 18 * Math.sin(a * Math.PI / 180)}" stroke="#f5b400" stroke-width="1.4"/>`).join("") : ""),
    toma: v => `<rect x="6" y="3" width="28" height="30" rx="4" fill="#f6f6f2" stroke="#7d7f78" stroke-width="1"/><rect x="13" y="10" width="3" height="9" fill="#333"/><rect x="24" y="10" width="3" height="9" fill="#333"/><rect x="18.5" y="23" width="3" height="5" fill="#333"/><circle cx="31" cy="7" r="1.5" fill="${v.on ? "#2fe06b" : "#9a9b95"}"/>`,
    aire: v => `<rect x="2" y="6" width="36" height="16" rx="4" fill="#f1f1ee" stroke="#7d7f78" stroke-width="1"/><line x1="6" y1="17" x2="34" y2="17" stroke="#9a9b95" stroke-width="1"/><circle cx="32" cy="11" r="1.4" fill="${v.on ? "#2fe06b" : "#9a9b95"}"/>` + (v.on ? `<path d="M8 26 q4 4 0 8 M16 26 q4 4 0 8 M24 26 q4 4 0 8 M32 26 q4 4 0 8" fill="none" stroke="#3b82f6" stroke-width="1.4" class="fr-aire"/>` : ""),
    heladera: v => `<rect x="10" y="2" width="20" height="34" rx="3" fill="#e8eef2" stroke="#7d7f78" stroke-width="1"/><line x1="10" y1="14" x2="30" y2="14" stroke="#7d7f78" stroke-width=".8"/><rect x="26" y="6" width="2" height="5" fill="#7d7f78"/><rect x="26" y="18" width="2" height="9" fill="#7d7f78"/>` + (v.on ? `<circle cx="14" cy="8" r="1.4" fill="#2fe06b"/>` : ""),
    calefactor: v => `<rect x="7" y="5" width="26" height="28" rx="3" fill="#d6d6d2" stroke="#7d7f78" stroke-width="1"/>` + [11, 18, 25].map(y => `<path d="M11 ${y} q3 -3 6 0 t6 0 t6 0" fill="none" stroke="${v.on ? "#e11d1d" : "#8d8f88"}" stroke-width="1.6"/>`).join(""),
    motor1: v => motor(v, "M"), motor3: v => motor(v, "M 3~"),
    bomba: v => `<circle cx="16" cy="20" r="10" fill="#4a79b5" stroke="#274a7a" stroke-width="1"/><circle cx="16" cy="20" r="4" fill="#cfe0f4"/><rect x="24" y="16" width="14" height="8" fill="#9bb6d6" stroke="#274a7a" stroke-width=".8"/><path d="M28 20 h7 m-2 -2 l2 2 l-2 2" fill="none" stroke="#1e3a5f" stroke-width="1.1"/>`
  };
  const dibujarCarga = (o, v) => {
    const d = LOAD[o.k], w = +o.p.w || d.w;
    let s = `<g transform="translate(4,0)">${icono[o.k](v)}</g>`;
    if (v.f === "cc") s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="none" stroke="#e11d1d" stroke-width="2" class="fr-alarma"/><polygon points="22,-6 14,16 22,16 18,36 34,10 25,10 30,-6" fill="#ffd400" stroke="#e11d1d" stroke-width="1" class="fr-chispa"/>`;
    else if (v.f === "sobre") s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="none" stroke="#f59e0b" stroke-width="2" class="fr-alarma"/>`;
    else if (v.f === "fuga") s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 2" class="fr-alarma"/><path d="M22 36 v6 m-3 0 h6 m-4.5 3 h3" stroke="#2563eb" stroke-width="1.2" fill="none"/>`;
    if (v.sim && !v.on && !v.f) s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="rgba(255,255,255,.55)"/>`;
    s += t(LW / 2 - 2, 49, 5.2, d.n, 'fill="#1f201d" font-weight="700"') + t(LW / 2 - 2, 55, 4.6, (v.i != null && v.sim ? v.i.toFixed(v.i >= 100 ? 0 : 1) + " A · " : "") + w + " W", 'fill="#55574f"');
    return s;
  };
  const dibujarAcom = (o, v) => {
    const tri = o.p.tipo === "tri", cut = v.sim && !v.on;
    return `<g opacity="${cut ? ".45" : 1}"><rect x="27" y="2" width="5" height="40" fill="#8a6a43"/><rect x="14" y="8" width="32" height="3.4" rx="1" fill="#8a6a43"/>` + [16, 30, 44].map(x => `<circle cx="${x}" cy="7" r="1.8" fill="#b7d3e8" stroke="#6b8aa5" stroke-width=".5"/>`).join("") +
      `<path d="M16 7 q-9 6 -15 6 M44 7 q9 6 15 6" fill="none" stroke="#333" stroke-width=".9"/><rect x="18" y="30" width="24" height="14" rx="2" fill="#dfe0db" stroke="#7d7f78" stroke-width=".8"/></g>` +
      t(30, 40, 6.2, tri ? "380 V" : "220 V", `fill="${cut ? "#c23b2c" : "#1f201d"}" font-weight="700"`) + t(30, 52, 5, cut ? "SIN RED" : "Bajada de línea", `fill="${cut ? "#c23b2c" : "#55574f"}" font-weight="700"`);
  };

  /* ---------- Catálogo ---------- */
  const AMP_T = ["2", "4", "6", "10", "16", "20", "25", "32", "40", "50", "63"], AMP_G = ["25", "32", "40", "63", "80", "100", "125"], AMP_C = ["16", "25", "40", "63"];
  const POL = [1, 2, 3, 4];
  const K = {
    acometida: { n: "Acometida (bajada de línea)", cat: "acom", z: "a", def: { tipo: "mono" }, campos: ["tipo"], d: () => "" },
    termo: { n: "Térmica", cat: "prot", polos: POL, mod: p => p.polos, def: { polos: 1, amp: "16", curva: "C" }, campos: ["polos", "amp", "curva"], d: p => `Térmica ${p.polos}P ${p.curva}${p.amp} A` },
    difer: { n: "Diferencial", cat: "prot", polos: [2, 4], mod: p => p.polos, def: { polos: 2, amp: "40", sens: "30" }, campos: ["polos", "amp", "sens"], d: p => `Diferencial ${p.polos}P ${p.amp} A ${p.sens} mA` },
    general: { n: "Interruptor general", cat: "prot", polos: [2, 4], mod: p => p.polos, def: { polos: 2, amp: "63" }, campos: ["polos", "amp"], d: p => `Interruptor general ${p.polos}P ${p.amp} A` },
    dps: { n: "Protector de sobretensión", cat: "prot", polos: POL, mod: p => p.polos, def: { polos: 2 }, campos: ["polos"], d: p => `Protector de sobretensión ${p.polos}P` },
    guardamotor: { n: "Guardamotor", cat: "prot", mod: () => 3, def: { rango: "4-6.3" }, campos: ["rango"], d: p => `Guardamotor ${p.rango} A` },
    fusible: { n: "Portafusible", cat: "prot", polos: [1, 2, 3], mod: p => p.polos, def: { polos: 1, amp: "16" }, campos: ["polos", "amp"], d: p => `Portafusible ${p.polos}P ${p.amp} A` },
    voltimetro: { n: "Voltímetro", cat: "med", mod: () => 2, def: {}, campos: [], d: () => "Voltímetro digital" },
    amperimetro: { n: "Amperímetro", cat: "med", mod: () => 2, def: {}, campos: [], d: () => "Amperímetro digital" },
    medidor1: { n: "Medidor monofásico", cat: "med", mod: () => 4, def: {}, campos: [], d: () => "Medidor de energía monofásico" },
    medidor3: { n: "Medidor trifásico", cat: "med", mod: () => 6, def: {}, campos: [], d: () => "Medidor de energía trifásico" },
    rele: { n: "Relé", cat: "ctl", mod: () => 1, def: { bobina: "220 V" }, campos: ["bobina"], d: p => `Relé modular bobina ${p.bobina}` },
    contactor: { n: "Contactor", cat: "ctl", polos: [2, 4], mod: p => p.polos, def: { polos: 2, amp: "25", bobina: "220 V" }, campos: ["polos", "amp", "bobina"], d: p => `Contactor ${p.polos}P ${p.amp} A bobina ${p.bobina}` },
    temporizador: { n: "Temporizador", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Temporizador (relé de tiempo)" },
    horario: { n: "Reloj horario", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Reloj programador horario" },
    relewifi: { n: "Relé WiFi", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Relé WiFi" },
    monitor: { n: "Falta de fase", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Relé monitor de tensión (falta de fase)" },
    fuente: { n: "Fuente", cat: "ctl", mod: () => 4, def: { salida: "24 V DC" }, campos: ["salida"], d: p => `Fuente ${p.salida}` },
    piloto: { n: "Luz piloto", cat: "ctl", mod: () => 1, def: { color: "verde" }, campos: ["color"], d: p => `Luz piloto ${p.color}` },
    bornera: { n: "Bornera", cat: "con", mod: p => p.n, def: { n: 2 }, campos: ["n"], nmax: 12, d: p => `Bornera ${p.n * 2} bornes` },
    barraN: { n: "Barra de neutro", cat: "con", mod: p => p.n, def: { n: 4 }, campos: ["n"], nmax: 12, d: p => `Barra de neutro ${p.n} módulos` },
    barraT: { n: "Barra de tierra", cat: "con", mod: p => p.n, def: { n: 4 }, campos: ["n"], nmax: 12, d: p => `Barra de tierra ${p.n} módulos` },
    reserva: { n: "Espacio libre", cat: "otro", mod: p => p.n, def: { n: 2 }, campos: ["n"], nmax: 12, d: p => `Reserva ${p.n} módulos`, sinLista: true }
  };
  Object.keys(LOAD).forEach(k => { K[k] = { n: LOAD[k].n, cat: "acom", z: "c", def: { w: LOAD[k].w }, campos: ["w"], d: () => "" }; CLS[k] = "load"; });
  const CAT = [["prot", "Protecciones"], ["med", "Medición"], ["ctl", "Control"], ["con", "Conexión"], ["acom", "Acometida y cargas"], ["otro", "Otros"]];
  const OPC = { polos: ["Polos", k => k.polos], amp: ["Corriente (A)", k => (k === K.general ? AMP_G : k === K.contactor ? AMP_C : AMP_T)], curva: ["Curva", () => ["B", "C", "D"]], sens: ["Sensibilidad (mA)", () => ["10", "30", "100", "300"]], bobina: ["Bobina", () => ["12 V", "24 V", "110 V", "220 V"]], salida: ["Salida", () => ["12 V DC", "24 V DC", "48 V DC"]], color: ["Color", () => ["rojo", "verde", "ámbar", "azul", "blanco"]], tipo: ["Red", () => ["mono", "tri"]] };
  const PRESETS = [["12", "12 módulos (1 fila de 12)", 1, 12], ["18", "18 módulos (1 fila de 18)", 1, 18], ["24", "24 módulos (2 filas de 12)", 2, 12], ["36", "36 módulos (3 filas de 12)", 3, 12], ["48", "48 módulos (2 filas de 24)", 2, 24], ["72", "72 módulos (3 filas de 24)", 3, 24], ["x", "Personalizado", 0, 0]];

  const enRiel = o => !o.z || o.z === "r";
  const modOf = o => Math.max(1, Math.round(K[o.k].mod(o.p)));

  /* ---------- Estado del tablero ---------- */
  function iniciar(tb) {
    if (!tb.frente) tb.frente = { preset: "24", filas: 2, mpf: 12, ancho: "", alto: "", prof: "110", items: [], cables: [] };
    const f = tb.frente; f.items = f.items || []; f.cables = f.cables || []; return f;
  }
  const libre = (f, fila, x, mod, ignorar) => {
    if (fila < 0 || fila >= f.filas || x < 0 || x + mod > f.mpf) return false;
    return !f.items.some(o => enRiel(o) && o.id !== ignorar && o.f === fila && x < o.x + modOf(o) && o.x < x + mod);
  };
  const hueco = (f, mod, desde) => { for (let i = 0; i < f.filas; i++) { const fi = ((desde || 0) + i) % f.filas; for (let x = 0; x + mod <= f.mpf; x++) if (libre(f, fi, x, mod)) return { f: fi, x }; } return null; };
  const uid = () => Math.random().toString(36).slice(2, 9);
  const medidas = f => ({ ancho: f.ancho || String(Math.round(f.mpf * M + 90)), alto: f.alto || String(Math.round(f.filas * PASO * .96 + 80)), prof: f.prof || "110" });
  const usados = f => f.items.filter(o => enRiel(o) && o.k !== "reserva").reduce((a, o) => a + modOf(o), 0);

  /* Geometría y terminales */
  function G(f) {
    const nC = f.items.filter(o => o.z === "c").length, cajaW = f.mpf * M + 2 * MX, W = Math.max(cajaW, nC * LW + 2 * MX, 190), OX = (W - cajaW) / 2, cajaH = f.filas * PASO + 2 * MY, LY = TOP + cajaH + GAP;
    return { nC, cajaW, W, OX, cajaH, LY, Hh: LY + LH + 14 };
  }
  function pos(o, g, f) {
    if (o.z === "c") { const i = f.items.filter(q => q.z === "c").indexOf(o); return { x: (g.W - g.nC * LW) / 2 + i * LW, y: g.LY }; }
    if (o.z === "a") return { x: g.W / 2 - 30, y: 4 };
    return { x: g.OX + MX + o.x * M, y: TOP + MY + o.f * PASO + PASO / 2 - H / 2 };
  }
  function terminales(o, g, f) {
    const p = pos(o, g, f), c = CLS[o.k];
    if (c === "src") return [{ id: o.id + ":b0", x: p.x + 30, y: TOP - 8 }];
    if (c === "load") return [{ id: o.id + ":t0", x: p.x + LW / 2 - 2, y: p.y - 8 }];
    const w = enRiel(o) ? modOf(o) * M : 0, cx = p.x + w / 2, top = p.y - 5, bot = p.y + H + 17;
    if (c === "prot" || c === "sw" || c === "med") return [{ id: o.id + ":t0", x: cx, y: top }, { id: o.id + ":b0", x: cx, y: bot }];
    if (c === "junc") { const r = []; for (let i = 0; i < modOf(o); i++) { r.push({ id: o.id + ":t" + i, x: p.x + (i + .5) * M, y: top }); r.push({ id: o.id + ":b" + i, x: p.x + (i + .5) * M, y: bot }); } return r; }
    if (c === "tap" || c === "carga") return [{ id: o.id + ":t0", x: cx, y: top }];
    return [];
  }

  /* ---------- Simulación ---------- */
  const mk = () => ({ on: false, t: 0, red: true, cerrado: {}, disparo: {}, heat: {}, falla: {}, extra: {}, fuga: {}, kwh: {}, log: [], flash: null });
  const nominal = o => { const p = o.p; if (o.k === "guardamotor") { const r = String(p.rango || "4-6.3").split("-"); return parseFloat(r[r.length - 1]) || 6.3; } return parseFloat(p.amp) || 16; };
  const magMult = o => (o.k === "guardamotor" ? 12 : o.k === "fusible" ? 6 : ({ B: 5, C: 10, D: 20 })[o.p.curva] || 10);
  function corrienteCarga(o, sim) {
    const d = LOAD[o.k], w = +o.p.w || d.w, f = sim.falla[o.id];
    if (sim.cerrado[o.id] === false) return 0;
    if (f === "cc") return ISC;
    const I = d.tri ? w / (Math.sqrt(3) * 380 * d.cos) : w / (220 * d.cos);
    return f === "sobre" ? I * (1 + (sim.extra[o.id] || 70) / 100) : I;
  }
  function evaluar(f, sim) {
    const items = f.items, adj = new Map();
    const add = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); };
    f.cables.forEach(c => add(c.a, c.b));
    const conduce = o => { const c = CLS[o.k]; if (c === "prot") return sim.cerrado[o.id] !== false && !sim.disparo[o.id]; if (c === "sw") return sim.cerrado[o.id] !== false; return true; };
    items.forEach(o => {
      const c = CLS[o.k];
      if ((c === "prot" || c === "sw" || c === "med") && conduce(o)) add(o.id + ":t0", o.id + ":b0");
      if (c === "junc") { const n = modOf(o); for (let i = 0; i < n; i++) { add(o.id + ":t" + i, o.id + ":t0"); add(o.id + ":b" + i, o.id + ":t0"); } }
    });
    const src = items.find(o => CLS[o.k] === "src"), V = src && src.p.tipo === "tri" ? 380 : 220;
    const vis = new Set(), parent = new Map(), depth = new Map(), order = [];
    if (src && sim.red) { const s = src.id + ":b0"; vis.add(s); depth.set(s, 0); order.push(s); for (let i = 0; i < order.length; i++) { const n = order[i]; (adj.get(n) || []).forEach(m => { if (!vis.has(m)) { vis.add(m); parent.set(m, n); depth.set(m, depth.get(n) + 1); order.push(m); } }); } }
    const own = new Map(), leak = new Map();
    items.filter(o => CLS[o.k] === "load").forEach(o => { const id = o.id + ":t0"; if (vis.has(id)) { own.set(id, corrienteCarga(o, sim)); if (sim.falla[o.id] === "fuga") leak.set(id, (sim.fuga[o.id] || 100) / 1000); } });
    items.filter(o => ["piloto", "fuente", "monitor"].includes(o.k)).forEach(o => { const id = o.id + ":t0"; if (vis.has(id)) own.set(id, o.k === "fuente" ? .4 : .02); });
    const acc = new Map(), accL = new Map();
    for (let i = order.length - 1; i >= 0; i--) { const n = order[i]; acc.set(n, (acc.get(n) || 0) + (own.get(n) || 0)); accL.set(n, (accL.get(n) || 0) + (leak.get(n) || 0)); const p = parent.get(n); if (p) { acc.set(p, (acc.get(p) || 0) + acc.get(n)); accL.set(p, (accL.get(p) || 0) + accL.get(n)); } }
    const dev = new Map();
    items.forEach(o => {
      const c = CLS[o.k], t0 = o.id + ":t0", b0 = o.id + ":b0";
      if (c === "prot" || c === "sw" || c === "med") dev.set(o.id, { vivo: vis.has(t0), I: vis.has(b0) ? (acc.get(b0) || 0) : 0, L: vis.has(b0) ? (accL.get(b0) || 0) : 0, prof: depth.get(t0) || 0 });
      else if (c === "tap" || c === "carga" || c === "load") dev.set(o.id, { vivo: vis.has(t0), I: acc.get(t0) || 0 });
    });
    const cable = new Map();
    f.cables.forEach(c => { const ok = vis.has(c.a) && vis.has(c.b); let I = 0; if (ok) { if (parent.get(c.b) === c.a) I = acc.get(c.b) || 0; else if (parent.get(c.a) === c.b) I = acc.get(c.a) || 0; } cable.set(c.id, { vivo: ok, I }); });
    return { vis, dev, cable, V, src };
  }
  function avisos(f, sim, R) {
    const a = [];
    if (!R.src) a.push("Falta la acometida (bajada de línea)."); else if (!f.cables.length) a.push("No hay cables conectados.");
    const hayProt = f.items.some(q => CLS[q.k] === "prot");
    f.items.filter(o => CLS[o.k] === "load").forEach(o => {
      const d = LOAD[o.k];
      if (R.src && sim.red && !R.vis.has(o.id + ":t0") && f.cables.length) { a.push(`${d.n}: sin alimentación (no llega cable o hay una protección abierta).`); return; }
      if (!hayProt && R.vis.has(o.id + ":t0")) a.push(`${d.n}: sin ninguna protección aguas arriba.`);
      if (d.tri && !f.items.some(q => CLS[q.k] === "prot" && (q.p.polos || 3) >= 3)) a.push(`${d.n}: un motor trifásico necesita protección de 3 o 4 polos.`);
    });
    return a;
  }

  /* ---------- Interfaz ---------- */
  const CSS = `.fr{display:grid;grid-template-columns:210px minmax(0,1fr);gap:16px;align-items:start}
  .fr-pal{background:#f7f7f3;border:1px solid #c9cbc4;border-radius:20px;padding:12px;max-height:calc(100vh - 220px);overflow:auto;position:sticky;top:12px}
  .fr-pal h4{margin:10px 4px 6px;font-size:.74rem;color:#55574f;font-weight:800}.fr-pal h4:first-child{margin-top:2px}
  .fr-tiles{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .fr-tile{background:#fff;border:1px solid #dcded6;border-radius:12px;padding:5px 3px 4px;text-align:center;cursor:grab;display:flex;flex-direction:column;align-items:center;gap:2px;font:inherit;color:#1f201d}
  .fr-tile:hover{border-color:#f9a01b;box-shadow:0 0 0 2px rgba(249,160,27,.35)}
  .fr-tile svg{width:100%;height:46px}.fr-tile span{font-size:.66rem;font-weight:700;line-height:1.1}
  .fr-cab{display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-bottom:8px}
  .fr-cab label{margin:0 0 3px .2em;font-size:.76rem}
  .fr-cab input,.fr-cab select{width:auto;min-width:0;padding:.4em .7em;font-size:.9rem}.fr-cab input{width:74px}.fr-cab input[type=range]{width:110px;padding:0;box-shadow:none;background:none}
  .fr-modo{display:inline-flex;background:#d9dbd3;border-radius:99px;padding:3px}
  .fr-modo button{border:0;background:none;padding:.35em 1em;border-radius:99px;font-weight:800;color:#55574f;font-size:.88rem}.fr-modo button.on{background:#232323;color:#fff}.fr-modo button.on.sim{background:#c23b2c}
  .fr-info{font-size:.84rem;color:#55574f;margin:0 0 6px}
  .fr-lienzo{background:#e3e4df;border-radius:20px;padding:10px;border:1px solid #c9cbc4;overflow:auto}
  .fr-lienzo svg{display:block;margin:0 auto;height:auto;touch-action:none;user-select:none}
  .fr-dev{cursor:grab}.fr-dev.sel>rect:first-child{stroke:#f9a01b;stroke-width:1.6}.fr-sim .fr-dev,.fr-sim .fr-carga{cursor:pointer}
  .fr-term{cursor:crosshair}.fr-term circle{transition:r .1s}.fr-term:hover circle{r:4.6}
  .fr-cable{fill:none;stroke:#3b3b3b;stroke-width:2.2;stroke-linecap:round}.fr-cable.sel{stroke:#f9a01b;stroke-width:3}
  .fr-flujo{fill:none;stroke:#ffb300;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:5 6;animation:fr-flow .55s linear infinite}
  .fr-flujo.alto{stroke:#f97316;animation-duration:.3s}.fr-flujo.cc{stroke:#e11d1d;stroke-width:3.4;animation-duration:.12s}
  @keyframes fr-flow{to{stroke-dashoffset:-11}}
  .fr-giro{animation:fr-spin .5s linear infinite}@keyframes fr-spin{to{transform:rotate(360deg)}}
  .fr-chispa{animation:fr-chispa .18s steps(2) infinite}@keyframes fr-chispa{50%{opacity:.25}}
  .fr-alarma{animation:fr-alarma .5s ease-in-out infinite alternate}@keyframes fr-alarma{to{opacity:.3}}
  .fr-aire{animation:fr-alarma .8s ease-in-out infinite alternate}
  .fr-prop,.fr-simp,.fr-lista{background:#f7f7f3;border:1px solid #c9cbc4;border-radius:20px;padding:14px;margin-top:12px}
  .fr-prop .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
  .fr-lista table{width:100%;border-collapse:collapse;font-size:.9rem}.fr-lista td{padding:6px 8px;border-bottom:1px solid #e3e4de}.fr-lista td:last-child{text-align:right;font-weight:800;width:60px}
  .fr-alerta{background:#f8e0dc;border-left:5px solid #c23b2c;border-radius:12px;padding:10px 12px;font-weight:700;margin-bottom:8px;animation:fr-alarma .6s ease-in-out infinite alternate}
  .fr-log{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:4px;font-size:.88rem;max-height:200px;overflow:auto}.fr-log li{background:#fff;border-radius:10px;padding:5px 10px}
  .fr-log li b{font-variant-numeric:tabular-nums;color:#55574f;margin-right:6px}
  @media print{.fr-pal,.fr-cab,.fr-prop,.fr-simp{display:none}.fr{display:block}.fr-lienzo,.fr-lista{border:0;background:#fff}}
  @media (max-width:900px){.fr{grid-template-columns:1fr}.fr-pal{position:static;max-height:none}}`;

  function montar(el, tb, alCambiar) {
    if (!document.getElementById("fr-css")) { const s = document.createElement("style"); s.id = "fr-css"; s.textContent = CSS; document.head.appendChild(s); }
    const f = iniciar(tb); let sel = null, selC = null, arrastre = null, sim = mk(), modo = "armar", R = null, ultimaSig = "", timer = null, previa = null;
    let zoom = innerWidth < 900 ? 100 : 62; try { zoom = +localStorage.getItem("fr-zoom") || zoom; } catch (e) { }
    const guardar = () => { alCambiar && alCambiar(); };
    const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const aviso = txt => { const x = document.createElement("div"); x.className = "toast"; x.textContent = txt; document.body.appendChild(x); setTimeout(() => x.remove(), 2400); };

    el.innerHTML = `<div class="fr"><aside class="fr-pal" id="fr-pal"></aside><div><div class="fr-cab" id="fr-cab"></div><p class="fr-info" id="fr-info"></p><div class="fr-lienzo" id="fr-lz"><svg id="fr-svg" xmlns="http://www.w3.org/2000/svg"></svg></div><div class="fr-simp" id="fr-simp" hidden></div><div class="fr-prop" id="fr-prop"></div><div class="fr-lista" id="fr-lista"></div></div></div>`;
    const $ = id => el.querySelector("#" + id), svg = $("fr-svg");

    /* Paleta */
    $("fr-pal").innerHTML = CAT.map(([id, nombre]) => `<h4>${nombre}</h4><div class="fr-tiles">${Object.keys(K).filter(k => K[k].cat === id).map(k => {
      let inner, w, h;
      if (K[k].z === "c") { inner = `<g transform="translate(4,0)">${icono[k]({})}</g>`; w = 46; h = 42; }
      else if (K[k].z === "a") { inner = dibujarAcom({ p: K[k].def }, {}); w = 60; h = 56; }
      else { const o = { k, p: Object.assign({}, K[k].def) }; w = modOf(o) * M; h = H; inner = `<g>${D[k](w, o.p, {})}</g>`; }
      return `<button type="button" class="fr-tile" draggable="${K[k].z ? "false" : "true"}" data-k="${k}" title="Agregar ${esc(K[k].n)}"><svg viewBox="-2 -2 ${w + 4} ${h + 4}" preserveAspectRatio="xMidYMid meet">${inner}</svg><span>${esc(K[k].n)}</span></button>`;
    }).join("")}</div>`).join("");

    function pintarCab() {
      const m = medidas(f);
      $("fr-cab").innerHTML = `<div class="fr-modo" role="tablist"><button type="button" data-modo="armar" class="${modo === "armar" ? "on" : ""}">Armar</button><button type="button" data-modo="sim" class="${modo === "sim" ? "on sim" : ""}">Simular</button></div>
      <div><label for="fr-pre">Caja</label><select id="fr-pre">${PRESETS.map(p => `<option value="${p[0]}"${p[0] === f.preset ? " selected" : ""}>${p[1]}</option>`).join("")}</select></div>
      <div><label for="fr-fil">Filas</label><input id="fr-fil" type="number" min="1" max="6" value="${f.filas}"></div>
      <div><label for="fr-mpf">Módulos por fila</label><input id="fr-mpf" type="number" min="4" max="36" value="${f.mpf}"></div>
      <div><label for="fr-an">Ancho (mm)</label><input id="fr-an" inputmode="numeric" value="${esc(f.ancho)}" placeholder="${m.ancho}"></div>
      <div><label for="fr-al">Alto (mm)</label><input id="fr-al" inputmode="numeric" value="${esc(f.alto)}" placeholder="${m.alto}"></div>
      <div><label for="fr-pr">Prof. (mm)</label><input id="fr-pr" inputmode="numeric" value="${esc(f.prof)}" placeholder="110"></div>
      <div><label for="fr-z">Tamaño</label><input id="fr-z" type="range" min="30" max="100" value="${zoom}"></div>
      ${modo === "armar" ? '<button type="button" class="btn chico claro" id="fr-auto">Cablear solo</button><button type="button" class="btn chico claro" id="fr-quitarc">Quitar cables</button>' : ""}`;
    }
    function info() {
      const m = medidas(f), u = usados(f), tot = f.filas * f.mpf;
      $("fr-info").textContent = `Caja de ${tot} módulos (${f.filas} ${f.filas === 1 ? "fila" : "filas"} de ${f.mpf}) · ${m.ancho} x ${m.alto} x ${m.prof} mm · ocupados ${u} de ${tot} módulos (${tot ? Math.round(u / tot * 100) : 0} %)`;
    }

    /* Lienzo */
    function estadoVista(o) {
      const c = CLS[o.k];
      if (modo !== "sim" || !R) return {};
      const d = R.dev.get(o.id) || {}, v = { sim: 1, on: !!d.vivo };
      if (c === "prot" || c === "sw") v.e = sim.disparo[o.id] ? "trip" : sim.cerrado[o.id] === false ? "off" : "on";
      if (o.k === "voltimetro") v.txt = d.vivo ? String(R.V) : "0";
      if (o.k === "amperimetro") v.txt = d.vivo ? d.I.toFixed(d.I >= 100 ? 0 : 1) : "0.0";
      if (o.k === "medidor1" || o.k === "medidor3") { const P = d.vivo ? d.I * R.V * (o.k === "medidor3" ? Math.sqrt(3) : 1) : 0; v.txt = (P / 1000).toFixed(2); v.sub = "kW"; }
      if (c === "load") { v.f = sim.falla[o.id]; v.i = d.I; v.on = !!d.vivo && sim.cerrado[o.id] !== false; }
      if (c === "src") v.on = sim.red;
      return v;
    }
    const camino = (a, b, ya, yb) => { const k = Math.max(22, Math.abs(yb - ya) / 2); return `M${a} ${ya} C${a} ${ya + k} ${b} ${yb - k} ${b} ${yb}`; };
    function pintar() {
      const g = G(f); R = modo === "sim" ? evaluar(f, sim) : null;
      svg.setAttribute("viewBox", `0 0 ${g.W} ${g.Hh}`); svg.style.width = zoom + "%"; svg.classList.toggle("fr-sim", modo === "sim");
      let s = `<defs><linearGradient id="fr-riel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe1e4"/><stop offset=".5" stop-color="#b9bcc2"/><stop offset="1" stop-color="#d4d6da"/></linearGradient></defs>`;
      s += `<rect x="${g.OX}" y="${TOP}" width="${g.cajaW}" height="${g.cajaH}" rx="7" fill="#f2f2ee" stroke="#8d8f88" stroke-width="1.6"/><rect x="${g.OX + 8}" y="${TOP + 8}" width="${g.cajaW - 16}" height="${g.cajaH - 16}" rx="4" fill="#eceae4" stroke="#c9cbc4" stroke-width=".8"/>`;
      for (let r = 0; r < f.filas; r++) {
        const cy = TOP + MY + r * PASO + PASO / 2, rx = g.OX + MX - 5, rw = f.mpf * M + 10;
        s += `<rect x="${rx}" y="${cy - 17.5}" width="${rw}" height="35" fill="url(#fr-riel)" stroke="#8d8f88" stroke-width=".6"/>`;
        for (let i = 0; i < f.mpf * 2; i++) s += `<rect x="${g.OX + MX + 3 + i * 9}" y="${cy - 2.2}" width="5" height="4.4" rx="2.2" fill="#8d8f88" opacity=".55"/>`;
        for (let i = 0; i <= f.mpf; i++) s += `<line x1="${g.OX + MX + i * M}" y1="${cy - H / 2 - 2}" x2="${g.OX + MX + i * M}" y2="${cy + H / 2 + 2}" stroke="#bdbeb8" stroke-width=".35" stroke-dasharray="1.2 2.4"/>`;
        const ocup = f.items.filter(o => enRiel(o) && o.f === r && o.k !== "reserva").reduce((a, o) => a + modOf(o), 0);
        s += `<text x="${g.OX + MX}" y="${cy - H / 2 - 17}" font-size="6" fill="#55574f" font-family="Archivo,Arial,sans-serif" font-weight="700">Fila ${r + 1} · ${ocup}/${f.mpf} módulos</text>`;
      }
      const TM = new Map(); f.items.forEach(o => terminales(o, g, f).forEach(tt => TM.set(tt.id, tt)));
      const hayCC = Object.values(sim.falla).includes("cc");
      f.cables.forEach(c => { const a = TM.get(c.a), b = TM.get(c.b); if (!a || !b) return; const d = camino(a.x, b.x, a.y, b.y), cs = R && R.cable.get(c.id);
        s += `<path class="fr-cable${c.id === selC ? " sel" : ""}" d="${d}"/><path d="${d}" fill="none" stroke="transparent" stroke-width="9" data-cable="${c.id}" style="cursor:pointer"/>`;
        if (sim.flash && sim.t < sim.flash.hasta && sim.flash.ids.includes(c.id)) s += `<path class="fr-flujo cc" d="${d}"/>`;
        else if (cs && cs.vivo) s += `<path class="fr-flujo${hayCC && cs.I >= ISC * .5 ? " cc" : cs.I > 16 ? " alto" : ""}" d="${d}"/>`; });
      f.items.forEach(o => {
        const p = pos(o, g, f), v = estadoVista(o);
        if (o.z === "c") { s += `<g class="fr-carga fr-dev${o.id === sel ? " sel" : ""}" data-id="${o.id}" transform="translate(${p.x},${p.y})"><rect x="0" y="-4" width="${LW}" height="${LH}" rx="6" fill="transparent"/>${dibujarCarga(o, v)}</g>`; return; }
        if (o.z === "a") { s += `<g class="fr-dev${o.id === sel ? " sel" : ""}" data-id="${o.id}" transform="translate(${p.x},${p.y})"><rect x="0" y="0" width="60" height="${TOP - 18}" rx="6" fill="transparent"/>${dibujarAcom(o, v)}</g>`; return; }
        const w = modOf(o) * M, heat = sim.heat[o.id] || 0;
        s += `<g class="fr-dev${o.id === sel ? " sel" : ""}" data-id="${o.id}" transform="translate(${p.x},${p.y})">${D[o.k](w, o.p, v)}<rect x="0" y="0" width="${w}" height="${H}" fill="transparent"/>` +
          (v.e === "trip" ? `<circle cx="${w - 5}" cy="5.5" r="3" fill="#c23b2c" class="fr-alarma"/>` : "") +
          (modo === "sim" && heat > .05 ? `<rect x="3" y="${H + 13}" width="${w - 6}" height="2.6" rx="1.3" fill="#ddd"/><rect x="3" y="${H + 13}" width="${Math.min(1, heat) * (w - 6)}" height="2.6" rx="1.3" fill="${heat > .7 ? "#c23b2c" : "#f59e0b"}"/>` : "") +
          (o.rot ? `<rect x="${w / 2 - Math.min(w / 2, 22)}" y="${H + 2}" width="${Math.min(w, 44)}" height="9" rx="1.6" fill="#fff" stroke="#9a9b95" stroke-width=".5"/><text x="${w / 2}" y="${H + 8.6}" font-size="5.2" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="700" fill="#1f201d">${esc(o.rot)}</text>` : "") + `</g>`;
      });
      f.items.forEach(o => terminales(o, g, f).forEach(tt => { const usado = f.cables.some(c => c.a === tt.id || c.b === tt.id), activo = previa === tt.id, en = R && R.vis.has(tt.id);
        s += `<g class="fr-term" data-term="${tt.id}"><circle cx="${tt.x}" cy="${tt.y}" r="${activo ? 4.8 : 3.4}" fill="${en ? "#ffb300" : usado ? "#2f8a4c" : "#f9a01b"}" stroke="#232323" stroke-width=".9"/></g>`; }));
      s += `<path id="fr-prev" d="" fill="none" stroke="#f9a01b" stroke-width="2" stroke-dasharray="4 3"/>`;
      if (!f.items.some(o => CLS[o.k] === "src")) s += `<text x="${g.W / 2}" y="${TOP / 2 + 4}" text-anchor="middle" font-size="7" fill="#9a9b95" font-family="Archivo,Arial,sans-serif" font-weight="700">Sumá la acometida (bajada de línea) desde el panel</text>`;
      svg.innerHTML = s; svg._TM = TM;
    }
    function lista() {
      const c = {};
      f.items.filter(o => enRiel(o) && !K[o.k].sinLista).forEach(o => { const d = K[o.k].d(o.p); c[d] = (c[d] || 0) + 1; });
      const ks = Object.keys(c).sort();
      $("fr-lista").innerHTML = `<h3 style="margin:0 0 8px">Lista de materiales</h3>` + (ks.length ? `<table>${ks.map(k => `<tr><td>${esc(k)}</td><td>${c[k]}</td></tr>`).join("")}</table>` : `<p style="margin:0;color:#55574f">Agregá dispositivos desde el panel de la izquierda.</p>`);
    }
    function prop() {
      const o = f.items.find(i => i.id === sel), box = $("fr-prop");
      if (modo === "sim") { box.hidden = true; return; } box.hidden = false;
      if (selC) { box.innerHTML = `<h3 style="margin:0 0 10px">Cable</h3><button type="button" class="btn chico peligro" id="fp-qc">Quitar cable</button>`; box.querySelector("#fp-qc").onclick = () => { f.cables = f.cables.filter(c => c.id !== selC); selC = null; todo(); }; return; }
      if (!o) { box.innerHTML = `<p style="margin:0;color:#55574f">Tocá un dispositivo para editarlo o arrastralo. Unir dos puntos naranjas arma un cable.</p>`; return; }
      const k = K[o.k];
      box.innerHTML = `<h3 style="margin:0 0 10px">${esc(k.n)}</h3><div class="g">${enRiel(o) ? `<div><label for="fp-rot">Rótulo (circuito)</label><input id="fp-rot" value="${esc(o.rot || "")}" placeholder="Luces, Tomas…"></div>` : ""}` +
        k.campos.map(c => {
          if (c === "n") return `<div><label for="fp-n">Módulos</label><input id="fp-n" type="number" min="1" max="${k.nmax || 12}" value="${o.p.n}"></div>`;
          if (c === "rango") return `<div><label for="fp-rango">Rango (A)</label><input id="fp-rango" value="${esc(o.p.rango)}"></div>`;
          if (c === "w") return `<div><label for="fp-w">Potencia (W)</label><input id="fp-w" type="number" min="10" step="10" value="${o.p.w}"></div>`;
          const [l, op] = OPC[c], lst = op(k);
          return `<div><label for="fp-${c}">${l}</label><select id="fp-${c}">${lst.map(v => `<option value="${v}"${String(v) === String(o.p[c]) ? " selected" : ""}>${v === "mono" ? "Monofásica 220 V" : v === "tri" ? "Trifásica 380 V" : v}</option>`).join("")}</select></div>`;
        }).join("") + `</div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn chico claro" id="fp-dup">Duplicar</button><button type="button" class="btn chico peligro" id="fp-del">Quitar</button></div>`;
      const cambiar = (clave, valor) => {
        const prev = JSON.stringify(o.p), antes = enRiel(o) ? modOf(o) : 0;
        if (clave === "n") o.p.n = Math.max(1, Math.min(k.nmax || 12, +valor || 1)); else if (clave === "polos") o.p.polos = +valor; else if (clave === "w") o.p.w = Math.max(10, +valor || 10); else o.p[clave] = valor;
        if (enRiel(o) && modOf(o) !== antes && !libre(f, o.f, o.x, modOf(o), o.id)) { o.p = JSON.parse(prev); aviso("No hay lugar en esa fila para ese ancho"); prop(); return; }
        guardar(); pintar(); lista(); info();
      };
      const rot = box.querySelector("#fp-rot"); if (rot) rot.oninput = e => { o.rot = e.target.value; guardar(); pintar(); };
      k.campos.forEach(c => { const i = box.querySelector("#fp-" + c); if (i) i.onchange = e => cambiar(c, e.target.value); });
      box.querySelector("#fp-del").onclick = () => quitar(o.id);
      box.querySelector("#fp-dup").onclick = () => { if (!enRiel(o)) { if (o.z === "a") return aviso("Hay una sola acometida"); const n = { id: uid(), k: o.k, p: Object.assign({}, o.p), z: o.z }; f.items.push(n); sel = n.id; return todo(); } const h = hueco(f, modOf(o), o.f); if (!h) return aviso("No hay lugar libre en el tablero"); const n = { id: uid(), k: o.k, p: Object.assign({}, o.p), rot: o.rot, f: h.f, x: h.x }; f.items.push(n); sel = n.id; todo(); };
    }
    function quitar(id) { f.items = f.items.filter(i => i.id !== id); f.cables = f.cables.filter(c => !c.a.startsWith(id + ":") && !c.b.startsWith(id + ":")); if (sel === id) sel = null; todo(); }

    /* Panel de la simulación */
    function panelSim() {
      const box = $("fr-simp"); box.hidden = modo !== "sim"; if (modo !== "sim") return;
      const o = f.items.find(i => i.id === sel), carga = o && CLS[o.k] === "load", RR = R || evaluar(f, sim);
      const ccActivo = Object.values(sim.falla).includes("cc"), alertas = avisos(f, sim, RR), nombresCC = Object.keys(sim.falla).filter(k => sim.falla[k] === "cc").map(id => { const q = f.items.find(i => i.id === id); return q ? LOAD[q.k].n : ""; }).join(", ");
      box.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px"><h3 style="margin:0;margin-right:auto">Simulación</h3><button type="button" class="btn chico ${sim.red ? "claro" : "peligro"}" id="fs-red">${sim.red ? "Cortar la red" : "Volver la red"}</button><button type="button" class="btn chico claro" id="fs-reset">Reiniciar</button></div>` +
        (ccActivo ? `<div class="fr-alerta">Cortocircuito en ${esc(nombresCC)}</div>` : "") +
        (carga ? `<div style="margin-bottom:10px"><b>${esc(LOAD[o.k].n)}</b> · ${o.p.w} W · ${sim.cerrado[o.id] === false ? "apagado" : "encendido"}${sim.falla[o.id] ? " · falla: " + ({ cc: "cortocircuito", sobre: "sobrecarga", fuga: "fuga a tierra" })[sim.falla[o.id]] : ""}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn chico peligro" data-fa="cc">Cortocircuito</button><button type="button" class="btn chico" data-fa="sobre" style="background:#f59e0b;color:#201600">Sobrecarga</button><button type="button" class="btn chico" data-fa="fuga" style="background:#2563eb">Fuga a tierra</button><button type="button" class="btn chico claro" data-fa="ok">Quitar falla</button><button type="button" class="btn chico claro" data-fa="onoff">${sim.cerrado[o.id] === false ? "Encender" : "Apagar"}</button></div>`
          : `<p style="margin:0 0 8px;color:#55574f">Tocá un interruptor para abrirlo o cerrarlo, o una carga para provocarle una falla.</p>`) +
        (alertas.length ? `<ul class="fr-log">${alertas.map(a => `<li>${esc(a)}</li>`).join("")}</ul>` : "") +
        (sim.log.length ? `<ul class="fr-log">${sim.log.slice(-8).reverse().map(l => `<li><b>${l.t.toFixed(1)} s</b>${esc(l.m)}</li>`).join("")}</ul>` : "");
      box.querySelector("#fs-red").onclick = () => { sim.red = !sim.red; sim.log.push({ t: sim.t, m: sim.red ? "Vuelve la red." : "Se cortó la red." }); ultimaSig = ""; tick(true); };
      box.querySelector("#fs-reset").onclick = () => { sim = mk(); sim.on = true; ultimaSig = ""; pintar(); panelSim(); };
      box.querySelectorAll("[data-fa]").forEach(b => b.onclick = () => {
        const a = b.dataset.fa; if (a === "ok") delete sim.falla[o.id]; else if (a === "onoff") sim.cerrado[o.id] = sim.cerrado[o.id] === false; else { sim.falla[o.id] = a; sim.log.push({ t: sim.t, m: `${LOAD[o.k].n}: ${({ cc: "cortocircuito", sobre: "sobrecarga", fuga: "fuga a tierra" })[a]}.` }); }
        ultimaSig = ""; tick(true);
      });
    }
    function todo() { guardar(); pintarCab(); info(); pintar(); lista(); prop(); panelSim(); }

    /* Motor de la simulación: cada 100 ms */
    function tick(forzar) {
      if (!document.body.contains(el)) { clearInterval(timer); return; }
      if (modo !== "sim") return;
      const dt = forzar === true ? 0 : .1; sim.t += dt;
      const r = evaluar(f, sim); const cand = [];
      f.items.filter(o => CLS[o.k] === "prot").forEach(o => {
        const d = r.dev.get(o.id); if (!d || !d.vivo || sim.disparo[o.id] || sim.cerrado[o.id] === false) return;
        const In = nominal(o), ratio = d.I / In;
        if (o.k !== "difer" && d.I >= magMult(o) * In) cand.push({ o, m: "cc", prof: d.prof });
        else if (o.k === "difer" && d.L >= (parseFloat(o.p.sens) || 30) / 1000) cand.push({ o, m: "fuga", prof: d.prof });
        else { if (ratio > 1.13) sim.heat[o.id] = (sim.heat[o.id] || 0) + dt * (ratio * ratio - 1) / 4.4; else sim.heat[o.id] = Math.max(0, (sim.heat[o.id] || 0) - dt * .2); if (sim.heat[o.id] >= 1) cand.push({ o, m: "sobre", prof: d.prof }); }
      });
      let disparo = null;
      if (cand.length) { cand.sort((a, b) => (a.m === "sobre") - (b.m === "sobre") || b.prof - a.prof); disparo = cand[0]; }
      if (disparo) {
        const o = disparo.o; sim.disparo[o.id] = disparo.m; sim.heat[o.id] = 0;
        const nom = (K[o.k].d(o.p) + (o.rot ? " (" + o.rot + ")" : "")).trim();
        if (disparo.m === "cc") sim.flash = { hasta: sim.t + 1.6, ids: f.cables.filter(c => (r.cable.get(c.id) || {}).I >= ISC * .5).map(c => c.id) };
        sim.log.push({ t: sim.t, m: `Disparó ${nom}: ${{ cc: "cortocircuito, al instante", sobre: "sobrecarga, por calentamiento", fuga: "fuga a tierra" }[disparo.m]}.` });
      }
      const fl = sim.flash && sim.t < sim.flash.hasta ? 1 : 0; if (!fl && sim.flash) { sim.flash = null; ultimaSig = ""; }
      const sig = JSON.stringify([fl, sim.red, sim.cerrado, sim.disparo, sim.falla, [...r.dev].map(([k, d]) => k + (d.vivo ? 1 : 0) + Math.round(d.I * 10)), Object.keys(sim.heat).map(k => Math.round((sim.heat[k] || 0) * 8)), sim.log.length]);
      if (sig !== ultimaSig || disparo) { ultimaSig = sig; pintar(); panelSim(); }
    }
    function cambiarModo(m) {
      modo = m; sel = null; selC = null; previa = null; clearInterval(timer);
      if (m === "sim") { sim = mk(); sim.on = true; ultimaSig = ""; timer = setInterval(tick, 100); } else sim.on = false;
      pintarCab(); info(); pintar(); prop(); panelSim();
    }

    function agregar(k, fila, x) {
      const kk = K[k], it = { id: uid(), k, p: Object.assign({}, kk.def) };
      if (kk.z === "a") { if (f.items.some(o => o.z === "a")) return aviso("Ya hay una acometida"); it.z = "a"; }
      else if (kk.z === "c") { it.z = "c"; }
      else { const m = modOf(it); it.rot = ""; if (fila != null && libre(f, fila, x, m)) { it.f = fila; it.x = x; } else { const h = hueco(f, m, sel ? (f.items.find(i => i.id === sel) || {}).f || 0 : 0); if (!h) return aviso("No hay lugar libre en el tablero"); it.f = h.f; it.x = h.x; } }
      f.items.push(it); sel = it.id; todo();
    }

    /* Cablear solo: acometida -> general -> diferencial -> protecciones -> cargas */
    function cablear() {
      const A = f.items.find(o => o.z === "a"); if (!A) return aviso("Primero sumá la acometida");
      if (f.cables.length && !confirm("Esto reemplaza los cables actuales. ¿Seguir?")) return;
      f.cables = []; const w = (a, b) => f.cables.push({ id: uid(), a, b });
      const rail = f.items.filter(enRiel).sort((a, b) => (a.f - b.f) || (a.x - b.x));
      let up = A.id + ":b0";
      rail.filter(o => ["medidor1", "medidor3", "amperimetro"].includes(o.k)).forEach(o => { w(up, o.id + ":t0"); up = o.id + ":b0"; });
      const G1 = rail.find(o => o.k === "general"), D1 = rail.find(o => o.k === "difer");
      if (G1) { w(up, G1.id + ":t0"); up = G1.id + ":b0"; }
      if (D1) { w(up, D1.id + ":t0"); up = D1.id + ":b0"; }
      rail.filter(o => ["voltimetro", "piloto", "monitor", "dps", "fuente"].includes(o.k)).forEach(o => w(up, o.id + ":t0"));
      const ramas = rail.filter(o => ["termo", "fusible", "guardamotor", "contactor"].includes(o.k));
      ramas.forEach(o => w(up, o.id + ":t0"));
      f.items.filter(o => o.z === "c").forEach((c, i) => { const r = ramas[i] || ramas[ramas.length - 1]; if (r) w(r.id + ":b0", c.id + ":t0"); });
      todo(); aviso("Cableado armado");
    }

    /* Eventos de la caja y la paleta */
    el.addEventListener("change", e => {
      const id = e.target.id;
      if (id === "fr-pre") { const p = PRESETS.find(q => q[0] === e.target.value); f.preset = p[0]; if (p[2]) aplicar(p[2], p[3]); else pintarCab(); }
      else if (id === "fr-fil") aplicar(+e.target.value || 1, f.mpf, true);
      else if (id === "fr-mpf") aplicar(f.filas, +e.target.value || 12, true);
      else if (id === "fr-an") { f.ancho = e.target.value.trim(); guardar(); info(); }
      else if (id === "fr-al") { f.alto = e.target.value.trim(); guardar(); info(); }
      else if (id === "fr-pr") { f.prof = e.target.value.trim(); guardar(); info(); }
    });
    el.addEventListener("input", e => { if (e.target.id === "fr-z") { zoom = +e.target.value; svg.style.width = zoom + "%"; try { localStorage.setItem("fr-zoom", zoom); } catch (x) { } } });
    el.addEventListener("click", e => {
      const m = e.target.closest("[data-modo]"); if (m) return cambiarModo(m.dataset.modo);
      if (e.target.id === "fr-auto") return cablear();
      if (e.target.id === "fr-quitarc") { f.cables = []; todo(); }
    });
    function aplicar(filas, mpf, manual) {
      filas = Math.max(1, Math.min(6, filas)); mpf = Math.max(4, Math.min(36, mpf));
      if (f.items.some(o => enRiel(o) && (o.f >= filas || o.x + modOf(o) > mpf))) { aviso("Hay dispositivos fuera de esa medida. Movelos o quitalos primero."); pintarCab(); return; }
      f.filas = filas; f.mpf = mpf; if (manual) f.preset = (PRESETS.find(p => p[2] === filas && p[3] === mpf) || ["x"])[0]; f.ancho = ""; f.alto = ""; todo();
    }
    $("fr-pal").addEventListener("click", e => { const b = e.target.closest(".fr-tile"); if (b) agregar(b.dataset.k); });
    $("fr-pal").addEventListener("dragstart", e => { const b = e.target.closest(".fr-tile"); if (b) e.dataTransfer.setData("text/fr", b.dataset.k); });
    const aPunto = (cx, cy) => { const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
    const celda = (p, mod, offX) => { const g = G(f), fila = Math.max(0, Math.min(f.filas - 1, Math.floor((p.y - TOP - MY) / PASO))); const x = Math.round((p.x - g.OX - MX - offX) / M); return { f: fila, x: Math.max(0, Math.min(f.mpf - mod, x)) }; };
    svg.addEventListener("dragover", e => e.preventDefault());
    svg.addEventListener("drop", e => { e.preventDefault(); const k = e.dataTransfer.getData("text/fr"); if (!k || modo === "sim" || K[k].z) return; const it = { k, p: Object.assign({}, K[k].def) }, m = modOf(it), p = aPunto(e.clientX, e.clientY), c = celda(p, m, m * M / 2); agregar(k, c.f, c.x); });

    /* Puntero: terminales, cables, dispositivos */
    function crearCable(a, b) {
      const ia = a.split(":")[0], ib = b.split(":")[0], ka = (f.items.find(o => o.id === ia) || {}).k;
      if (a === b || (ia === ib && CLS[ka] !== "junc")) return aviso("Unilo con otro dispositivo");
      if (f.cables.some(c => (c.a === a && c.b === b) || (c.a === b && c.b === a))) return;
      f.cables.push({ id: uid(), a, b }); selC = null; todo();
    }
    svg.addEventListener("pointerdown", e => {
      const term = e.target.closest(".fr-term");
      if (term && modo === "armar") { const id = term.dataset.term; if (!previa) { previa = id; pintar(); } else { const a = previa; previa = null; crearCable(a, id); } return; }
      const cab = e.target.closest("[data-cable]");
      if (cab && modo === "armar") { selC = cab.dataset.cable; sel = null; prop(); pintar(); return; }
      const g = e.target.closest(".fr-dev");
      if (!g) { if (previa) { previa = null; pintar(); } if (sel || selC) { sel = null; selC = null; pintar(); prop(); panelSim(); } return; }
      const o = f.items.find(i => i.id === g.dataset.id); if (!o) return;
      if (modo === "sim") {
        sel = o.id; const c = CLS[o.k];
        if (c === "prot") { if (sim.disparo[o.id]) { delete sim.disparo[o.id]; sim.cerrado[o.id] = true; sim.log.push({ t: sim.t, m: `Se rearmó ${K[o.k].d(o.p)}.` }); } else sim.cerrado[o.id] = sim.cerrado[o.id] === false; }
        else if (c === "sw") sim.cerrado[o.id] = sim.cerrado[o.id] === false;
        ultimaSig = ""; tick(true); panelSim(); return;
      }
      selC = null; sel = o.id; prop();
      if (!enRiel(o)) { pintar(); return; }
      const p = aPunto(e.clientX, e.clientY), gg = G(f);
      arrastre = { it: o, off: p.x - (gg.OX + MX + o.x * M), mov: false, ghost: null }; svg.setPointerCapture(e.pointerId); pintar();
    });
    svg.addEventListener("pointermove", e => {
      if (previa) { const prev = svg.querySelector("#fr-prev"), a = svg._TM && svg._TM.get(previa); if (prev && a) { const p = aPunto(e.clientX, e.clientY); prev.setAttribute("d", camino(a.x, p.x, a.y, p.y)); } return; }
      if (!arrastre) return; const p = aPunto(e.clientX, e.clientY), m = modOf(arrastre.it);
      const c = celda(p, m, arrastre.off); arrastre.mov = true; arrastre.ghost = { f: c.f, x: c.x, ok: libre(f, c.f, c.x, m, arrastre.it.id) };
      const gg = G(f); let ghost = svg.querySelector("#fr-ghost"); if (!ghost) { ghost = document.createElementNS("http://www.w3.org/2000/svg", "rect"); ghost.id = "fr-ghost"; ghost.setAttribute("rx", "2.6"); ghost.setAttribute("stroke-width", "1.2"); ghost.setAttribute("stroke-dasharray", "3 2"); svg.appendChild(ghost); }
      ghost.setAttribute("x", gg.OX + MX + c.x * M); ghost.setAttribute("y", TOP + MY + c.f * PASO + PASO / 2 - H / 2); ghost.setAttribute("width", m * M); ghost.setAttribute("height", H);
      ghost.setAttribute("fill", arrastre.ghost.ok ? "rgba(249,160,27,.22)" : "rgba(194,59,44,.25)"); ghost.setAttribute("stroke", arrastre.ghost.ok ? "#f9a01b" : "#c23b2c");
    });
    const soltar = () => {
      if (!arrastre) return; const a = arrastre; arrastre = null;
      if (a.mov && a.ghost && a.ghost.ok && (a.ghost.f !== a.it.f || a.ghost.x !== a.it.x)) { a.it.f = a.ghost.f; a.it.x = a.ghost.x; todo(); } else pintar();
    };
    svg.addEventListener("pointerup", soltar); svg.addEventListener("pointercancel", soltar);
    document.addEventListener("keydown", function h(e) {
      if (!document.body.contains(el)) return document.removeEventListener("keydown", h);
      const libreTeclado = !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName);
      if (e.key === "Escape" && previa) { previa = null; pintar(); }
      if ((e.key === "Delete" || e.key === "Backspace") && libreTeclado && modo === "armar") { if (selC) { f.cables = f.cables.filter(c => c.id !== selC); selC = null; todo(); e.preventDefault(); } else if (sel) { e.preventDefault(); quitar(sel); } }
    });
    el._exportar = () => {
      const s = svg.outerHTML.replace(/class="[^"]*"/g, "").replace(/style="[^"]*"/, "").replace("<svg ", '<svg width="1600" ');
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(['<?xml version="1.0" encoding="UTF-8"?>' + s], { type: "image/svg+xml" })); a.download = (tb.nombre || "tablero").replace(/[^\w-]+/g, "-") + "-frente.svg"; a.click();
    };
    todo();
    return { exportar: el._exportar, _tick: tick, _modo: cambiarModo, _st: () => ({ f, sim, R }) };
  }
  window.Frente = { montar, contar: tb => (tb && tb.frente ? tb.frente.items.length : 0) };
})();
