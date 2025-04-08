<template>
  <div class="d-flex" id="wrapper">
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light cntainer-fluid p-4"> 
      <div class="card shadow-lg border-0">
        <div class="card-body">
          <h4 class="card-title mb-4 text-primary">Nueva Venta</h4>

          <!-- Cliente -->
          <div class="mb-4">
            <label class="form-label fw-bold">Cliente</label>
            <input
              v-model="cliente"
              type="text"
              class="form-control form-control-lg"
              placeholder="Nombre del cliente"
            />
          </div>

          <!-- Cantidad y Producto -->
          <div class="row g-3 align-items-end">
            <div class="col-md-2">
              <label class="form-label fw-bold">Cantidad</label>
              <div class="input-group">
                <button class="btn btn-outline-secondary" @click="cantidad = Math.max(1, cantidad - 1)">-</button>
                <input v-model="cantidad" type="text" class="form-control text-center" />
                <button class="btn btn-outline-secondary" @click="cantidad++">+</button>
              </div>
            </div>

            <div class="col-md-8">
              <label class="form-label fw-bold">Producto</label>
              <div class="input-group">
                <input
                  v-model="producto"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Buscar producto"
                />
                <button class="btn btn-outline-danger">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>

            <div class="col-md-2">
              <button class="btn btn-success btn-lg w-100" @click="agregarProducto">
                <i class="bi bi-cart-plus me-2"></i> Agregar
              </button>
            </div>
          </div>

          <!-- Tabla -->
          <div class="table-responsive mt-4">
            <table class="table table-striped table-hover align-middle">
              <thead class="table-primary">
                <tr>
                  <th>Cantidad</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, index) in productos" :key="index">
                  <td>{{ p.cantidad }}</td>
                  <td>{{ p.nombre }}</td>
                  <td>${{ p.precio.toFixed(2) }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="eliminarProducto(index)">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </td>
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
          <div class="d-flex justify-content-center mt-4 gap-4">
            <button class="btn btn-primary btn-lg"><i class="bi bi-currency-dollar"></i> Pagar</button>
            <button class="btn btn-danger btn-lg" @click="cancelarNota">
              <i class="bi bi-x-circle me-2"></i> Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";

const cliente = ref("");
const cantidad = ref(1);
const producto = ref("");
const productos = ref([]);
const user = ref({
  username: "Usuario",
  role: ""
});
const data = ref([]);

const agregarProducto = () => {
  if (producto.value.trim() === "") return;
  productos.value.push({
    nombre: producto.value,
    cantidad: cantidad.value,
    precio: 100,
    descuento: 0
  });
  producto.value = "";
  cantidad.value = 1;
};

const eliminarProducto = (index) => {
  productos.value.splice(index, 1);
};

const cancelarNota = () => {
  cliente.value = "";
  cantidad.value = 1;
  producto.value = "";
  productos.value = [];
};

const subtotal = computed(() => productos.value.reduce((sum, p) => sum + p.precio * p.cantidad, 0));

const descuento = computed(() => productos.value.reduce((sum, p) => sum + p.descuento, 0));

const iva = computed(() => subtotal.value * 0.16);
const total = computed(() => subtotal.value - descuento.value + iva.value);
const pendiente = computed(() => total.value);

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("authToken");

  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      console.log("Usuario cargado:", user.value);

      // Usuario cargado correctamente
    } catch (e) {
      console.error("Error al parsear datos del usuario:", e);
    }
  }

  if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
});
</script>

<style scoped>
#wrapper {
  min-height: 100vh;
}

.card-title {
  font-weight: 600;
}
</style>
