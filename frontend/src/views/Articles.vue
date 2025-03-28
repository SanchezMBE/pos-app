<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-bs5";
import "bootstrap";

DataTable.use(DataTablesCore);

const data = ref([]); // Aquí se guarda la data

const columns = [
  { data: "description" },
  { data: "category" },
  { data: "code" },
  { data: "barcode" },
  { data: "price" },
  { data: "cost" },
  { data: "stock" },
];

onMounted(async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/admin/articles",
    );
    data.value = response.data.data; // Asegúrate de que la respuesta tenga el array de objetos
  } catch (error) {
    console.error("Error al cargar artículos:", error);
  }
});
</script>

<template>
  <div class="container">
    <h1>Artículos</h1>
    <DataTable
      :data="data"
      :columns="columns"
      class="table table-hover table-striped"
      width="100%"
    >
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Código</th>
          <th>Código de barras</th>
          <th>Precio</th>
          <th>Costo</th>
          <th>Stock</th>
        </tr>
      </thead>
    </DataTable>
  </div>
</template>
