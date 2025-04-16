<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <h2 class="fw-bold">Historial de ventas</h2>

      <!-- Alerta para mostrar mensajes -->
      <div v-if="alertMessage" :class="`alert alert-${alertType} alert-dismissible fade show`" role="alert">
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="closeAlert" aria-label="Close"></button>
      </div>

      <div class="card shadow mb-4">
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
                <th>Fecha y hora</th>
                <th>Nombre completo</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Total</th>
              </tr>
            </thead>
            <template #tbody="{ data }">
              <tr v-for="item in data" :key="item.id">
                <td>{{ item.sale_date }}</td>
                <td>{{ item.full_name }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.role }}</td>
                <td>{{ item.total }}</td>
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
const alertMessage = ref("");
const alertType = ref("info"); // success, danger, warning, info
const user = ref({
  username: "Usuario",
  role: ""
});

const columns = [
  { title: "Fecha y hora", data: "sale_date" },
  { title: "Nombre completo", data: "full_name" },
  { title: "Usuario", data: "username" },
  { title: "Rol", data: "role" },
  { title: "Total", data: "total" }
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

const loadSales = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/${user.value.role}/sales`);
    data.value = response.data.data;
    // Formatear la fecha y hora
    data.value.forEach((item) => {
      item.sale_date = new Date(
        item.sale_date
      ).toLocaleString("es-MX", {
        timeZone: "America/Mexico_City",
        hour12: false,
      });
    });
  } catch (error) {
    console.error("Error al cargar ventas:", error);
    showAlert("No se pudieron cargar los ventas. Inténtalo nuevamente.", "danger");
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
    showAlert("Inicie sesión para continuar", "warning");
  }

  // Cargar ventas
  await loadSales();
});
</script>
