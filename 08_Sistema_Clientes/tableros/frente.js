/* Diseñador del frente de un tablero: caja, rieles DIN y dispositivos dibujados a escala.
   Un módulo DIN = 18 mm. Se usa desde el sistema de clientes: Frente.montar(elemento, tablero, alCambiar). */
(function () {
  "use strict";
  const M = 18, H = 88, PASO = 132, MX = 26, MY = 30;

  /* ---------- Dibujos de los dispositivos (vista frontal, en mm) ---------- */
  const t = (x, y, s, txt, o) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" font-family="Archivo,Arial,sans-serif" ${o || 'fill="#222"'}>${txt}</text>`;
  const cuerpo = (w, base) => `<rect x=".4" y="0" width="${w - .8}" height="${H}" rx="2.6" fill="${base || "#f3f3ef"}" stroke="#7d7f78" stroke-width=".8"/>` +
    `<rect x=".4" y="0" width="${w - .8}" height="11" rx="2.6" fill="#dbdcd6" stroke="#7d7f78" stroke-width=".8"/><rect x=".4" y="${H - 11}" width="${w - .8}" height="11" rx="2.6" fill="#dbdcd6" stroke="#7d7f78" stroke-width=".8"/>`;
  const palancas = (w, y, h, n) => {
    let s = `<rect x="3.4" y="${y}" width="${w - 6.8}" height="${h}" rx="2" fill="#2a2a2a"/>`;
    for (let i = 0; i < n; i++) s += `<rect x="${i * M + 5}" y="${y + 3}" width="8" height="${h * .5}" rx="1.4" fill="#4d4d4d" stroke="#0f0f0f" stroke-width=".5"/><rect x="${i * M + 6.6}" y="${y + 5}" width="4.8" height="1.2" fill="#d8d8d8"/>`;
    return s;
  };
  const lcd = (w, y, h, txt, fg, sub) => `<rect x="3" y="${y}" width="${w - 6}" height="${h}" rx="1.6" fill="#101a14" stroke="#4a4a4a" stroke-width=".6"/>` + t(w / 2 - (sub ? 3 : 0), y + h * .7, h * .5, txt, `fill="${fg}" font-family="Consolas,monospace" font-weight="700"`) + (sub ? t(w - 6, y + h * .72, h * .3, sub, `fill="${fg}"`) : "");
  const D = {
    termo: (w, p) => cuerpo(w) + t(w / 2, 8, 5.4, `${p.curva}${p.amp}`, 'fill="#222" font-weight="700"') + palancas(w, 24, 36, w / M) + t(w / 2, 72, 4.4, `${p.amp} A`, 'fill="#55574f"'),
    difer: (w, p) => cuerpo(w) + t(w / 2, 8, 5, `ID ${p.amp}A`, 'fill="#222" font-weight="700"') + palancas(w, 22, 28, w / M) +
      `<rect x="${w - 14}" y="55" width="10" height="9" rx="1.6" fill="#2563eb" stroke="#173a8a" stroke-width=".5"/>` + t(w - 9, 61.6, 5, "T", 'fill="#fff" font-weight="700"') + t(w / 2 - 3, 62, 4.4, `${p.sens} mA`, 'fill="#55574f"'),
    general: (w, p) => cuerpo(w, "#eeeee9") + t(w / 2, 8, 5.4, `${p.amp} A`, 'fill="#222" font-weight="700"') + `<rect x="3.4" y="22" width="${w - 6.8}" height="42" rx="2" fill="#2a2a2a"/><rect x="${w / 2 - 6}" y="26" width="12" height="20" rx="1.6" fill="#c23b2c" stroke="#0f0f0f" stroke-width=".5"/>` + t(w / 2, 60, 4.5, "I  -  O", 'fill="#e6e6e0"') + t(w / 2, 74, 4.4, "General", 'fill="#55574f"'),
    dps: (w, p) => cuerpo(w) + t(w / 2, 8, 5, "DPS", 'fill="#222" font-weight="700"') + `<rect x="4" y="30" width="${w - 8}" height="18" rx="2" fill="#2f8a4c"/>` + t(w / 2, 42, 6, "OK", 'fill="#fff" font-weight="700"') + t(w / 2, 66, 4.4, "Tipo 2", 'fill="#55574f"'),
    guardamotor: (w, p) => cuerpo(w) + t(w / 2, 8, 5, "GM", 'fill="#222" font-weight="700"') + `<circle cx="${w / 2}" cy="36" r="12" fill="#222" stroke="#666" stroke-width="1"/><line x1="${w / 2}" y1="36" x2="${w / 2 + 6}" y2="29" stroke="#fff" stroke-width="1.6"/>` +
      `<rect x="${w / 2 - 15}" y="54" width="13" height="10" rx="1.6" fill="#2f8a4c"/><rect x="${w / 2 + 2}" y="54" width="13" height="10" rx="1.6" fill="#c23b2c"/>` + t(w / 2 - 8.5, 61.5, 5, "I", 'fill="#fff" font-weight="700"') + t(w / 2 + 8.5, 61.5, 5, "O", 'fill="#fff" font-weight="700"') + t(w / 2, 76, 4.4, `${p.rango || ""} A`, 'fill="#55574f"'),
    fusible: (w, p) => cuerpo(w) + `<rect x="3.4" y="24" width="${w - 6.8}" height="38" rx="2" fill="#e6e6df" stroke="#9a9b95" stroke-width=".6"/><rect x="${w / 2 - 2}" y="28" width="4" height="30" rx="1.4" fill="#b7b8b2"/>` + t(w / 2, 8, 5, `${p.amp} A`, 'fill="#222" font-weight="700"') + t(w / 2, 74, 4.2, "Fusible", 'fill="#55574f"'),
    voltimetro: (w) => cuerpo(w, "#ececE8") + lcd(w, 22, 28, "230", "#7CFF9B", "V") + `<circle cx="${w / 3}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><circle cx="${w * .66}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>` + t(w / 2, 8, 5, "Voltímetro", 'fill="#222" font-weight="700"'),
    amperimetro: (w) => cuerpo(w, "#ececE8") + lcd(w, 22, 28, "16.4", "#ffb84d", "A") + `<circle cx="${w / 3}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><circle cx="${w * .66}" cy="62" r="3" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>` + t(w / 2, 8, 5, "Amperímetro", 'fill="#222" font-weight="700"'),
    medidor1: (w) => cuerpo(w, "#f1f1ed") + t(w / 2, 8, 5, "Medidor 1~", 'fill="#222" font-weight="700"') + `<rect x="6" y="18" width="${w - 12}" height="22" rx="1.6" fill="#cbd9c4" stroke="#777" stroke-width=".6"/>` + t(w / 2, 32, 8, "0012345.6", 'fill="#1d2b1d" font-family="Consolas,monospace" font-weight="700"') + t(w - 12, 38, 4, "kWh", 'fill="#1d2b1d"') +
      t(w / 2, 52, 4.6, "230 V  ~  50 Hz", 'fill="#55574f"') + `<circle cx="${w - 8}" cy="46" r="1.8" fill="#c23b2c"/><rect x="${w / 2 - 16}" y="62" width="14" height="8" rx="1.4" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><rect x="${w / 2 + 2}" y="62" width="14" height="8" rx="1.4" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>`,
    medidor3: (w) => cuerpo(w, "#f1f1ed") + t(w / 2, 8, 5, "Medidor 3~", 'fill="#222" font-weight="700"') + `<rect x="6" y="18" width="${w - 12}" height="22" rx="1.6" fill="#cbd9c4" stroke="#777" stroke-width=".6"/>` + t(w / 2, 32, 9, "0012345.6", 'fill="#1d2b1d" font-family="Consolas,monospace" font-weight="700"') + t(w - 12, 38, 4, "kWh", 'fill="#1d2b1d"') +
      t(w / 2, 52, 4.6, "3 x 230/400 V", 'fill="#55574f"') + ["L1", "L2", "L3"].map((x, i) => `<circle cx="${w / 2 - 14 + i * 14}" cy="60" r="1.8" fill="#2fe06b"/>` + t(w / 2 - 14 + i * 14, 67, 3.6, x, 'fill="#55574f"')).join("") + `<rect x="${w / 2 - 16}" y="70" width="14" height="6" rx="1.2" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><rect x="${w / 2 + 2}" y="70" width="14" height="6" rx="1.2" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>`,
    rele: (w, p) => cuerpo(w, "#e8edf5") + `<circle cx="${w / 2}" cy="20" r="2.4" fill="#2fe06b"/><rect x="3.6" y="28" width="${w - 7.2}" height="24" rx="1.6" fill="#2e5aac" stroke="#1b3a74" stroke-width=".6"/>` + t(w / 2, 43, 4.2, "RELÉ", 'fill="#fff" font-weight="700"') + t(w / 2, 62, 3.8, "A1  A2", 'fill="#55574f"') + t(w / 2, 70, 3.8, p.bobina, 'fill="#55574f"'),
    contactor: (w, p) => cuerpo(w, "#d9dad5") + t(w / 2, 8, 4.8, `${p.polos}P ${p.amp}A`, 'fill="#222" font-weight="700"') + `<rect x="${w / 2 - 8}" y="28" width="16" height="14" rx="1.8" fill="#3a3a3a" stroke="#111" stroke-width=".5"/>` + t(w / 2, 52, 4, "A1   A2", 'fill="#222"') + t(w / 2, 62, 3.8, p.bobina, 'fill="#55574f"') + t(w / 2, 74, 4.2, "Contactor", 'fill="#55574f"'),
    temporizador: (w) => cuerpo(w, "#f1f1ed") + `<circle cx="${w / 2}" cy="38" r="11" fill="#fafaf7" stroke="#333" stroke-width="1"/>` + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${w / 2 + 8.4 * Math.sin(a)}" y1="${38 - 8.4 * Math.cos(a)}" x2="${w / 2 + 10 * Math.sin(a)}" y2="${38 - 10 * Math.cos(a)}" stroke="#333" stroke-width=".6"/>` }).join("") +
      `<line x1="${w / 2}" y1="38" x2="${w / 2 + 6}" y2="33" stroke="#c23b2c" stroke-width="1.4"/><circle cx="${w - 8}" cy="18" r="2" fill="#f59e0b"/>` + t(w / 2, 8, 4.6, "Temporizador", 'fill="#222" font-weight="700"') + t(w / 2, 62, 4.2, "0 - 10 min", 'fill="#55574f"'),
    horario: (w) => cuerpo(w, "#f1f1ed") + t(w / 2, 8, 4.8, "Horario", 'fill="#222" font-weight="700"') + lcd(w, 17, 17, "12:30", "#7CFF9B") + `<circle cx="${w / 2}" cy="52" r="9" fill="#fafaf7" stroke="#333" stroke-width="1"/><line x1="${w / 2}" y1="52" x2="${w / 2}" y2="45" stroke="#333" stroke-width="1.2"/><line x1="${w / 2}" y1="52" x2="${w / 2 + 5}" y2="55" stroke="#c23b2c" stroke-width="1.2"/>` + t(w / 2, 74, 4.2, "Prog. diario", 'fill="#55574f"'),
    relewifi: (w) => cuerpo(w, "#fbfbf9") + `<circle cx="${w / 2}" cy="20" r="2.4" fill="#3b82f6"/>` + [14, 9, 4].map(r => `<path d="M ${w / 2 - r} ${44} A ${r} ${r} 0 0 1 ${w / 2 + r} ${44}" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>`).join("") + `<circle cx="${w / 2}" cy="47" r="1.8" fill="#2563eb"/>` + t(w / 2, 8, 4.8, "Relé WiFi", 'fill="#222" font-weight="700"') + t(w / 2, 64, 4.2, "1 canal · 16 A", 'fill="#55574f"'),
    fuente: (w, p) => cuerpo(w, "#dfe0db") + [18, 22, 26, 30].map(y => `<line x1="8" y1="${y}" x2="${w - 8}" y2="${y}" stroke="#9a9b95" stroke-width="1"/>`).join("") + t(w / 2, 8, 5, "Fuente", 'fill="#222" font-weight="700"') + t(w / 2, 48, 8, p.salida, 'fill="#222" font-weight="700"') + `<circle cx="${w - 9}" cy="58" r="2" fill="#2fe06b"/>` + t(w / 2, 74, 4.2, "Salida DC", 'fill="#55574f"'),
    monitor: (w) => cuerpo(w, "#e8edf2") + t(w / 2, 8, 4.4, "Falta de fase", 'fill="#222" font-weight="700"') + ["L1", "L2", "L3"].map((x, i) => `<circle cx="${w / 2 - 10 + i * 10}" cy="30" r="2.4" fill="#2fe06b"/>` + t(w / 2 - 10 + i * 10, 40, 3.8, x, 'fill="#55574f"')).join("") + `<rect x="5" y="50" width="${w - 10}" height="12" rx="1.6" fill="#c9cbc5"/>` + t(w / 2, 72, 4.2, "Monitor", 'fill="#55574f"'),
    piloto: (w, p) => cuerpo(w) + `<circle cx="${w / 2}" cy="40" r="7.4" fill="${({ rojo: "#d6342a", verde: "#2fb15a", "ámbar": "#f0a30a", azul: "#2563eb", blanco: "#f4f4f4" })[p.color] || "#d6342a"}" stroke="#222" stroke-width="1"/><circle cx="${w / 2 - 2.4}" cy="37.4" r="2" fill="#fff" opacity=".55"/>` + t(w / 2, 8, 4.4, "Piloto", 'fill="#222" font-weight="700"'),
    bornera: (w) => { const n = Math.round(w / 9); let s = ""; for (let i = 0; i < n; i++) s += `<rect x="${i * 9 + .5}" y="18" width="8" height="54" rx="1.2" fill="#c9cbc5" stroke="#7d7f78" stroke-width=".6"/><circle cx="${i * 9 + 4.5}" cy="28" r="2.4" fill="#8d8f88"/><line x1="${i * 9 + 3}" y1="28" x2="${i * 9 + 6}" y2="28" stroke="#444" stroke-width=".7"/><rect x="${i * 9 + 2}" y="42" width="5" height="9" rx="1" fill="#6b6d66"/><circle cx="${i * 9 + 4.5}" cy="62" r="2.4" fill="#8d8f88"/>`; return s },
    barraN: (w) => `<rect x=".4" y="26" width="${w - .8}" height="36" rx="2" fill="#3b7fc4" stroke="#215c96" stroke-width=".8"/>` + Array.from({ length: Math.round(w / 6) }, (_, i) => `<circle cx="${3 + i * 6}" cy="38" r="1.9" fill="#173f6b"/><circle cx="${3 + i * 6}" cy="52" r="1.9" fill="#173f6b"/>`).join("") + t(w / 2, 72, 5, "N", 'fill="#215c96" font-weight="700"'),
    barraT: (w) => `<rect x=".4" y="26" width="${w - .8}" height="36" rx="2" fill="#2f8a4c" stroke="#1d5f33" stroke-width=".8"/>` + Array.from({ length: Math.round(w / 8) }, (_, i) => `<rect x="${i * 8 + 1}" y="26" width="4" height="36" fill="#f0c419" opacity=".9"/>`).join("") + Array.from({ length: Math.round(w / 6) }, (_, i) => `<circle cx="${3 + i * 6}" cy="44" r="1.9" fill="#1d3b27"/>`).join("") + t(w / 2, 72, 5, "PE", 'fill="#1d5f33" font-weight="700"'),
    reserva: (w) => `<rect x="1" y="6" width="${w - 2}" height="${H - 12}" rx="2.4" fill="none" stroke="#9a9b95" stroke-width="1" stroke-dasharray="3 2.4"/>` + t(w / 2, 48, 5, "libre", 'fill="#9a9b95"')
  };

  /* ---------- Catálogo ---------- */
  const AMP_T = ["2", "4", "6", "10", "16", "20", "25", "32", "40", "50", "63"], AMP_G = ["25", "32", "40", "63", "80", "100", "125"], AMP_C = ["16", "25", "40", "63"];
  const POL = [1, 2, 3, 4];
  const K = {
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
  const CAT = [["prot", "Protecciones"], ["med", "Medición"], ["ctl", "Control"], ["con", "Conexión"], ["otro", "Otros"]];
  const OPC = { polos: ["Polos", k => k.polos], amp: ["Corriente (A)", k => (k === K.general ? AMP_G : k === K.contactor ? AMP_C : AMP_T)], curva: ["Curva", () => ["B", "C", "D"]], sens: ["Sensibilidad (mA)", () => ["10", "30", "100", "300"]], bobina: ["Bobina", () => ["12 V", "24 V", "110 V", "220 V"]], salida: ["Salida", () => ["12 V DC", "24 V DC", "48 V DC"]], color: ["Color", () => ["rojo", "verde", "ámbar", "azul", "blanco"]] };
  const PRESETS = [["12", "12 módulos (1 fila de 12)", 1, 12], ["18", "18 módulos (1 fila de 18)", 1, 18], ["24", "24 módulos (2 filas de 12)", 2, 12], ["36", "36 módulos (3 filas de 12)", 3, 12], ["48", "48 módulos (2 filas de 24)", 2, 24], ["72", "72 módulos (3 filas de 24)", 3, 24], ["x", "Personalizado", 0, 0]];

  const modOf = it => Math.max(1, Math.round(K[it.k].mod(it.p)));
  const svgDe = (it, escala) => { const w = modOf(it) * M; return `<g>${D[it.k](w, it.p)}</g>`; };

  /* ---------- Estado ---------- */
  function iniciar(tb) {
    if (!tb.frente) tb.frente = { preset: "36", filas: 3, mpf: 12, ancho: "", alto: "", prof: "110", items: [] };
    const f = tb.frente; f.items = f.items || [];
    return f;
  }
  const libre = (f, fila, x, mod, ignorar) => {
    if (fila < 0 || fila >= f.filas || x < 0 || x + mod > f.mpf) return false;
    return !f.items.some(o => o.id !== ignorar && o.f === fila && x < o.x + modOf(o) && o.x < x + mod);
  };
  const hueco = (f, mod, desde) => {
    for (let i = 0; i < f.filas; i++) { const fi = ((desde || 0) + i) % f.filas; for (let x = 0; x + mod <= f.mpf; x++) if (libre(f, fi, x, mod)) return { f: fi, x }; }
    return null;
  };
  const uid = () => Math.random().toString(36).slice(2, 9);
  const medidas = f => ({ ancho: f.ancho || String(Math.round(f.mpf * M + 90)), alto: f.alto || String(Math.round(f.filas * PASO * .96 + 80)), prof: f.prof || "110" });
  const usados = f => f.items.filter(i => i.k !== "reserva").reduce((a, i) => a + modOf(i), 0);

  /* ---------- Interfaz ---------- */
  const CSS = `.fr{display:grid;grid-template-columns:230px minmax(0,1fr);gap:16px;align-items:start}
  .fr-pal{background:#f7f7f3;border:1px solid #c9cbc4;border-radius:20px;padding:12px;max-height:calc(100vh - 220px);overflow:auto;position:sticky;top:12px}
  .fr-pal h4{margin:10px 4px 6px;font-size:.74rem;color:#55574f;font-weight:800}
  .fr-pal h4:first-child{margin-top:2px}
  .fr-tiles{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .fr-tile{background:#fff;border:1px solid #dcded6;border-radius:12px;padding:6px 4px 5px;text-align:center;cursor:grab;display:flex;flex-direction:column;align-items:center;gap:2px;font:inherit;color:#1f201d}
  .fr-tile:hover{border-color:#f9a01b;box-shadow:0 0 0 2px rgba(249,160,27,.35)}
  .fr-tile svg{width:100%;height:58px}
  .fr-tile span{font-size:.7rem;font-weight:700;line-height:1.1}
  .fr-cab{display:flex;gap:10px;flex-wrap:wrap;align-items:end;margin-bottom:10px}
  .fr-cab label{margin:0 0 3px .2em}
  .fr-cab input,.fr-cab select{width:auto;min-width:0}
  .fr-cab input{width:84px}
  .fr-info{font-size:.86rem;color:#55574f;margin:0 0 8px}
  .fr-lienzo{background:#e3e4df;border-radius:20px;padding:10px;border:1px solid #c9cbc4}
  .fr-lienzo svg{display:block;width:100%;height:auto;touch-action:none;user-select:none}
  .fr-dev{cursor:grab}.fr-dev.sel>rect:first-child{stroke:#f9a01b;stroke-width:1.6}
  .fr-sel{outline:2px solid #f9a01b;outline-offset:-1px}
  .fr-prop{background:#f7f7f3;border:1px solid #c9cbc4;border-radius:20px;padding:14px;margin-top:12px}
  .fr-prop .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
  .fr-lista{margin-top:12px;background:#f7f7f3;border:1px solid #c9cbc4;border-radius:20px;padding:14px}
  .fr-lista table{width:100%;border-collapse:collapse;font-size:.9rem}
  .fr-lista td{padding:6px 8px;border-bottom:1px solid #e3e4de}
  .fr-lista td:last-child{text-align:right;font-weight:800;width:60px}
  @media print{.fr-pal,.fr-cab,.fr-prop{display:none}.fr{display:block}.fr-lienzo,.fr-lista{border:0;background:#fff}}
  @media (max-width:900px){.fr{grid-template-columns:1fr}.fr-pal{position:static;max-height:none}}`;

  function montar(el, tb, alCambiar) {
    if (!document.getElementById("fr-css")) { const s = document.createElement("style"); s.id = "fr-css"; s.textContent = CSS; document.head.appendChild(s); }
    const f = iniciar(tb); let sel = null, arrastre = null;
    const guardar = () => { alCambiar && alCambiar(); };
    const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    el.innerHTML = `<div class="fr"><aside class="fr-pal" id="fr-pal"></aside><div><div class="fr-cab" id="fr-cab"></div><p class="fr-info" id="fr-info"></p><div class="fr-lienzo"><svg id="fr-svg" xmlns="http://www.w3.org/2000/svg"></svg></div><div class="fr-prop" id="fr-prop"></div><div class="fr-lista" id="fr-lista"></div></div></div>`;
    const $ = id => el.querySelector("#" + id), svg = $("fr-svg");

    /* Paleta */
    $("fr-pal").innerHTML = CAT.map(([id, nombre]) => `<h4>${nombre}</h4><div class="fr-tiles">${Object.keys(K).filter(k => K[k].cat === id).map(k => {
      const it = { k, p: Object.assign({}, K[k].def) }, w = modOf(it) * M;
      return `<button type="button" class="fr-tile" draggable="true" data-k="${k}" title="Agregar ${esc(K[k].n)}"><svg viewBox="-2 -2 ${w + 4} ${H + 4}" preserveAspectRatio="xMidYMid meet">${svgDe(it)}</svg><span>${esc(K[k].n)}</span></button>`;
    }).join("")}</div>`).join("");

    /* Cabecera de la caja */
    function pintarCab() {
      const m = medidas(f);
      $("fr-cab").innerHTML = `<div><label for="fr-pre">Caja</label><select id="fr-pre">${PRESETS.map(p => `<option value="${p[0]}"${p[0] === f.preset ? " selected" : ""}>${p[1]}</option>`).join("")}</select></div>
      <div><label for="fr-fil">Filas</label><input id="fr-fil" type="number" min="1" max="6" value="${f.filas}"></div>
      <div><label for="fr-mpf">Módulos por fila</label><input id="fr-mpf" type="number" min="4" max="36" value="${f.mpf}"></div>
      <div><label for="fr-an">Ancho (mm)</label><input id="fr-an" inputmode="numeric" value="${esc(f.ancho)}" placeholder="${m.ancho}"></div>
      <div><label for="fr-al">Alto (mm)</label><input id="fr-al" inputmode="numeric" value="${esc(f.alto)}" placeholder="${m.alto}"></div>
      <div><label for="fr-pr">Profundidad (mm)</label><input id="fr-pr" inputmode="numeric" value="${esc(f.prof)}" placeholder="110"></div>`;
    }
    function info() {
      const m = medidas(f), u = usados(f), tot = f.filas * f.mpf;
      $("fr-info").textContent = `Caja de ${tot} módulos (${f.filas} ${f.filas === 1 ? "fila" : "filas"} de ${f.mpf}) · ${m.ancho} x ${m.alto} x ${m.prof} mm · ocupados ${u} de ${tot} módulos (${tot ? Math.round(u / tot * 100) : 0} %)`;
    }

    /* Lienzo */
    function pintar() {
      const W = f.mpf * M + 2 * MX, Hh = f.filas * PASO + 2 * MY;
      svg.setAttribute("viewBox", `0 0 ${W} ${Hh}`);
      let s = `<defs><linearGradient id="fr-riel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe1e4"/><stop offset=".5" stop-color="#b9bcc2"/><stop offset="1" stop-color="#d4d6da"/></linearGradient></defs>`;
      s += `<rect x="1" y="1" width="${W - 2}" height="${Hh - 2}" rx="7" fill="#f2f2ee" stroke="#8d8f88" stroke-width="1.6"/><rect x="9" y="9" width="${W - 18}" height="${Hh - 18}" rx="4" fill="#eceae4" stroke="#c9cbc4" stroke-width=".8"/>`;
      for (let r = 0; r < f.filas; r++) {
        const cy = MY + r * PASO + PASO / 2, rx = MX - 5, rw = f.mpf * M + 10;
        s += `<rect x="${rx}" y="${cy - 17.5}" width="${rw}" height="35" fill="url(#fr-riel)" stroke="#8d8f88" stroke-width=".6"/>`;
        for (let i = 0; i < f.mpf * 2; i++) s += `<rect x="${MX + 3 + i * 9}" y="${cy - 2.2}" width="5" height="4.4" rx="2.2" fill="#8d8f88" opacity=".55"/>`;
        for (let i = 0; i <= f.mpf; i++) s += `<line x1="${MX + i * M}" y1="${cy - H / 2 - 4}" x2="${MX + i * M}" y2="${cy + H / 2 + 8}" stroke="#bdbeb8" stroke-width=".35" stroke-dasharray="1.2 2.4"/>`;
        const ocup = f.items.filter(o => o.f === r && o.k !== "reserva").reduce((a, o) => a + modOf(o), 0);
        s += `<text x="${MX}" y="${cy - H / 2 - 8}" font-size="6" fill="#55574f" font-family="Archivo,Arial,sans-serif" font-weight="700">Fila ${r + 1} · ${ocup}/${f.mpf} módulos</text>`;
      }
      f.items.forEach(o => {
        const w = modOf(o) * M, x = MX + o.x * M, y = MY + o.f * PASO + PASO / 2 - H / 2;
        s += `<g class="fr-dev${o.id === sel ? " sel" : ""}" data-id="${o.id}" transform="translate(${x},${y})">${D[o.k](w, o.p)}<rect x="0" y="0" width="${w}" height="${H}" fill="transparent"/>${o.rot ? `<rect x="${w / 2 - Math.min(w / 2, 22)}" y="${H + 3}" width="${Math.min(w, 44)}" height="9" rx="1.6" fill="#fff" stroke="#9a9b95" stroke-width=".5"/><text x="${w / 2}" y="${H + 9.6}" font-size="5.2" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="700" fill="#1f201d">${esc(o.rot)}</text>` : ""}</g>`;
      });
      if (arrastre && arrastre.ghost) { const g = arrastre.ghost, w = modOf(arrastre.it) * M; s += `<rect x="${MX + g.x * M}" y="${MY + g.f * PASO + PASO / 2 - H / 2}" width="${w}" height="${H}" rx="2.6" fill="${g.ok ? "rgba(249,160,27,.22)" : "rgba(194,59,44,.25)"}" stroke="${g.ok ? "#f9a01b" : "#c23b2c"}" stroke-width="1.2" stroke-dasharray="3 2"/>`; }
      svg.innerHTML = s;
    }
    function lista() {
      const c = {};
      f.items.filter(o => !K[o.k].sinLista).forEach(o => { const d = K[o.k].d(o.p); c[d] = (c[d] || 0) + 1; });
      const ks = Object.keys(c).sort();
      $("fr-lista").innerHTML = `<h3 style="margin:0 0 8px">Lista de materiales</h3>` + (ks.length ? `<table>${ks.map(k => `<tr><td>${esc(k)}</td><td>${c[k]}</td></tr>`).join("")}</table>` : `<p style="margin:0;color:#55574f">Agregá dispositivos desde el panel de la izquierda.</p>`);
    }
    function prop() {
      const o = f.items.find(i => i.id === sel), box = $("fr-prop");
      if (!o) { box.innerHTML = `<p style="margin:0;color:#55574f">Tocá un dispositivo para editarlo, o arrastralo para moverlo.</p>`; return; }
      const k = K[o.k];
      box.innerHTML = `<h3 style="margin:0 0 10px">${esc(k.n)}</h3><div class="g"><div><label for="fp-rot">Rótulo (circuito)</label><input id="fp-rot" value="${esc(o.rot || "")}" placeholder="Luces, Tomas…"></div>` +
        k.campos.map(c => {
          if (c === "n") return `<div><label for="fp-n">Módulos</label><input id="fp-n" type="number" min="1" max="${k.nmax || 12}" value="${o.p.n}"></div>`;
          if (c === "rango") return `<div><label for="fp-rango">Rango (A)</label><input id="fp-rango" value="${esc(o.p.rango)}"></div>`;
          const [l, op] = OPC[c], lst = op(k);
          return `<div><label for="fp-${c}">${l}</label><select id="fp-${c}">${lst.map(v => `<option value="${v}"${String(v) === String(o.p[c]) ? " selected" : ""}>${v}</option>`).join("")}</select></div>`;
        }).join("") + `</div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn chico claro" id="fp-dup">Duplicar</button><button type="button" class="btn chico peligro" id="fp-del">Quitar</button></div>`;
      const cambiar = (clave, valor) => {
        const prev = JSON.stringify(o.p), antes = modOf(o);
        if (clave === "n") o.p.n = Math.max(1, Math.min(k.nmax || 12, +valor || 1)); else if (clave === "polos") o.p.polos = +valor; else o.p[clave] = valor;
        if (modOf(o) !== antes && !libre(f, o.f, o.x, modOf(o), o.id)) { o.p = JSON.parse(prev); aviso("No hay lugar en esa fila para ese ancho"); prop(); return; }
        guardar(); pintar(); lista(); info();
      };
      box.querySelector("#fp-rot").oninput = e => { o.rot = e.target.value; guardar(); pintar(); };
      k.campos.forEach(c => { const i = box.querySelector("#fp-" + c); if (i) i.onchange = e => cambiar(c, e.target.value); });
      box.querySelector("#fp-del").onclick = () => quitar(o.id);
      box.querySelector("#fp-dup").onclick = () => { const h = hueco(f, modOf(o), o.f); if (!h) return aviso("No hay lugar libre en el tablero"); const n = { id: uid(), k: o.k, p: Object.assign({}, o.p), rot: o.rot, f: h.f, x: h.x }; f.items.push(n); sel = n.id; todo(); };
    }
    const aviso = t => { const x = document.createElement("div"); x.className = "toast"; x.textContent = t; document.body.appendChild(x); setTimeout(() => x.remove(), 2400); };
    function quitar(id) { f.items = f.items.filter(i => i.id !== id); if (sel === id) sel = null; todo(); }
    function todo() { guardar(); pintarCab(); info(); pintar(); lista(); prop(); }

    function agregar(k, fila, x) {
      const it = { id: uid(), k, p: Object.assign({}, K[k].def), rot: "" }, m = modOf(it);
      if (fila != null && libre(f, fila, x, m)) { it.f = fila; it.x = x; } else { const h = hueco(f, m, sel ? (f.items.find(i => i.id === sel) || {}).f || 0 : 0); if (!h) return aviso("No hay lugar libre en el tablero"); it.f = h.f; it.x = h.x; }
      f.items.push(it); sel = it.id; todo();
    }

    /* Caja: eventos */
    el.addEventListener("change", e => {
      const id = e.target.id;
      if (id === "fr-pre") { const p = PRESETS.find(q => q[0] === e.target.value); f.preset = p[0]; if (p[2]) { aplicar(p[2], p[3]) } else pintarCab(); }
      else if (id === "fr-fil") aplicar(+e.target.value || 1, f.mpf, true);
      else if (id === "fr-mpf") aplicar(f.filas, +e.target.value || 12, true);
      else if (id === "fr-an") { f.ancho = e.target.value.trim(); guardar(); info(); }
      else if (id === "fr-al") { f.alto = e.target.value.trim(); guardar(); info(); }
      else if (id === "fr-pr") { f.prof = e.target.value.trim(); guardar(); info(); }
    });
    function aplicar(filas, mpf, manual) {
      filas = Math.max(1, Math.min(6, filas)); mpf = Math.max(4, Math.min(36, mpf));
      if (f.items.some(o => o.f >= filas || o.x + modOf(o) > mpf)) { aviso("Hay dispositivos fuera de esa medida. Movelos o quitalos primero."); pintarCab(); return; }
      f.filas = filas; f.mpf = mpf; if (manual) f.preset = (PRESETS.find(p => p[2] === filas && p[3] === mpf) || ["x"])[0]; f.ancho = ""; f.alto = ""; todo();
    }

    /* Paleta: clic y arrastrar al lienzo */
    $("fr-pal").addEventListener("click", e => { const b = e.target.closest(".fr-tile"); if (b) agregar(b.dataset.k); });
    $("fr-pal").addEventListener("dragstart", e => { const b = e.target.closest(".fr-tile"); if (b) e.dataTransfer.setData("text/fr", b.dataset.k); });
    const aPuntoSvg = (cx, cy) => { const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
    const celda = (p, mod, offX) => { const fila = Math.max(0, Math.min(f.filas - 1, Math.floor((p.y - MY) / PASO))); const x = Math.round((p.x - MX - offX) / M); return { f: fila, x: Math.max(0, Math.min(f.mpf - mod, x)) }; };
    svg.addEventListener("dragover", e => e.preventDefault());
    svg.addEventListener("drop", e => { e.preventDefault(); const k = e.dataTransfer.getData("text/fr"); if (!k) return; const it = { k, p: Object.assign({}, K[k].def) }, m = modOf(it), p = aPuntoSvg(e.clientX, e.clientY), c = celda(p, m, m * M / 2); agregar(k, c.f, c.x); });

    /* Mover dispositivos con el mouse o el dedo */
    svg.addEventListener("pointerdown", e => {
      const g = e.target.closest(".fr-dev"); if (!g) { if (sel) { sel = null; pintar(); prop(); } return; }
      const o = f.items.find(i => i.id === g.dataset.id); if (!o) return;
      sel = o.id; prop();
      const p = aPuntoSvg(e.clientX, e.clientY);
      arrastre = { it: o, off: p.x - (MX + o.x * M), mov: false, ghost: null }; svg.setPointerCapture(e.pointerId); pintar();
    });
    svg.addEventListener("pointermove", e => {
      if (!arrastre) return; const p = aPuntoSvg(e.clientX, e.clientY), m = modOf(arrastre.it);
      const c = celda(p, m, arrastre.off); arrastre.mov = true; arrastre.ghost = { f: c.f, x: c.x, ok: libre(f, c.f, c.x, m, arrastre.it.id) }; pintar();
    });
    const soltar = () => {
      if (!arrastre) return; const a = arrastre; arrastre = null;
      if (a.mov && a.ghost && a.ghost.ok && (a.ghost.f !== a.it.f || a.ghost.x !== a.it.x)) { a.it.f = a.ghost.f; a.it.x = a.ghost.x; todo(); } else { pintar(); }
    };
    svg.addEventListener("pointerup", soltar); svg.addEventListener("pointercancel", soltar);
    document.addEventListener("keydown", function h(e) {
      if (!document.body.contains(el)) return document.removeEventListener("keydown", h);
      if ((e.key === "Delete" || e.key === "Backspace") && sel && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); quitar(sel); }
    });

    /* Exportar la imagen */
    el._exportar = () => {
      const s = svg.outerHTML.replace(/class="[^"]*"/g, "").replace("<svg ", '<svg width="1600" ');
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(['<?xml version="1.0" encoding="UTF-8"?>' + s], { type: "image/svg+xml" })); a.download = (tb.nombre || "tablero").replace(/[^\w-]+/g, "-") + "-frente.svg"; a.click();
    };
    todo();
    return { exportar: el._exportar };
  }
  window.Frente = { montar, contar: tb => (tb && tb.frente ? tb.frente.items.length : 0) };
})();
