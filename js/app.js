let versionActual = 1;
let categoriaActiva = "Todos";
let carrito = {};

// Leer ?v=1, ?v=2 o ?v=3 desde la URL al abrir
function detectarVersionInicial() {
  const params = new URLSearchParams(window.location.search);
  const v = parseInt(params.get("v"));
  versionActual = [1, 2, 3].includes(v) ? v : 1;
}

function cambiarVersion(v) {
  versionActual = v;
  // Actualizar URL sin recargar la página
  const url = new URL(window.location);
  url.searchParams.set("v", v);
  window.history.pushState({}, "", url);

  aplicarEstilosVersion();
  renderHeader();
  renderCategorias();
  renderMenu();
  actualizarBarraCarrito();
}

function aplicarEstilosVersion() {
  const body = document.getElementById("app-body");
  const nav = document.getElementById("nav-categorias");
  const btnCarrito = document.getElementById("btn-ver-carrito");
  const badgeCant = document.getElementById("carrito-cantidad");

  // Resetear botones del selector superior
  [1, 2, 3].forEach(num => {
    const btn = document.getElementById(`btn-v${num}`);
    btn.className = num === versionActual
      ? "px-2.5 py-1 rounded font-bold bg-amber-500 text-neutral-950"
      : "px-2.5 py-1 rounded font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700";
  });

  if (versionActual === 1) {
    // V1: Clásico Cálido
    body.className = "bg-stone-50 text-stone-800 pb-28 transition-colors duration-300";
    nav.className = "sticky top-0 z-30 bg-stone-50/95 backdrop-blur border-b border-stone-200";
    btnCarrito.className = "w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-5 rounded-2xl shadow-xl flex items-center justify-between transition";
    badgeCant.className = "bg-amber-800 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg";
  } else if (versionActual === 2) {
    // V2: Dark Burger / Nocturno
    body.className = "bg-zinc-950 text-zinc-100 pb-28 transition-colors duration-300";
    nav.className = "sticky top-0 z-30 bg-zinc-950/95 backdrop-blur border-b border-zinc-800";
    btnCarrito.className = "w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-xl shadow-orange-950/50 flex items-center justify-between transition";
    badgeCant.className = "bg-zinc-950 text-orange-400 text-xs font-extrabold px-2.5 py-1 rounded-lg";
  } else {
    // V3: Minimal Editorial / Cafetería
    body.className = "bg-white text-neutral-900 pb-28 transition-colors duration-300";
    nav.className = "sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200";
    btnCarrito.className = "w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 px-5 rounded-full shadow-xl flex items-center justify-between transition";
    badgeCant.className = "bg-white text-neutral-900 text-xs font-extrabold px-2.5 py-1 rounded-full";
  }
}

function renderHeader() {
  const cont = document.getElementById("header-container");

  if (versionActual === 1) {
    // HEADER V1: Portada con tarjeta flotante
    cont.innerHTML = `
      <header class="relative bg-stone-900 text-white">
        <div class="h-44 sm:h-52 w-full overflow-hidden opacity-65">
          <img src="${CONFIG_LOCAL.banner}" class="w-full h-full object-cover">
        </div>
        <div class="max-w-4xl mx-auto px-4 pb-5 -mt-12 relative z-10">
          <div class="bg-white text-stone-900 rounded-2xl shadow-lg p-5 border border-stone-100">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Abierto ahora
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">${CONFIG_LOCAL.nombre}</h1>
            <p class="text-sm text-stone-500 mt-1">${CONFIG_LOCAL.descripcion}</p>
            <div class="flex flex-wrap gap-4 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
              <span><i class="fa-solid fa-location-dot text-amber-600 mr-1"></i> ${CONFIG_LOCAL.direccion}</span>
              <span><i class="fa-regular fa-clock text-amber-600 mr-1"></i> ${CONFIG_LOCAL.horario}</span>
            </div>
          </div>
        </div>
      </header>
    `;
  } else if (versionActual === 2) {
    // HEADER V2: Oscuro con degradado y estilo moderno
    cont.innerHTML = `
      <header class="relative overflow-hidden border-b border-zinc-800">
        <div class="absolute inset-0 opacity-30">
          <img src="${CONFIG_LOCAL.banner}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>
        <div class="relative max-w-4xl mx-auto px-4 py-10">
          <span class="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md bg-orange-600/20 text-orange-400 border border-orange-500/30 mb-3">
            🔥 Pedidos directos a cocina
          </span>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">${CONFIG_LOCAL.nombre}</h1>
          <p class="text-sm text-zinc-400 mt-2 max-w-xl">${CONFIG_LOCAL.descripcion}</p>
          <div class="flex flex-wrap gap-4 mt-4 text-xs text-zinc-400">
            <span><i class="fa-solid fa-location-dot text-orange-500 mr-1"></i> ${CONFIG_LOCAL.direccion}</span>
            <span><i class="fa-regular fa-clock text-orange-500 mr-1"></i> ${CONFIG_LOCAL.horario}</span>
          </div>
        </div>
      </header>
    `;
  } else {
    // HEADER V3: Minimalista tipográfico sin banner pesado
    cont.innerHTML = `
      <header class="max-w-4xl mx-auto px-4 pt-8 pb-5 border-b border-neutral-100">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Menú Digital</p>
            <h1 class="text-3xl font-black tracking-tight text-neutral-900">${CONFIG_LOCAL.nombre}</h1>
            <p class="text-sm text-neutral-500 mt-1">${CONFIG_LOCAL.descripcion}</p>
          </div>
          <div class="text-xs text-neutral-500 space-y-1 sm:text-right">
            <p><i class="fa-solid fa-location-dot mr-1"></i> ${CONFIG_LOCAL.direccion}</p>
            <p><i class="fa-regular fa-clock mr-1"></i> ${CONFIG_LOCAL.horario}</p>
          </div>
        </div>
      </header>
    `;
  }
}

function renderCategorias() {
  const cats = ["Todos", ...new Set(PLATOS_DEMO.map(p => p.categoria))];
  const cont = document.getElementById("categorias-container");

  cont.innerHTML = cats.map(cat => {
    const activa = categoriaActiva === cat;
    let clases = "";

    if (versionActual === 1) {
      clases = activa
        ? "bg-amber-600 text-white shadow-sm rounded-full"
        : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 rounded-full";
    } else if (versionActual === 2) {
      clases = activa
        ? "bg-orange-600 text-white shadow-sm rounded-lg"
        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white rounded-lg";
    } else {
      clases = activa
        ? "bg-neutral-900 text-white rounded-full"
        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-full";
    }

    return `
      <button onclick="filtrarCategoria('${cat}')" class="px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition ${clases}">
        ${cat}
      </button>
    `;
  }).join("");
}

function filtrarCategoria(cat) {
  categoriaActiva = cat;
  renderCategorias();
  renderMenu();
}

function renderMenu() {
  const filtrados = categoriaActiva === "Todos"
    ? PLATOS_DEMO
    : PLATOS_DEMO.filter(p => p.categoria === categoriaActiva);

  const grid = document.getElementById("menu-grid");

  // Layout del contenedor según versión
  if (versionActual === 3) {
    grid.className = "divide-y divide-neutral-200 border-t border-b border-neutral-200";
  } else {
    grid.className = "grid grid-cols-1 sm:grid-cols-2 gap-4";
  }

  grid.innerHTML = filtrados.map(plato => {
    const cant = carrito[plato.id] || 0;

    // DISEÑO V1: Tarjeta Clásica
    if (versionActual === 1) {
      return `
        <article class="animar-entrada bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div class="h-40 w-full bg-stone-200 overflow-hidden relative">
              <img src="${plato.imagen}" alt="${plato.nombre}" class="w-full h-full object-cover">
              <span class="absolute top-2.5 left-2.5 bg-black/65 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                ${plato.categoria}
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-base text-stone-900">${plato.nombre}</h3>
              <p class="text-xs text-stone-500 mt-1 line-clamp-2">${plato.descripcion}</p>
            </div>
          </div>
          <div class="px-4 pb-4 pt-2 flex items-center justify-between">
            <span class="font-extrabold text-amber-700 text-base">${formatoCLP(plato.precio)}</span>
            ${renderBotonAgregar(plato.id, cant, "v1")}
          </div>
        </article>
      `;
    }

    // DISEÑO V2: Tarjeta Dark Mode
    if (versionActual === 2) {
      return `
        <article class="animar-entrada bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition">
          <div>
            <div class="h-44 w-full bg-zinc-800 overflow-hidden relative">
              <img src="${plato.imagen}" alt="${plato.nombre}" class="w-full h-full object-cover">
              <span class="absolute top-3 right-3 bg-zinc-950/85 text-orange-400 border border-orange-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                ${plato.categoria}
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-extrabold text-lg text-white">${plato.nombre}</h3>
              <p class="text-xs text-zinc-400 mt-1 line-clamp-2">${plato.descripcion}</p>
            </div>
          </div>
          <div class="px-4 pb-4 pt-2 flex items-center justify-between border-t border-zinc-800/80 mt-2">
            <span class="font-black text-orange-400 text-lg">${formatoCLP(plato.precio)}</span>
            ${renderBotonAgregar(plato.id, cant, "v2")}
          </div>
        </article>
      `;
    }

    // DISEÑO V3: Lista Horizontal Minimalista (Estilo UberEats / Cafetería)
    return `
      <article class="animar-entrada py-4 flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400">${plato.categoria}</span>
          <h3 class="font-bold text-base text-neutral-900 mt-0.5">${plato.nombre}</h3>
          <p class="text-xs text-neutral-500 mt-1 line-clamp-2">${plato.descripcion}</p>
          <div class="mt-3 flex items-center gap-4">
            <span class="font-extrabold text-neutral-900 text-sm">${formatoCLP(plato.precio)}</span>
            ${renderBotonAgregar(plato.id, cant, "v3")}
          </div>
        </div>
        <img src="${plato.imagen}" alt="${plato.nombre}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-neutral-100 shrink-0">
      </article>
    `;
  }).join("");
}

function renderBotonAgregar(id, cant, estilo) {
  if (estilo === "v1") {
    return cant === 0
      ? `<button onclick="cambiarCantidad('${id}', 1)" class="bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">+ Agregar</button>`
      : `<div class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-2 py-1">
           <button onclick="cambiarCantidad('${id}', -1)" class="w-6 h-6 rounded-lg bg-white text-amber-700 font-bold">-</button>
           <span class="text-sm font-extrabold w-5 text-center">${cant}</span>
           <button onclick="cambiarCantidad('${id}', 1)" class="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold">+</button>
         </div>`;
  }
  if (estilo === "v2") {
    return cant === 0
      ? `<button onclick="cambiarCantidad('${id}', 1)" class="bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold px-4 py-2 rounded-lg transition">+ Añadir</button>`
      : `<div class="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1">
           <button onclick="cambiarCantidad('${id}', -1)" class="w-6 h-6 rounded bg-zinc-900 text-white font-bold">-</button>
           <span class="text-sm font-extrabold w-5 text-center text-orange-400">${cant}</span>
           <button onclick="cambiarCantidad('${id}', 1)" class="w-6 h-6 rounded bg-orange-600 text-white font-bold">+</button>
         </div>`;
  }
  return cant === 0
    ? `<button onclick="cambiarCantidad('${id}', 1)" class="border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full transition">+ Agregar</button>`
    : `<div class="flex items-center gap-2 bg-neutral-100 rounded-full px-2 py-0.5">
         <button onclick="cambiarCantidad('${id}', -1)" class="w-6 h-6 rounded-full bg-white text-neutral-900 font-bold text-xs shadow-2xs">-</button>
         <span class="text-xs font-extrabold w-4 text-center">${cant}</span>
         <button onclick="cambiarCantidad('${id}', 1)" class="w-6 h-6 rounded-full bg-neutral-900 text-white font-bold text-xs">+</button>
       </div>`;
}

// ==========================================
// CARRITO Y MODAL
// ==========================================
function cambiarCantidad(id, delta) {
  const nueva = (carrito[id] || 0) + delta;
  if (nueva <= 0) delete carrito[id];
  else carrito[id] = nueva;

  renderMenu();
  actualizarBarraCarrito();
}

function actualizarBarraCarrito() {
  let totalItems = 0;
  let totalPlata = 0;

  for (const [id, cant] of Object.entries(carrito)) {
    const prod = PLATOS_DEMO.find(p => p.id === id);
    if (prod) {
      totalItems += cant;
      totalPlata += prod.precio * cant;
    }
  }

  const barra = document.getElementById("barra-carrito");
  if (totalItems > 0) {
    barra.classList.remove("hidden");
    document.getElementById("carrito-cantidad").textContent = totalItems;
    document.getElementById("carrito-total").textContent = formatoCLP(totalPlata);
    document.getElementById("modal-total").textContent = formatoCLP(totalPlata);
  } else {
    barra.classList.add("hidden");
    cerrarModalCarrito();
  }
}

function abrirModalCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = Object.entries(carrito).map(([id, cant]) => {
    const prod = PLATOS_DEMO.find(p => p.id === id);
    return `
      <div class="py-2.5 flex items-center justify-between text-sm">
        <div>
          <p class="font-bold">${cant}x ${prod.nombre}</p>
          <p class="text-xs text-stone-500">${formatoCLP(prod.precio * cant)}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="cambiarCantidad('${id}', -1); abrirModalCarrito();" class="w-7 h-7 rounded-lg bg-stone-100 font-bold">-</button>
          <button onclick="cambiarCantidad('${id}', 1); abrirModalCarrito();" class="w-7 h-7 rounded-lg bg-stone-100 font-bold">+</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("modal-carrito").classList.remove("hidden");
}

function cerrarModalCarrito() {
  document.getElementById("modal-carrito").classList.add("hidden");
}

function toggleDireccion() {
  const tipo = document.getElementById("tipo-entrega").value;
  const campo = document.getElementById("campo-direccion");
  const label = document.getElementById("label-direccion");
  const input = document.getElementById("cliente-direccion");

  if (tipo === "En mesa") {
    campo.classList.remove("hidden");
    label.textContent = "N° de Mesa";
    input.placeholder = "Ej: Mesa 4";
  } else if (tipo === "Delivery") {
    campo.classList.remove("hidden");
    label.textContent = "Dirección de entrega";
    input.placeholder = "Ej: Calle Los Aromos 456, Depto 202";
  } else {
    campo.classList.add("hidden");
  }
}

// ==========================================
// ENVÍO EN TIEMPO REAL A PEDIDOS.HTML
// ==========================================
function enviarPedidoACocina() {
  const nombre = document.getElementById("cliente-nombre").value.trim() || "Cliente";
  const tipo = document.getElementById("tipo-entrega").value;
  const direccion = document.getElementById("cliente-direccion").value.trim();
  const nota = document.getElementById("cliente-nota").value.trim();

  const items = [];
  let total = 0;

  for (const [id, cant] of Object.entries(carrito)) {
    const prod = PLATOS_DEMO.find(p => p.id === id);
    const subtotal = prod.precio * cant;
    total += subtotal;
    items.push({
      id: prod.id,
      nombre: prod.nombre,
      cantidad: cant,
      precioUnitario: prod.precio,
      subtotal
    });
  }

  const numeroOrden = String(Math.floor(100 + Math.random() * 900));
  const hora = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });

  const nuevoPedido = {
    id: "ord_" + Date.now(),
    numero: numeroOrden,
    hora,
    cliente: nombre,
    tipoEntrega: tipo,
    detalleEntrega: direccion,
    nota,
    items,
    total,
    estado: "nuevo" // 'nuevo' | 'preparando' | 'listo'
  };

  // Guardar y notificar en tiempo real a pedidos.html
  crearNuevoPedido(nuevoPedido);

  // Limpiar carrito y mostrar notificación
  carrito = {};
  renderMenu();
  actualizarBarraCarrito();
  cerrarModalCarrito();

  const toast = document.getElementById("toast-exito");
  document.getElementById("toast-numero").textContent = `Orden #${numeroOrden} enviada al tablero de cocina.`;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 4000);
}

// Escuchar cambios desde admin.html en tiempo real
canalPedidos.onmessage = (e) => {
  if (e.data?.tipo === "MENU_ACTUALIZADO") {
    CONFIG_LOCAL = obtenerConfigLocal();
    PLATOS_DEMO = obtenerPlatos();
    renderHeader();
    renderCategorias();
    renderMenu();
  }
};

// Inicializar todo
detectarVersionInicial();
aplicarEstilosVersion();
renderHeader();
renderCategorias();
renderMenu();
