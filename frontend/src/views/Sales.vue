<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <div class="card-body">
        <h4 class="card-title mb-4 text-primary">Nueva Venta</h4>

        <!-- Cantidad y Producto -->
        <div class="row g-3 align-items-end">
          <div class="col-md-2">
            <label class="form-label fw-bold">Cantidad</label>
            <div class="input-group">
              <button class="btn btn-outline-secondary" @click="cantidad = Math.max(1, cantidad - 1)">-</button>
              <input v-model.number="cantidad" type="number" min="1" class="form-control text-center" />
              <button class="btn btn-outline-secondary" @click="cantidad++">+</button>
            </div>
          </div>

          <div class="col-md-8">
            <label class="form-label fw-bold">Producto</label>
            <div class="input-group">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control form-control-lg"
                placeholder="Código o nombre del producto"
                @input="buscarProductos"
              />
              <button class="btn btn-outline-primary" @click="buscarProductos">
                <i class="bi bi-search"></i>
              </button>
            </div>
            <!-- Resultados de búsqueda -->
            <div v-if="resultadosBusqueda.length > 0" class="search-results mt-2 border rounded p-2">
              <div
                v-for="prod in resultadosBusqueda"
                :key="prod.id"
                class="search-item p-2 border-bottom cursor-pointer hover-bg-light"
                @click="seleccionarProducto(prod)"
              >
                <div>
                  <strong>{{ prod.nombre }}</strong> - ${{ prod.precio.toFixed(2) }}
                </div>
                <small class="text-muted">Código: {{ prod.codigo }} | Stock: {{ prod.stock }}</small>
              </div>
            </div>
          </div>

          <div class="col-md-2">
            <button
              class="btn btn-success btn-lg w-100"
              @click="agregarProducto"
              :disabled="!productoSeleccionado || cantidad <= 0"
            >
              <i class="bi bi-cart-plus me-2"></i> Agregar
            </button>
          </div>
        </div>

        <!-- Alerta de stock -->
        <div v-if="stockAlert" class="alert alert-warning mt-3">
          <i class="bi bi-exclamation-triangle me-2"></i> {{ stockAlert }}
        </div>

        <!-- Tabla -->
        <div class="table-responsive mt-4">
          <table class="table table-striped table-hover align-middle">
            <thead class="table-primary">
              <tr>
                <th>Cantidad</th>
                <th>Código</th>
                <th>Producto</th>
                <th>Precio Unit.</th>
                <th>Importe</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in productosVenta" :key="index">
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
                <td>{{ p.codigo }}</td>
                <td>{{ p.nombre }}</td>
                <td>${{ p.precio.toFixed(2) }}</td>
                <td>${{ (p.precio * p.cantidad).toFixed(2) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-danger" @click="eliminarProducto(index)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="productosVenta.length === 0">
                <td colspan="6" class="text-center py-3 text-muted">No hay productos agregados</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totales -->
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="p-3 bg-light rounded shadow-sm">
              <p class="mb-1"><strong>Subtotal:</strong> ${{ subtotal.toFixed(2) }}</p>
              <p class="mb-1"><strong>IVA (16%):</strong> ${{ iva.toFixed(2) }}</p>
              <p class="fs-4 fw-bold text-success">Total: ${{ total.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="d-flex flex-column flex-md-row justify-content-start mt-4 gap-3">
          <button class="btn btn-primary btn-lg" @click="procesarPago" :disabled="productosVenta.length === 0">
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
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal } from "bootstrap";

const user = ref({
  username: "Usuario",
  id: null,
  role: ""
});

// Variables para el negocio y corte de caja
const business = ref({
  id: null,
  name: "Tienda"
});

const cashAudit = ref({
  id: null,
  isOpen: false
});

// Referencias para modales
const pagoModal = ref(null);
let pagoModalInstance = null;

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("authToken");

  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.error("Error al parsear datos del usuario:", e);
    }
  }
  if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }

  // Inicializar el modal
  pagoModalInstance = new Modal(pagoModal.value);

  // Cargar inventario y datos del negocio
  await Promise.all([cargarInventario(), obtenerDatosNegocio(), verificarCorteCaja()]);
});

// Variables para datos de búsqueda
const cantidad = ref(1);
const searchTerm = ref("");
const productoSeleccionado = ref(null);
const resultadosBusqueda = ref([]);
const productosVenta = ref([]);
const inventario = ref([]);
const stockAlert = ref("");
const montoRecibido = ref(0);

// Cargar inventario desde la API
const cargarInventario = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/articles");
    inventario.value = response.data;
  } catch (error) {
    console.error("Error al cargar inventario:", error);
    // Datos de ejemplo por si falla la API
    inventario.value = [
      { id: 1, codigo: "P001", nombre: "Leche", precio: 25.5, stock: 25 },
      { id: 2, codigo: "P002", nombre: "Pan", precio: 18.0, stock: 40 },
      { id: 3, codigo: "P003", nombre: "Refresco", precio: 15.0, stock: 30 },
      { id: 4, codigo: "P004", nombre: "Galletas", precio: 22.5, stock: 15 },
      { id: 5, codigo: "P005", nombre: "Detergente", precio: 45.0, stock: 10 }
    ];
  }
};

// Obtener datos del negocio
const obtenerDatosNegocio = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/business/current");
    business.value = response.data;
  } catch (error) {
    console.error("Error al obtener datos del negocio:", error);
    // Valor por defecto
    business.value = { id: 1, name: "Tienda principal" };
  }
};

// Verificar si hay un corte de caja abierto
const verificarCorteCaja = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/cashaudit/current");
    cashAudit.value = response.data;

    if (!cashAudit.value.isOpen) {
      alert("No hay un corte de caja abierto. No se pueden procesar ventas.");
    }
  } catch (error) {
    console.error("Error al verificar el corte de caja:", error);
    alert("Error al verificar el estado del corte de caja. No se pueden procesar ventas.");
    cashAudit.value = { id: null, isOpen: false };
  }
};

// Buscar productos en el inventario
const buscarProductos = () => {
  if (!searchTerm.value.trim()) {
    resultadosBusqueda.value = [];
    return;
  }

  const termino = searchTerm.value.toLowerCase();
  resultadosBusqueda.value = inventario.value.filter(
    (p) => p.nombre.toLowerCase().includes(termino) || p.codigo.toLowerCase().includes(termino)
  );
};

// Seleccionar un producto de los resultados
const seleccionarProducto = (producto) => {
  productoSeleccionado.value = producto;
  searchTerm.value = producto.nombre;
  resultadosBusqueda.value = [];

  // Verificar stock disponible
  if (producto.stock <= 5) {
    stockAlert.value = `¡Atención! Quedan solo ${producto.stock} unidades de "${producto.nombre}" en inventario.`;
  } else {
    stockAlert.value = "";
  }
};

// Agregar producto a la venta
const agregarProducto = () => {
  if (!productoSeleccionado.value) return;

  // Verificar si hay suficiente stock
  if (cantidad.value > productoSeleccionado.value.stock) {
    stockAlert.value = `No hay suficiente stock de "${productoSeleccionado.value.nombre}". Stock disponible: ${productoSeleccionado.value.stock}`;
    cantidad.value = productoSeleccionado.value.stock;
    return;
  }

  // Buscar si el producto ya está en la lista
  const index = productosVenta.value.findIndex((p) => p.id === productoSeleccionado.value.id);

  if (index !== -1) {
    // Sumar la cantidad al producto existente
    const stockDisponible = productoSeleccionado.value.stock;
    const cantidadTotal = productosVenta.value[index].cantidad + cantidad.value;

    if (cantidadTotal > stockDisponible) {
      stockAlert.value = `No hay suficiente stock de "${productoSeleccionado.value.nombre}". Stock disponible: ${stockDisponible}`;
      return;
    }

    productosVenta.value[index].cantidad = cantidadTotal;
  } else {
    // Agregar nuevo producto a la lista
    productosVenta.value.push({
      id: productoSeleccionado.value.id,
      codigo: productoSeleccionado.value.codigo,
      nombre: productoSeleccionado.value.nombre,
      precio: productoSeleccionado.value.precio,
      cantidad: cantidad.value,
      stockDisponible: productoSeleccionado.value.stock - cantidad.value
    });
  }

  // Actualizar stock temporal
  const prodIndex = inventario.value.findIndex((p) => p.id === productoSeleccionado.value.id);
  if (prodIndex !== -1) {
    inventario.value[prodIndex].stock -= cantidad.value;
  }

  // Limpiar campos
  searchTerm.value = "";
  productoSeleccionado.value = null;
  cantidad.value = 1;
  stockAlert.value = "";
};

// Validar y ajustar cantidad de un producto
const validarCantidad = (index) => {
  const producto = productosVenta.value[index];
  const stockTotal = producto.stockDisponible + producto.cantidad;

  // Asegurarnos que la cantidad sea un número
  if (isNaN(producto.cantidad) || producto.cantidad < 1) {
    producto.cantidad = 1;
  }

  // No permitir más del stock disponible
  if (producto.cantidad > stockTotal) {
    stockAlert.value = `No hay suficiente stock de "${producto.nombre}". Stock máximo: ${stockTotal}`;
    producto.cantidad = stockTotal;
  } else {
    stockAlert.value = "";
  }
};

// Ajustar cantidad con botones +/-
const ajustarCantidad = (index, delta) => {
  const producto = productosVenta.value[index];
  const nuevaCantidad = producto.cantidad + delta;

  if (nuevaCantidad >= 1 && nuevaCantidad <= producto.stockDisponible + producto.cantidad) {
    producto.cantidad = nuevaCantidad;
    stockAlert.value = "";
  }
};

// Eliminar producto de la venta
const eliminarProducto = (index) => {
  const producto = productosVenta.value[index];

  // Restaurar stock al inventario
  const prodIndex = inventario.value.findIndex((p) => p.id === producto.id);
  if (prodIndex !== -1) {
    inventario.value[prodIndex].stock += producto.cantidad;
  }

  // Eliminar de la lista
  productosVenta.value.splice(index, 1);
  stockAlert.value = "";
};

// Cancelar toda la venta
const cancelarVenta = () => {
  // Restaurar todo el stock al inventario
  productosVenta.value.forEach((producto) => {
    const prodIndex = inventario.value.findIndex((p) => p.id === producto.id);
    if (prodIndex !== -1) {
      inventario.value[prodIndex].stock += producto.cantidad;
    }
  });

  // Limpiar todos los campos
  cantidad.value = 1;
  searchTerm.value = "";
  productoSeleccionado.value = null;
  productosVenta.value = [];
  stockAlert.value = "";
  montoRecibido.value = 0;
};

// Cálculos
const subtotal = computed(() => productosVenta.value.reduce((sum, p) => sum + p.precio * p.cantidad, 0));

const iva = computed(() => subtotal.value * 0.16);
const total = computed(() => subtotal.value + iva.value);
const cambio = computed(() => montoRecibido.value - total.value);

// Procesar el pago (mostrar modal)
const procesarPago = () => {
  if (productosVenta.value.length === 0) return;

  // Verificar si hay un corte de caja abierto
  if (!cashAudit.value.isOpen) {
    alert("No hay un corte de caja abierto. No se pueden procesar ventas.");
    return;
  }

  montoRecibido.value = total.value; // Por defecto, poner el total exacto
  pagoModalInstance.show();
};

// Finalizar la venta
const finalizarVenta = async () => {
  if (cambio.value < 0 || !cashAudit.value.isOpen) return;

  try {
    // Crear objeto de venta según la estructura de la tabla sale
    const saleData = {
      business_id: business.value.id,
      user_id: user.value.id,
      cash_audit_id: cashAudit.value.id,
      sale_date: new Date().toISOString(),
      total: total.value
    };

    // Crear la venta principal
    const saleResponse = await axios.post("http://localhost:3000/api/sales", saleData);
    const saleId = saleResponse.data.id;

    // Crear los detalles de venta según la estructura de la tabla sale_detail
    const saleDetailsPromises = productosVenta.value.map((producto) => {
      return axios.post("http://localhost:3000/api/sale-details", {
        sale_id: saleId,
        article_id: producto.id,
        quantity: producto.cantidad,
        unit_price: producto.precio,
        total_price: producto.precio * producto.cantidad
      });
    });

    // Esperar a que se guarden todos los detalles
    await Promise.all(saleDetailsPromises);

    // Actualizar el inventario en la base de datos
    const inventoryUpdatePromises = productosVenta.value.map((producto) => {
      return axios.put(`http://localhost:3000/api/articles/${producto.id}/stock`, {
        quantity: -producto.cantidad
      });
    });

    // Esperar a que se actualice el inventario
    await Promise.all(inventoryUpdatePromises);

    // Si todo salió bien, limpiar y cerrar modal
    pagoModalInstance.hide();

    // Mensaje de éxito
    alert(`Venta finalizada con éxito. ID de venta: ${saleId}`);

    // Limpiar para una nueva venta
    cantidad.value = 1;
    searchTerm.value = "";
    productoSeleccionado.value = null;
    productosVenta.value = [];
    stockAlert.value = "";
    montoRecibido.value = 0;
  } catch (error) {
    console.error("Error al procesar venta:", error);
    alert("Hubo un error al procesar la venta. Intente nuevamente.");
  }
};
</script>

<style scoped>
.card-title {
  font-weight: 600;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
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
