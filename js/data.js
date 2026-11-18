// ==========================================
// CONFIGURACIÓN DEL LOCAL Y PLATOS DEMO
// ==========================================
const CONFIG_LOCAL = {
  nombre: "Sabores del Barrio",
  descripcion: "Comida casera, almuerzos ejecutivos y sándwiches artesanales.",
  direccion: "Av. Principal 1234",
  horario: "Lun - Sáb: 12:00 a 22:30 hrs",
  banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
};

const PLATOS_DEMO = [
  {
    id: "p1",
    categoria: "Menú del Día",
    nombre: "Menú Ejecutivo Completo",
    descripcion: "Entrada (consomé o ensalada), plato de fondo a elección, postre y jugo natural.",
    precio: 6500,
    imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    categoria: "Platos de Fondo",
    nombre: "Lomo a lo Pobre Tradicional",
    descripcion: "Corte de lomo liso a la plancha acompañado de papas fritas caseras, cebolla caramelizada y 2 huevos fritos.",
    precio: 9900,
    imagen: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    categoria: "Sándwiches",
    nombre: "Churrasco Italiano XL",
    descripcion: "Pan frica artesanal, láminas de churrasco, palta fresca molida, tomate y mayonesa casera.",
    precio: 7200,
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    categoria: "Bebestibles",
    nombre: "Limonada Menta Jengibre (500cc)",
    descripcion: "Preparada al momento con limones naturales, hojas de menta fresca y toque de jengibre.",
    precio: 2800,
    imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"
  }
];

const formatoCLP = (num) => "$" + num.toLocaleString("es-CL");

// ==========================================
// CAPA DE TIEMPO REAL (Luego se reemplaza por Firestore)
// ==========================================
const STORAGE_KEY = "carta_digital_pedidos_v1";
const canalPedidos = new BroadcastChannel("canal_cocina_pedidos");

function obtenerPedidos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function guardarPedidos(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  canalPedidos.postMessage({ tipo: "ACTUALIZAR" });
}

function crearNuevoPedido(pedido) {
  const pedidos = obtenerPedidos();
  pedidos.unshift(pedido); // Agrega al inicio
  guardarPedidos(pedidos);
}
