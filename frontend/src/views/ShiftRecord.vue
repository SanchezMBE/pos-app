<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Page Content -->
    <div id="page-content-wrapper" class="flex-grow-1 bg-light">
      <div class="container-fluid p-4">
        <div class="row mb-4">
          <div class="col-12">
            <h2 class="fw-bold">Registro de Turnos</h2>
          </div>
        </div>

        <!-- Coming soon -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";

const user = ref({
  username: "Usuario",
  role: ""
});

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("authToken");

  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      // Configurar token para futuras peticiones
    } catch (e) {
      console.error("Error al parsear datos del usuario:", e);
    }
  }
  if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
});
</script>

<style>
#wrapper {
  min-height: 100vh;
}
</style>
