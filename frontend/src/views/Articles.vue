<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <h2 class="fw-bold">Inventario de Artículos</h2>

      <!-- Alerta para mostrar mensajes -->
      <div v-if="alertMessage" :class="`alert alert-${alertType} alert-dismissible fade show`" role="alert">
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="closeAlert" aria-label="Close"></button>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 class="m-0 fw-bold">Lista de Artículos</h6>
          <button class="btn btn-primary btn-sm" @click="openAddModal">
            <i class="bi bi-plus-circle me-1"></i> Nuevo Artículo
          </button>
        </div>
        <div class="card-body">
          <DataTable
            :data="data"
            :columns="columns"
            class="table table-striped table-bordered"
            :options="{
              responsive: true,
              language: {
                url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
              }
            }"
          >
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Código</th>
                <th>Código de Barras</th>
                <th>Precio</th>
                <th>Costo</th>
                <th>Existencias</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <template #tbody="{ data }">
              <tr v-for="item in data" :key="item.id">
                <td>{{ item.description }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.code }}</td>
                <td>{{ item.barcode }}</td>
                <td>${{ item.price.toFixed(2) }}</td>
                <td>${{ item.cost.toFixed(2) }}</td>
                <td>
                  <span
                    :class="
                      item.stock <= 5 ? 'badge bg-danger' : item.stock <= 10 ? 'badge bg-warning' : 'badge bg-success'
                    "
                  >
                    {{ item.stock }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button @click="editItem(item)" class="btn btn-info">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button @click="confirmDelete(item)" class="btn btn-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Modal para Agregar/Editar Producto -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      ref="modalElement"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="productModalLabel">
              {{ selectedItem ? "Editar Artículo" : "Nuevo Artículo" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="selectedItem ? updateItem() : addItem()">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="description" class="form-label">Descripción</label>
                  <input type="text" class="form-control" id="description" v-model="formItem.description" required />
                </div>
                <div class="col-md-6">
                  <label for="category" class="form-label">Categoría</label>
                  <select class="form-select" id="category" v-model="formItem.category_id" required>
                    <option value="" disabled selected>Selecciona una categoría</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="code" class="form-label">Código</label>
                  <input type="text" class="form-control" id="code" v-model="formItem.code" required />
                </div>
                <div class="col-md-6">
                  <label for="barcode" class="form-label">Código de Barras</label>
                  <input type="text" class="form-control" id="barcode" v-model="formItem.barcode" />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="price" class="form-label">Precio de Venta ($)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model="formItem.price"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div class="col-md-4">
                  <label for="cost" class="form-label">Costo ($)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="cost"
                    v-model="formItem.cost"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div class="col-md-4">
                  <label for="stock" class="form-label">Existencias</label>
                  <input type="number" class="form-control" id="stock" v-model="formItem.stock" min="0" required />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="selectedItem ? updateItem() : addItem()">
              {{ selectedItem ? "Actualizar" : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Modal } from "bootstrap";

DataTable.use(DataTablesCore);

const data = ref([]);
const selectedItem = ref(null);
const alertMessage = ref("");
const alertType = ref("info"); // success, danger, warning, info
const user = ref({
  username: "Usuario",
  role: ""
});
const categories = ref([]);
const modalElement = ref(null);
let productModal = null;

// Objeto reactivo para el formulario
const formItem = reactive({
  description: "",
  category_id: "",
  code: "",
  barcode: "",
  price: 0,
  cost: 0,
  stock: 0
});

const columns = [
  { data: "description" },
  { data: "category_name" },
  { data: "code" },
  { data: "barcode" },
  { data: "price" },
  { data: "cost" },
  { data: "stock" },
  { data: null, defaultContent: "", orderable: false }
];

const showAlert = (message, type = "info") => {
  alertMessage.value = message;
  alertType.value = type;

  // Auto-dismiss después de 5 segundos
  setTimeout(() => {
    closeAlert();
  }, 5000);
};

const closeAlert = () => {
  alertMessage.value = "";
};

const loadInventory = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/admin/articles");
    data.value = response.data;
  } catch (error) {
    console.error("Error al cargar artículos:", error);
    showAlert("No se pudieron cargar los artículos. Inténtalo nuevamente.", "danger");
  }
};

const loadCategories = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/admin/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    showAlert("No se pudieron cargar las categorías. Inténtalo nuevamente.", "danger");
  }
};

const resetForm = () => {
  formItem.description = "";
  formItem.category_id = "";
  formItem.code = "";
  formItem.barcode = "";
  formItem.price = 0;
  formItem.cost = 0;
  formItem.stock = 0;
};

const openAddModal = () => {
  selectedItem.value = null;
  resetForm();
  productModal.show();
};

const editItem = (item) => {
  selectedItem.value = { ...item };
  // Cargar datos del artículo en el formulario
  formItem.description = item.description;
  formItem.category_id = item.category_id;
  formItem.code = item.code;
  formItem.barcode = item.barcode;
  formItem.price = item.price;
  formItem.cost = item.cost;
  formItem.stock = item.stock;

  productModal.show();
};

const confirmDelete = (item) => {
  if (confirm(`¿Estás seguro de eliminar el artículo "${item.description}"?`)) {
    deleteItem(item.id);
  }
};

const deleteItem = async (itemId) => {
  try {
    await axios.delete(`http://localhost:3000/api/admin/articles/${itemId}`);
    showAlert("Artículo eliminado correctamente", "success");
    await loadInventory(); // Recargar la tabla
  } catch (error) {
    console.error("Error al eliminar artículo:", error);
    showAlert("No se pudo eliminar el artículo. Inténtalo nuevamente.", "danger");
  }
};

const addItem = async () => {
  try {
    await axios.post("http://localhost:3000/api/admin/articles", formItem);
    showAlert("Artículo agregado correctamente", "success");
    await loadInventory(); // Recargar la tabla
    productModal.hide(); // Cerrar modal
  } catch (error) {
    console.error("Error al agregar artículo:", error);
    showAlert("No se pudo agregar el artículo. Verifica los datos e inténtalo nuevamente.", "danger");
  }
};

const updateItem = async () => {
  try {
    await axios.put(`http://localhost:3000/api/admin/articles/${selectedItem.value.id}`, formItem);
    showAlert("Artículo actualizado correctamente", "success");
    await loadInventory(); // Recargar la tabla
    productModal.hide(); // Cerrar modal
  } catch (error) {
    console.error("Error al actualizar artículo:", error);
    showAlert("No se pudo actualizar el artículo. Verifica los datos e inténtalo nuevamente.", "danger");
  }
};

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("authToken");

  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      console.log("Usuario cargado:", user.value);
    } catch (e) {
      console.error("Error al parsear datos del usuario:", e);
    }
  }

  if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  } else {
    showAlert("No se ha iniciado sesión. Algunas funciones podrían estar limitadas.", "warning");
  }

  // Inicializar el modal de Bootstrap
  productModal = new Modal(modalElement.value);

  // Cargar categorías y artículos
  await loadCategories();
  await loadInventory();
});
</script>
