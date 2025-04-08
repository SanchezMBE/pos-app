<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light cntainer-fluid p-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

DataTable.use(DataTablesCore);

const data = ref([]);
const selectedItem = ref(null);
const alertMessage = ref("");
const alertType = ref("info"); // success, danger, warning, info
const user = ref({
  username: "Usuario",
  role: ""
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

const openAddModal = () => {
  selectedItem.value = null;
  // implementar la lógica para abrir un modal de añadir producto
};

const editItem = (item) => {
  selectedItem.value = { ...item };
  // implementar la lógica para abrir un modal de edición
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
  } else {
    // Si no hay token, podrías redirigir al login o mostrar un mensaje
    showAlert("No se ha iniciado sesión. Algunas funciones podrían estar limitadas.", "warning");
  }

  try {
    const response = await axios.get("http://localhost:3000/api/admin/articles");
    if (response.data) {
      data.value = response.data.data;
    }
  } catch (error) {}
});
</script>
