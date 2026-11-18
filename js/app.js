// ==========================================
// 1. CONFIGURACIÓN Y DATOS DEMO
// (Más adelante estos datos vendrán de Firestore)
// ==========================================
const CONFIG_LOCAL = {
  nombre: "Sabores del Barrio",
  descripcion: "Comida casera, almuerzos ejecutivos y sándwiches artesanales.",
  direccion: "Av. Principal 1234",
  horario: "Lun - Sáb: 12:00 a 22:30 hrs",
  whatsapp: "56912345678", // Formato internacional sin +
  banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
};

const PLATOS_DEMO = [
  {
    id: "p1",
    categoria: "Menú del Día",
    nombre: "Menú Ejecutivo Completo",
    descripcion: "Entrada (consomé o ensalada), plato de fondo a elección, postre y jugo natural.",
    precio: 6500,
    imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    disponible: true
  },
  {
    id: "p2",
    categoria: "Platos de Fondo",
    nombre: "Lomo a lo Pobre Tradicional",
    descripcion: "Corte de lomo liso a la plancha acompañado de papas fritas caseras, cebolla caramelizada y 2 huevos fritos.",
    precio: 9900,
    imagen: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80",
    disponible: true
  },
  {
    id: "p3",
    categoria: "Sándwiches",
    nombre: "Churrasco Italiano XL",
    descripcion: "Pan frica artesanal, láminas de churrasco, palta fresca molida, tomate y mayonesa casera.",
    precio: 7200,
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    disponible: true
  },
  {
    id: "p4",
    categoria: "Bebestibles",
    nombre: "Limonada Menta Jengibre (500cc)",
    descripcion: "Preparada al momento con limones naturales, hojas de menta fresca y toque de jengibre.",
    precio: 2800,
    imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    disponible: true
  }
];

// ==========================================
// 2. ESTADO GLOBAL Y UTILIDADES
// ==========================================
let categoriaActiva = "Todos";
let carrito = {};

const formatoCLP = (num) => "$" + num.toLocaleString("es-CL");

// ==========================================
// 3. INICIALIZACIÓN Y RENDERIZADO DE CATÁLOGO
// ==========================================
function iniciarApp() {
  document.title = `${CONFIG_LOCAL.nombre} | Carta Digital`;
  document.getElementById("local-nombre").textContent = CONFIG_LOCAL.nombre;
  document.getElementById("local-desc").textContent = CONFIG_LOCAL.descripcion;
  document.getElementById("local-direccion").textContent = CONFIG_LOCAL.direccion;
  document.getElementById("local-horario").textContent = CONFIG_LOCAL.horario;
  document.getElementById("banner-img").src = CONFIG_LOCAL.banner;

  renderCategorias();
  renderMenu();
}

function renderCategorias() {
  const cats = ["Todos", ...new Set(PLATOS_DEMO.map(p => p.categoria))];
  const cont = document.getElementById("categorias-container");

  cont.innerHTML = cats.map(cat => `
    <button onclick="filtrarCategoria('${cat}')"
      class="px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
        categoriaActiva === cat
          ? "bg-amber-600 text-white shadow-sm"
          : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
      }">
      ${cat}
    </button>
  `).join("");
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

  grid.innerHTML = filtrados.map(plato => {
    const cant = carrito[plato.id] || 0;
    return `
      <article class="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
        <div>
          <div class="h-40 w-full bg-stone-200 overflow-hidden relative">
            <img src="${plato.imagen}" alt="${plato.nombre}" class="w-full h-full object-cover">
            <span class="absolute top-2.5 left-2.5 bg-black/65 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-xs">
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
          ${cant === 0 ? `
            <button onclick="cambiarCantidad('${plato.id}', 1)" class="bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">
              + Agregar
            </button>
          ` : `
            <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-2 py-1">
              <button onclick="cambiarCantidad('${plato.id}', -1)" class="w-6 h-6 rounded-lg bg-white text-amber-700 font-bold shadow-2xs">-</button>
              <span class="text-sm font-extrabold w-5 text-center">${cant}</span>
              <button onclick="cambiarCantidad('${plato.id}', 1)" class="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold">+</button>
            </div>
          `}
        </div>
      </article>
    `;
  }).join("");
}

// ==========================================
// 4. LÓGICA DEL CARRITO Y MODAL
// ==========================================
function cambiarCantidad(id, delta) {
  const nueva = (carrito[id] || 0) + delta;
  if (nueva <= 0) {
    delete carrito[id];
  } else {
    carrito[id] = nueva;
  }
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

  if (tipo === "Delivery" || tipo === "En mesa") {
    campo.classList.remove("hidden");
  } else {
    campo.classList.add("hidden");
  }
}

// ==========================================
// 5. INTEGRACIÓN WHATSAPP
// ==========================================
function enviarWhatsApp() {
  const nombre = document.getElementById("cliente-nombre").value.trim() || "Cliente";
  const tipo = document.getElementById("tipo-entrega").value;
  const direccion = document.getElementById("cliente-direccion").value.trim();
  const nota = document.getElementById("cliente-nota").value.trim();

  let texto = `¡Hola *${CONFIG_LOCAL.nombre}*! Quiero hacer el siguiente pedido:\n\n`;
  let total = 0;

  for (const [id, cant] of Object.entries(carrito)) {
    const prod = PLATOS_DEMO.find(p => p.id === id);
    const sub = prod.precio * cant;
    total += sub;
    texto += `▪️ *${cant}x* ${prod.nombre} (${formatoCLP(sub)})\n`;
  }

  texto += `\n💰 *Total:* ${formatoCLP(total)}\n`;
  texto += `👤 *Nombre:* ${nombre}\n`;
  texto += `🛵 *Modalidad:* ${tipo}\n`;
  if (direccion) texto += `📍 *Detalle/Dirección:* ${direccion}\n`;
  if (nota) texto += `📝 *Nota:* ${nota}\n`;

  const url = `https://wa.me/${CONFIG_LOCAL.whatsapp}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

// Arrancar la aplicación al cargar el script
iniciarApp();
