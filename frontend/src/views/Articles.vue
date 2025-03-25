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
    data.value = [
      {
        description: "Tortillas",
        category: "Abarrotes",
        code: "1",
        barcode: "7501234567890",
        price: 199.99,
        cost: 120.0,
        stock: 25,
      },
      {
        description: "Teclado mecánico",
        category: "Periféricos",
        code: "T456",
        barcode: "7509876543210",
        price: 499.99,
        cost: 300.0,
        stock: 10,
      },
    ];
  }
});
</script>

<template>
  <div class="container">
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
