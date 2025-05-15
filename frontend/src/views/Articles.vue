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
        <div class="card-header py-3 d-flex">
          <button class="btn btn-primary btn-sm ms-auto" @click="openAddModal">
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
                sProcessing: 'Procesando...',
                sLengthMenu: 'Mostrar _MENU_ registros',
                sZeroRecords: 'No se encontraron resultados',
                sEmptyTable: 'Ningún dato disponible en esta tabla',
                sInfo: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                sInfoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
                sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
                sSearch: 'Buscar:',
                sInfoThousands: ',',
                sLoadingRecords: 'Cargando...',
                oAria: {
                  sSortAscending: ': Activar para ordenar la columna de manera ascendente',
                  sSortDescending: ': Activar para ordenar la columna de manera descendente'
                },
                buttons: {
                  copy: 'Copiar',
                  colvis: 'Visibilidad'
                }
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
                    <button @click="editItem(item)" class="btn btn-info" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button @click="openDeleteModal(item)" class="btn btn-danger" title="Eliminar">
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
                  <input
                    type="text"
                    class="form-control"
                    id="code"
                    v-model="formItem.code"
                    required
                    @input="validateCode"
                  />
                  <div class="form-text text-danger" v-if="errors.codeExists">
                    Este código ya existe en la base de datos.
                  </div>
                  <div class="form-text text-danger" v-if="errors.codeDuplicate">
                    El código no puede ser igual al código de barras.
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="barcode" class="form-label">Código de Barras</label>
                  <input
                    type="text"
                    class="form-control"
                    id="barcode"
                    v-model="formItem.barcode"
                    maxlength="13"
                    @input="validateBarcode"
                  />
                  <div class="form-text text-danger" v-if="errors.barcodeFormat">
                    El código de barras debe contener solo números.
                  </div>
                  <div class="form-text text-danger" v-if="errors.barcodeLength">
                    El código de barras debe tener máximo 13 caracteres.
                  </div>
                  <div class="form-text text-danger" v-if="errors.barcodeDuplicate">
                    El código de barras no puede ser igual al código.
                  </div>
                  <div class="form-text text-danger" v-if="errors.barcodeExists">
                    Este código de barras ya existe en la base de datos.
                  </div>
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
            <button
              type="button"
              class="btn btn-primary"
              @click="selectedItem ? updateItem() : addItem()"
              :disabled="hasErrors"
            >
              {{ selectedItem ? "Actualizar" : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Confirmar Eliminación -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
      ref="deleteModalElement"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="deleteModalLabel">Confirmar Eliminación</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              ¿Estás seguro de eliminar el artículo "<strong>{{ itemToDelete ? itemToDelete.description : "" }}</strong
              >"?
            </p>
            <p class="text-danger mt-3 mb-0">
              <i class="bi bi-exclamation-triangle me-2"></i>Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="confirmDeleteItem">
              <i class="bi bi-trash me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Modal } from "bootstrap";

DataTable.use(DataTablesCore);

const data = ref([]);
const selectedItem = ref(null);
const itemToDelete = ref(null);
const alertMessage = ref("");
const alertType = ref("info"); // success, danger, warning, info
const user = ref({
  username: "Usuario",
  role: ""
});
const categories = ref([]);
const modalElement = ref(null);
const deleteModalElement = ref(null);
let productModal = null;
let deleteModal = null;

// Objeto para manejar errores de validación
const errors = reactive({
  codeExists: false,
  barcodeExists: false,
  codeDuplicate: false,
  barcodeDuplicate: false,
  barcodeFormat: false,
  barcodeLength: false
});

// Calcular si hay errores para deshabilitar el botón de guardar
const hasErrors = computed(() => {
  return Object.values(errors).some((value) => value === true);
});

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

// Validar que el código no esté duplicado
const validateCode = async () => {
  // Validar que el código no sea igual al código de barras
  errors.codeDuplicate = formItem.code !== "" && formItem.code === formItem.barcode;

  // Validar que el código no exista ya en la base de datos
  if (formItem.code && (!selectedItem.value || formItem.code !== selectedItem.value.code)) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/${user.value.role}/articles/check-code/${formItem.code}`
      );
      errors.codeExists = response.data.exists;
    } catch (error) {
      console.error("Error al verificar código:", error);
    }
  } else {
    errors.codeExists = false;
  }
};

// Validar código de barras
const validateBarcode = () => {
  if (formItem.barcode) {
    // Validar que sea sólo números
    errors.barcodeFormat = !/^\d*$/.test(formItem.barcode);

    // Validar longitud máxima (aunque ya se limita con maxlength="13")
    errors.barcodeLength = formItem.barcode.length > 13;

    // Validar que no sea igual al código
    errors.barcodeDuplicate = formItem.barcode !== "" && formItem.barcode === formItem.code;

    // Validar que no exista ya en la base de datos
    checkBarcodeExists();
  } else {
    // Reiniciar errores si está vacío
    errors.barcodeFormat = false;
    errors.barcodeLength = false;
    errors.barcodeDuplicate = false;
    errors.barcodeExists = false;
  }
};

// Verificar si el código de barras ya existe
const checkBarcodeExists = async () => {
  if (formItem.barcode && (!selectedItem.value || formItem.barcode !== selectedItem.value.barcode)) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/${user.value.role}/articles/check-barcode/${formItem.barcode}`
      );
      errors.barcodeExists = response.data.exists;
    } catch (error) {
      console.error("Error al verificar código de barras:", error);
    }
  } else {
    errors.barcodeExists = false;
  }
};

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
    const response = await axios.get(`http://localhost:3000/api/${user.value.role}/articles`);
    data.value = response.data.data;
  } catch (error) {
    console.error("Error al cargar artículos:", error);
    showAlert("No se pudieron cargar los artículos. Inténtalo nuevamente.", "danger");
  }
};

const loadCategories = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/${user.value.role}/categories`);
    categories.value = response.data.data;
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

  // Resetear errores
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });
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

  // Resetear errores
  Object.keys(errors).forEach((key) => {
    errors[key] = false;
  });

  productModal.show();
};

// Abrir modal de confirmación para eliminar
const openDeleteModal = (item) => {
  itemToDelete.value = { ...item };
  deleteModal.show();
};

// Confirmar eliminación desde el modal
const confirmDeleteItem = async () => {
  if (itemToDelete.value) {
    try {
      await axios.delete(`http://localhost:3000/api/${user.value.role}/articles/${itemToDelete.value.id}`);
      showAlert("Artículo eliminado correctamente", "success");
      await loadInventory(); // Recargar la tabla
      deleteModal.hide(); // Cerrar modal de confirmación
    } catch (error) {
      console.error("Error al eliminar artículo:", error);
      showAlert("No se pudo eliminar el artículo. Inténtalo nuevamente.", "danger");
    }
  }
};

const validateForm = () => {
  // Validar código y código de barras
  validateCode();
  validateBarcode();

  return !hasErrors.value;
};

const addItem = async () => {
  if (!validateForm()) {
    showAlert("Por favor, corrige los errores en el formulario", "warning");
    return;
  }

  try {
    await axios.post(`http://localhost:3000/api/${user.value.role}/articles`, formItem);
    showAlert("Artículo agregado correctamente", "success");
    await loadInventory(); // Recargar la tabla
    productModal.hide(); // Cerrar modal
  } catch (error) {
    console.error("Error al agregar artículo:", error);
    showAlert("No se pudo agregar el artículo. Verifica los datos e inténtalo nuevamente.", "danger");
  }
};

const updateItem = async () => {
  if (!validateForm()) {
    showAlert("Por favor, corrige los errores en el formulario", "warning");
    return;
  }

  try {
    await axios.put(`http://localhost:3000/api/${user.value.role}/articles/${selectedItem.value.id}`, formItem);
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

  if (storedUser && storedToken) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.error("Error al parsear datos del usuario:", e);
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    // Inicializar los modales de Bootstrap
    productModal = new Modal(modalElement.value);
    deleteModal = new Modal(deleteModalElement.value);

    // Cargar categorías y artículos
    await loadCategories();
    await loadInventory();
  } else {
    showAlert("Inicie sesión para continuar", "warning");
  }
});
</script>
