// ==========================================
// 1. UTILIDAD: COMPRESIÓN DE IMAGEN A WEBP EN NAVEGADOR
// ==========================================
function convertirImagenAWebP(file, maxWidth = 800, calidad = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Exporta como WebP ligero en Base64
        const webpDataUrl = canvas.toDataURL("image/webp", calidad);
        resolve(webpDataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("admin-toast");
  document.getElementById("admin-toast-msg").textContent = mensaje;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ==========================================
// 2. NAVEGACIÓN POR PESTAÑAS
// ==========================================
function cambiarTab(tab) {
  const secPlatos = document.getElementById("sec-platos");
  const secLocal = document.getElementById("sec-local");
  const btnPlatos = document.getElementById("tab-platos");
  const btnLocal = document.getElementById("tab-local");

  if (tab === "platos") {
    secPlatos.classList.remove("hidden");
    secLocal.classList.add("hidden");
    btnPlatos.className = "px-4 py-2 rounded-xl text-sm font-bold bg-stone-900 text-white transition";
    btnLocal.className = "px-4 py-2 rounded-xl text-sm font-bold bg-white text-stone-600 hover:bg-stone-200 transition";
  } else {
    secPlatos.classList.add("hidden");
    secLocal.classList.remove("hidden");
    btnLocal.className = "px-4 py-2 rounded-xl text-sm font-bold bg-stone-900 text-white transition";
    btnPlatos.className = "px-4 py-2 rounded-xl text-sm font-bold bg-white text-stone-600 hover:bg-stone-200 transition";
  }
}

// ==========================================
// 3. FORMULARIO DATOS DEL LOCAL
// ==========================================
function cargarFormularioLocal() {
  const cfg = obtenerConfigLocal();
  document.getElementById("local-nombre").value = cfg.nombre;
  document.getElementById("local-descripcion").value = cfg.descripcion;
  document.getElementById("local-direccion").value = cfg.direccion;
  document.getElementById("local-horario").value = cfg.horario;
  document.getElementById("local-banner-url").value = cfg.banner;
  document.getElementById("preview-banner").src = cfg.banner;
}

async function procesarFotoBanner(event) {
  const file = event.target.files[0];
  if (!file) return;

  const webp = await convertirImagenAWebP(file, 1000, 0.78);
  document.getElementById("local-banner-url").value = webp;
  document.getElementById("preview-banner").src = webp;
  mostrarToast("Portada optimizada a WebP");
}

function guardarDatosLocal(event) {
  event.preventDefault();
  const nuevaConfig = {
    nombre: document.getElementById("local-nombre").value.trim(),
    descripcion: document.getElementById("local-descripcion").value.trim(),
    direccion: document.getElementById("local-direccion").value.trim(),
    horario: document.getElementById("local-horario").value.trim(),
    banner: document.getElementById("local-banner-url").value.trim() || DEFAULT_LOCAL.banner
  };

  guardarConfigLocal(nuevaConfig);
  mostrarToast("¡Datos del restaurante actualizados!");
}

// ==========================================
// 4. CRUD DE PLATOS
// ==========================================
function renderPlatosAdmin() {
  const platos = obtenerPlatos();
  const grid = document.getElementById("admin-platos-grid");

  grid.innerHTML = platos.map(plato => `
    <article class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
      <div>
        <div class="h-40 w-full bg-stone-200 relative overflow-hidden">
          <img src="${plato.imagen}" alt="${plato.nombre}" class="w-full h-full object-cover">
          <span class="absolute top-2.5 left-2.5 bg-stone-900/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            ${plato.categoria}
          </span>
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-stone-900 text-base">${plato.nombre}</h3>
            <span class="font-extrabold text-amber-700 text-sm shrink-0">${formatoCLP(plato.precio)}</span>
          </div>
          <p class="text-xs text-stone-500 mt-1 line-clamp-2">${plato.descripcion}</p>
        </div>
      </div>

      <div class="px-4 pb-4 pt-2 border-t border-stone-100 flex items-center gap-2">
        <button onclick="abrirModalPlato('${plato.id}')" class="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2 rounded-xl transition">
          <i class="fa-solid fa-pen mr-1"></i> Editar
        </button>
        <button onclick="eliminarPlato('${plato.id}')" class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition" title="Eliminar plato">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </article>
  `).join("");
}

function abrirModalPlato(id = null) {
  const modal = document.getElementById("modal-plato");
  const titulo = document.getElementById("modal-plato-titulo");
  document.getElementById("input-plato-file").value = "";

  if (id) {
    const plato = obtenerPlatos().find(p => p.id === id);
    if (!plato) return;
    titulo.textContent = "Editar Plato";
    document.getElementById("plato-id").value = plato.id;
    document.getElementById("plato-nombre").value = plato.nombre;
    document.getElementById("plato-categoria").value = plato.categoria;
    document.getElementById("plato-precio").value = plato.precio;
    document.getElementById("plato-descripcion").value = plato.descripcion;
    document.getElementById("plato-imagen-url").value = plato.imagen;
    document.getElementById("preview-plato-img").src = plato.imagen;
  } else {
    const imgDefault = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
    titulo.textContent = "Agregar Nuevo Plato";
    document.getElementById("plato-id").value = "";
    document.getElementById("plato-nombre").value = "";
    document.getElementById("plato-categoria").value = "";
    document.getElementById("plato-precio").value = "";
    document.getElementById("plato-descripcion").value = "";
    document.getElementById("plato-imagen-url").value = imgDefault;
    document.getElementById("preview-plato-img").src = imgDefault;
  }

  modal.classList.remove("hidden");
}

function cerrarModalPlato() {
  document.getElementById("modal-plato").classList.add("hidden");
}

async function procesarFotoPlato(event) {
  const file = event.target.files[0];
  if (!file) return;

  const webp = await convertirImagenAWebP(file, 650, 0.78);
  document.getElementById("plato-imagen-url").value = webp;
  document.getElementById("preview-plato-img").src = webp;
  mostrarToast("Foto optimizada a WebP");
}

function guardarPlato(event) {
  event.preventDefault();
  const idExistente = document.getElementById("plato-id").value;
  const platos = obtenerPlatos();

  const datosPlato = {
    id: idExistente || "p_" + Date.now(),
    nombre: document.getElementById("plato-nombre").value.trim(),
    categoria: document.getElementById("plato-categoria").value.trim(),
    precio: Number(document.getElementById("plato-precio").value),
    descripcion: document.getElementById("plato-descripcion").value.trim(),
    imagen: document.getElementById("plato-imagen-url").value.trim(),
    disponible: true
  };

  if (idExistente) {
    const idx = platos.findIndex(p => p.id === idExistente);
    if (idx !== -1) platos[idx] = datosPlato;
  } else {
    platos.unshift(datosPlato);
  }

  guardarPlatos(platos);
  renderPlatosAdmin();
  cerrarModalPlato();
  mostrarToast(idExistente ? "Plato actualizado" : "Plato agregado a la carta");
}

function eliminarPlato(id) {
  if (!confirm("¿Seguro que quieres eliminar este plato de la carta?")) return;
  const filtrados = obtenerPlatos().filter(p => p.id !== id);
  guardarPlatos(filtrados);
  renderPlatosAdmin();
  mostrarToast("Plato eliminado");
}

function restaurarDemo() {
  if (!confirm("¿Restaurar el nombre del local y los 4 platos originales de ejemplo?")) return;
  localStorage.removeItem(STORAGE_LOCAL);
  localStorage.removeItem(STORAGE_PLATOS);
  CONFIG_LOCAL = obtenerConfigLocal();
  PLATOS_DEMO = obtenerPlatos();
  canalPedidos.postMessage({ tipo: "MENU_ACTUALIZADO" });
  cargarFormularioLocal();
  renderPlatosAdmin();
  mostrarToast("Datos demo restaurados");
}

// Inicializar panel
cargarFormularioLocal();
renderPlatosAdmin();
