// ==========================================
// 1. DATOS POR DEFECTO (Fallback inicial)
// ==========================================
const DEFAULT_LOCAL = {
  nombre: "Sabores del Barrio",
  descripcion: "Comida casera, almuerzos ejecutivos y sándwiches artesanales.",
  direccion: "Av. Principal 1234",
  horario: "Lun - Sáb: 12:00 a 22:30 hrs",
  banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
};

const DEFAULT_PLATOS = [
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

const formatoCLP = (num) => "$" + Number(num).toLocaleString("es-CL");

// ==========================================
// 2. CLAVES DE ALMACENAMIENTO Y CANAL EN VIVO
// ==========================================
const STORAGE_PEDIDOS = "carta_digital_pedidos_v1";
const STORAGE_LOCAL = "carta_digital_config_v1";
const STORAGE_PLATOS = "carta_digital_platos_v1";

const canalPedidos = new BroadcastChannel("canal_cocina_pedidos");

// Cargar configuración y platos dinámicos (para que app.js y pedidos.js los usen directo)
let CONFIG_LOCAL = obtenerConfigLocal();
let PLATOS_DEMO = obtenerPlatos();

function obtenerConfigLocal() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORAGE_LOCAL));
    return guardado ? { ...DEFAULT_LOCAL, ...guardado } : { ...DEFAULT_LOCAL };
  } catch {
    return { ...DEFAULT_LOCAL };
  }
}

function guardarConfigLocal(nuevaConfig) {
  CONFIG_LOCAL = nuevaConfig;
  localStorage.setItem(STORAGE_LOCAL, JSON.stringify(nuevaConfig));
  canalPedidos.postMessage({ tipo: "MENU_ACTUALIZADO" });
}

function obtenerPlatos() {
  try {
    const guardados = JSON.parse(localStorage.getItem(STORAGE_PLATOS));
    return Array.isArray(guardados) && guardados.length > 0 ? guardados : [...DEFAULT_PLATOS];
  } catch {
    return [...DEFAULT_PLATOS];
  }
}

function guardarPlatos(listaPlatos) {
  PLATOS_DEMO = listaPlatos;
  localStorage.setItem(STORAGE_PLATOS, JSON.stringify(listaPlatos));
  canalPedidos.postMessage({ tipo: "MENU_ACTUALIZADO" });
}

// ==========================================
// 3. GESTIÓN DE PEDIDOS EN TIEMPO REAL
// ==========================================
function obtenerPedidos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PEDIDOS)) || [];
  } catch {
    return [];
  }
}

function guardarPedidos(lista) {
  localStorage.setItem(STORAGE_PEDIDOS, JSON.stringify(lista));
  canalPedidos.postMessage({ tipo: "ACTUALIZAR" });
}

function crearNuevoPedido(pedido) {
  const pedidos = obtenerPedidos();
  pedidos.unshift(pedido);
  guardarPedidos(pedidos);
}
