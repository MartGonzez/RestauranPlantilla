document.getElementById("subtitulo-local").textContent = `${CONFIG_LOCAL.nombre} • Recepción automática`;

// Reloj en tiempo real
setInterval(() => {
  document.getElementById("reloj-vivo").textContent = new Date().toLocaleTimeString("es-CL");
}, 1000);

// Sonido de campana suave usando Web Audio API (sin archivos externos)
function sonarAlertaNuevoPedido() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Nota La5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Algunos navegadores bloquean audio si no hubo clic previo en la pestaña
  }
}

let cantidadAnterior = obtenerPedidos().length;

function renderTablero() {
  const pedidos = obtenerPedidos();

  // Detectar si llegó un pedido nuevo para sonar alerta
  if (pedidos.length > cantidadAnterior) {
    sonarAlertaNuevoPedido();
  }
  cantidadAnterior = pedidos.length;

  const grupos = {
    nuevo: pedidos.filter(p => p.estado === "nuevo"),
    preparando: pedidos.filter(p => p.estado === "preparando"),
    listo: pedidos.filter(p => p.estado === "listo")
  };

  document.getElementById("count-nuevo").textContent = grupos.nuevo.length;
  document.getElementById("count-preparando").textContent = grupos.preparando.length;
  document.getElementById("count-listo").textContent = grupos.listo.length;

  document.getElementById("col-nuevo").innerHTML = renderColumna(grupos.nuevo, "nuevo");
  document.getElementById("col-preparando").innerHTML = renderColumna(grupos.preparando, "preparando");
  document.getElementById("col-listo").innerHTML = renderColumna(grupos.listo, "listo");
}

function renderColumna(lista, estado) {
  if (lista.length === 0) {
    return `<p class="text-center text-xs text-slate-500 py-8">Sin pedidos en esta etapa</p>`;
  }

  return lista.map(ped => {
    let botonAccion = "";
    if (estado === "nuevo") {
      botonAccion = `
        <button onclick="cambiarEstadoPedido('${ped.id}', 'preparando')" class="w-full mt-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 rounded-xl text-xs transition">
          <i class="fa-solid fa-fire mr-1"></i> Aceptar y Cocinar
        </button>`;
    } else if (estado === "preparando") {
      botonAccion = `
        <button onclick="cambiarEstadoPedido('${ped.id}', 'listo')" class="w-full mt-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold py-2 rounded-xl text-xs transition">
          <i class="fa-solid fa-check mr-1"></i> Marcar como Listo
        </button>`;
    } else {
      botonAccion = `
        <button onclick="eliminarPedido('${ped.id}')" class="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs transition">
          Archivar orden
        </button>`;
    }

    return `
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div>
            <span class="text-base font-black text-white">#${ped.numero}</span>
            <span class="text-xs text-slate-400 ml-2"><i class="fa-regular fa-clock"></i> ${ped.hora}</span>
          </div>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
            ${ped.tipoEntrega}${ped.detalleEntrega ? ` • ${ped.detalleEntrega}` : ""}
          </span>
        </div>

        <p class="text-xs font-semibold text-slate-300 mt-2">
          <i class="fa-solid fa-user text-slate-500 mr-1"></i> ${ped.cliente}
        </p>

        <ul class="mt-3 space-y-1.5 text-sm border-t border-slate-800/80 pt-2.5">
          ${ped.items.map(it => `
            <li class="flex justify-between">
              <span><strong class="text-amber-400">${it.cantidad}x</strong> ${it.nombre}</span>
            </li>
          `).join("")}
        </ul>

        ${ped.nota ? `
          <div class="mt-2.5 bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs p-2 rounded-lg">
            <strong>Nota:</strong> ${ped.nota}
          </div>
        ` : ""}

        <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span class="text-slate-400">Total orden:</span>
          <span class="font-extrabold text-sm text-emerald-400">${formatoCLP(ped.total)}</span>
        </div>

        ${botonAccion}
      </div>
    `;
  }).join("");
}

function cambiarEstadoPedido(id, nuevoEstado) {
  const pedidos = obtenerPedidos();
  const idx = pedidos.findIndex(p => p.id === id);
  if (idx !== -1) {
    pedidos[idx].estado = nuevoEstado;
    guardarPedidos(pedidos);
    renderTablero();
  }
}

function eliminarPedido(id) {
  const filtrados = obtenerPedidos().filter(p => p.id !== id);
  guardarPedidos(filtrados);
  renderTablero();
}

function limpiarPedidosCompletados() {
  const activos = obtenerPedidos().filter(p => p.estado !== "listo");
  guardarPedidos(activos);
  renderTablero();
}

// Escuchar cambios en tiempo real desde otras pestañas (index.html)
canalPedidos.onmessage = () => renderTablero();
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) renderTablero();
});

// Carga inicial
renderTablero();
