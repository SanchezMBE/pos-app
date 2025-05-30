<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <div class="card-body">
        <h2 class="fw-bold">Nueva Venta</h2>

        <!-- Cantidad y Artículo -->
        <div class="row g-3 align-items-end">
          <div class="col-md-8">
            <label for="searchInput" class="form-label fw-bold">Artículo</label>
            <div class="input-group">
              <input
                id="searchInput"
                v-model="searchTerm"
                type="text"
                class="form-control form-control-lg"
                @input="buscarArticulos"
                @keyup.enter="agregarArticulo"
              />
              <button class="btn btn-outline-primary" @click="buscarArticulos">
                <i class="bi bi-search"></i>
              </button>
            </div>
            <!-- Resultados de búsqueda -->
            <div v-if="resultadosBusqueda.length > 0" class="search-results mt-2 border rounded p-2">
              <div
                v-for="article in resultadosBusqueda"
                :key="article.id"
                class="search-item p-2 border-bottom cursor-pointer hover-bg-light"
                @click="seleccionarArticulo(article)"
              >
                <div>
                  <strong>{{ article.description }}</strong> - ${{ article.price.toFixed(2) }}
                </div>
                <small class="text-muted"
                  >{{ article.barcode }} | Código: {{ article.code }} | Stock: {{ article.stock }}</small
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Alerta de stock -->
        <div v-if="stockMsg" class="alert alert-warning mt-3">
          <i class="bi bi-exclamation-triangle me-2"></i> {{ stockMsg }}
        </div>

        <!-- Tabla -->
        <div class="table-responsive mt-4 border rounded shadow-sm">
          <table class="table table-striped align-middle" :class="{ 'table-hover': articulosVenta.length > 0 }">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Artículo</th>
                <th>Precio Unit.</th>
                <th>Importe</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in articulosVenta" :key="index">
                <td>
                  <div class="input-group input-group-sm">
                    <button
                      class="btn btn-outline-secondary"
                      @click="ajustarCantidad(index, -1)"
                      :disabled="p.cantidad <= 1"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      class="form-control text-center"
                      v-model.number="p.cantidad"
                      @change="validarCantidad(index)"
                      min="1"
                      :max="p.stockDisponible + p.cantidad"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      @click="ajustarCantidad(index, 1)"
                      :disabled="p.cantidad >= p.stockDisponible + p.cantidad"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{{ p.description }}</td>
                <td>${{ p.price.toFixed(2) }}</td>
                <td>${{ (p.price * p.cantidad).toFixed(2) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-danger" @click="eliminarArticulo(index)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="articulosVenta.length === 0">
                <td colspan="6" class="text-center">No hay artículos agregados</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totales -->
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="p-3 bg-white rounded border shadow-sm">
              <p class="mb-1"><strong>Subtotal:</strong> ${{ subtotal.toFixed(2) }}</p>
              <p class="mb-1"><strong>IVA (16%):</strong> ${{ iva.toFixed(2) }}</p>
              <p class="fs-4 fw-bold text-success">Total: ${{ total.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="d-flex flex-column flex-md-row justify-content-start mt-4 gap-3">
          <button class="btn btn-primary btn-lg" @click="procesarPago" :disabled="articulosVenta.length === 0">
            <i class="bi bi-currency-dollar me-2"></i> Procesar Pago
          </button>
          <button class="btn btn-danger btn-lg" @click="cancelarVenta">
            <i class="bi bi-x-circle me-2"></i> Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Pago -->
    <div class="modal fade" id="pagoModal" tabindex="-1" aria-labelledby="pagoModalLabel" ref="pagoModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="pagoModalLabel">Procesar Pago</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Total a Pagar</label>
              <div class="form-control bg-light fs-4 fw-bold">${{ total.toFixed(2) }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Monto Recibido</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input v-model.number="montoRecibido" type="number" class="form-control form-control-lg" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Cambio</label>
              <div
                class="form-control bg-light fs-4"
                :class="{ 'text-danger': cambio < 0, 'text-success': cambio >= 0 }"
              >
                ${{ cambio.toFixed(2) }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="finalizarVenta" :disabled="cambio < 0">
              Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";
import { Modal } from "bootstrap";
import { useUserStore } from "@/stores/user";
import router from "@/router";

const user = ref({
  username: "Usuario",
  id: null,
  role: ""
});

// Variables para el negocio y corte de caja
const business = ref({
  id: null,
  name: ""
});

const cashAudit = ref({
  id: null,
  isOpen: false
});

// Referencias para modales
const pagoModal = ref(null);
let pagoModalInstance = null;

onMounted(async () => {
  const userStore = useUserStore();

  if (userStore.isAuthenticated) {
    user.value = userStore.user;

    // Inicializar el modal
    pagoModalInstance = new Modal(pagoModal.value);

    // Cargar inventario y datos del negocio
    await Promise.all([cargarInventario()]);
  } else {
    router.push("/login");
  }
});

const saveCashAudit = async () => {
  // Crear apertura de caja
  try {
    await axios.post(`http://localhost:3000/api/${user.value.role}/cash-audit`);
  } catch (error) {
    console.error("Error al agregar artículo:", error);
    showAlert("No se pudo agregar el artículo. Verifica los datos e inténtalo nuevamente.", "danger");
  }
};

// Variables para datos de búsqueda
const cantidad = ref(1);
const searchTerm = ref("");
const articuloSeleccionado = ref(null);
const resultadosBusqueda = ref([]);
const articulosVenta = ref([]);
const inventario = ref([]);
const stockMsg = ref("");
const montoRecibido = ref(0);

// Cargar inventario desde la API

const cargarInventario = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/${user.value.role}/articles`, { withCredentials: true });
    inventario.value = response.data.data;
  } catch (error) {
    console.error("Error al cargar inventario:", error);
  }
};

// Verificar si hay un corte de caja abierto
const verificarCorteCaja = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/${user.value.role}/cashaudit/open`, { withCredentials: true });
    cashAudit.value = response.data;

    if (!cashAudit.value.isOpen) {
      alert("No hay un corte de caja abierto. No se pueden realizar ventas.");
    }
  } catch (error) {
    console.error("Error al verificar el corte de caja:", error);
    alert("Hubo un error al verificar el corte de caja.");
    cashAudit.value = { id: null, isOpen: false };
  }
};

// Buscar articulos en el inventario
const buscarArticulos = () => {
  if (!searchTerm.value.trim()) {
    resultadosBusqueda.value = [];
    return;
  }

  const termino = searchTerm.value ? searchTerm.value.toLowerCase() : "";

  resultadosBusqueda.value = Array.isArray(inventario.value)
    ? inventario.value.filter(
        (a) => a.description.toLowerCase().includes(termino) || a.code.toLowerCase().includes(termino)
      )
    : []; // Si inventario.value no es un array, asignamos un array vacío
};

// Seleccionar un articulo de los resultados
const seleccionarArticulo = (articulo) => {
  articuloSeleccionado.value = articulo;
  searchTerm.value = articulo.description;
  resultadosBusqueda.value = [];

  // Verificar stock disponible
  if (articulo.stock <= 5) {
    stockMsg.value = `¡Atención! Quedan solo ${articulo.stock} unidades de "${articulo.description}" en inventario.`;
  } else {
    stockMsg.value = "";
  }
  agregarArticulo();
};

// Agregar articulo a la venta
const agregarArticulo = () => {
  if (!articuloSeleccionado.value) return;

  // Verificar si hay suficiente stock
  if (cantidad.value > articuloSeleccionado.value.stock) {
    stockMsg.value = `No hay suficiente stock de "${articuloSeleccionado.value.description}". Stock disponible: ${articuloSeleccionado.value.stock}`;
    cantidad.value = articuloSeleccionado.value.stock;
    return;
  }

  // Buscar si el articulo ya está en la lista
  const index = articulosVenta.value.findIndex((p) => p.id === articuloSeleccionado.value.id);

  if (index !== -1) {
    // Sumar la cantidad al articulo existente
    const stockDisponible = articuloSeleccionado.value.stock;
    const cantidadTotal = articulosVenta.value[index].cantidad + cantidad.value;

    if (cantidadTotal > stockDisponible) {
      stockMsg.value = `No hay suficiente stock de "${articuloSeleccionado.value.description}". Stock disponible: ${stockDisponible}`;
      return;
    }

    articulosVenta.value[index].cantidad = cantidadTotal;
  } else {
    // Agregar nuevo articulo a la lista
    articulosVenta.value.push({
      id: articuloSeleccionado.value.id,
      code: articuloSeleccionado.value.code,
      description: articuloSeleccionado.value.description,
      price: articuloSeleccionado.value.price,
      cantidad: cantidad.value,
      stockDisponible: articuloSeleccionado.value.stock - cantidad.value
    });
  }

  // Actualizar stock temporal
  const articleIndex = inventario.value.findIndex((p) => p.id === articuloSeleccionado.value.id);
  if (articleIndex !== -1) {
    inventario.value[articleIndex].stock -= cantidad.value;
  }

  // Limpiar campos
  searchTerm.value = "";
  articuloSeleccionado.value = null;
  cantidad.value = 1;
  stockMsg.value = "";
};

// Validar y ajustar cantidad de un articulo
const validarCantidad = (index) => {
  const articulo = articulosVenta.value[index];
  const stockTotal = articulo.stockDisponible + articulo.cantidad;

  // Asegurarnos que la cantidad sea un número
  if (isNaN(articulo.cantidad) || articulo.cantidad < 1) {
    articulo.cantidad = 1;
  }

  // No permitir más del stock disponible
  if (articulo.cantidad > stockTotal) {
    stockMsg.value = `No hay suficiente stock de "${articulo.description}". Stock máximo: ${stockTotal}`;
    articulo.cantidad = stockTotal;
  } else {
    stockMsg.value = "";
  }
};

// Ajustar cantidad con botones +/-
const ajustarCantidad = (index, delta) => {
  const articulo = articulosVenta.value[index];
  const nuevaCantidad = articulo.cantidad + delta;

  if (nuevaCantidad >= 1 && nuevaCantidad <= articulo.stockDisponible + articulo.cantidad) {
    articulo.cantidad = nuevaCantidad;
    stockMsg.value = "";
  }
};

// Eliminar articulo de la venta
const eliminarArticulo = (index) => {
  const articulo = articulosVenta.value[index];

  // Restaurar stock al inventario
  const articleIndex = inventario.value.findIndex((p) => p.id === articulo.id);
  if (articleIndex !== -1) {
    inventario.value[articleIndex].stock += articulo.cantidad;
  }

  // Eliminar de la lista
  articulosVenta.value.splice(index, 1);
  stockMsg.value = "";
};

// Cancelar toda la venta
const cancelarVenta = () => {
  // Restaurar todo el stock al inventario
  articulosVenta.value.forEach((articulo) => {
    const articleIndex = inventario.value.findIndex((p) => p.id === articulo.id);
    if (articleIndex !== -1) {
      inventario.value[articleIndex].stock += articulo.cantidad;
    }
  });

  // Limpiar todos los campos
  cantidad.value = 1;
  searchTerm.value = "";
  articuloSeleccionado.value = null;
  articulosVenta.value = [];
  stockMsg.value = "";
  montoRecibido.value = 0;
};

// Cálculos
const subtotal = computed(() => articulosVenta.value.reduce((sum, p) => sum + p.price * p.cantidad, 0));

const iva = computed(() => subtotal.value * 0.16);
const total = computed(() => subtotal.value + iva.value);
const cambio = computed(() => montoRecibido.value - total.value);

// Procesar el pago (mostrar modal)
const procesarPago = () => {
  if (articulosVenta.value.length === 0) return;

  // Verificar si hay un corte de caja abierto
  // if (!cashAudit.value.isOpen) {
  //   alert("No hay un corte de caja abierto. No se pueden procesar ventas.");
  //   return;
  // }

  pagoModalInstance.show();
  montoRecibido.value = total.value; // Por defecto, poner el total exacto
};

// Finalizar la venta
const finalizarVenta = async () => {
  if (cambio.value < 0) return;
  // || !cashAudit.value.isOpen

  try {
    // Crear objeto de venta
    const saleData = {
      articles: articulosVenta.value.map((p) => ({
        article_id: p.id,
        unit_price: p.price,
        quantity: p.cantidad,
        total_price: p.price * p.cantidad
      })),
      total: total.value
    };

    // Crear la venta principal
    await axios.post(`http://localhost:3000/api/${user.value.role}/sales`, saleData, { withCredentials: true });

    pagoModalInstance.hide();

    // Limpiar para una nueva venta
    cantidad.value = 1;
    searchTerm.value = "";
    articuloSeleccionado.value = null;
    articulosVenta.value = [];
    stockMsg.value = "";
    montoRecibido.value = 0;
  } catch {
    console.error("Error al procesar venta");
    alert("Hubo un error al procesar la venta. Intente nuevamente.");
  }
};
</script>

<style scoped>
#wrapper {
  min-height: 100vh;
}

.card-title {
  font-weight: 600;
}

.search-results {
  max-height: 252px;
  overflow-y: auto;
  position: absolute;
  width: inherit;
  z-index: 1000;
  background: white;
}

.search-item {
  cursor: pointer;
}

.search-item:hover {
  background-color: #f8f9fa;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-bg-light:hover {
  background-color: #f8f9fa;
}
</style>
