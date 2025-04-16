<template>
  <div class="bg-dark text-white border-right" id="sidebar-wrapper">
    <router-link to="/pos" class="sidebar-heading py-4 px-3 d-flex align-items-center text-white text-decoration-none">
      <a>
        <img src="../assets/favicon.ico" alt="Retail-Insight Logo" class="img-fluid me-3" style="max-height: 60px" />
      </a>
      <div>
        <h4 class="mb-0 fw-bold">Store POS</h4>
        <small>Control de Ventas</small>
      </div>
    </router-link>

    <div class="list-group list-group-flush">
      <router-link to="/nueva-venta" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3">
        <i class="bi bi-cart me-2"></i> Nueva Venta
      </router-link>

      
      <template v-if="user.role === 'admin'">
        <router-link to="/inventario" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3">
          <i class="bi bi-box-seam me-2"></i> Inventario
        </router-link>
        
        <router-link
          to="/historial-ventas"
          class="list-group-item list-group-item-action bg-dark text-white border-0 py-3"
        >
          <i class="bi bi-clock-history me-2"></i> Historial de Ventas
        </router-link>

        <router-link to="/registros-turnos" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3">
          <i class="bi bi-receipt-cutoff me-2"></i> Registro de Turnos
        </router-link>

        <!-- <router-link to="/reportes" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3">
          <i class="bi bi-graph-up me-2"></i> Reportes
        </router-link> -->

        <router-link to="/usuarios" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3">
          <i class="bi bi-people me-2"></i> Usuarios
        </router-link>
      </template>
    </div>

    <div class="mt-auto border-top p-3">
      <div class="d-flex align-items-center">
        <div
          class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
          style="width: 40px; height: 40px"
        >
          {{ getUserInitials() }}
        </div>
        <div class="flex-grow-1">
          <div class="fw-bold">{{ user.username }}</div>
          <small>{{ user.role === "admin" ? "Administrador" : user.role === "cashier" ? "Cajero" : "" }}</small>
        </div>
        <button @click="handleSignOut" class="btn btn-sm btn-outline-light">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  user: Object
});

const router = useRouter();

const getUserInitials = () => {
  const name = props.user?.username || "U";
  return name.charAt(0).toUpperCase();
};

const handleSignOut = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  router.push("/");
};
</script>

<style scoped>

#sidebar-wrapper {
  width: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
