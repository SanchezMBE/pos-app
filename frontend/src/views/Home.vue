<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Page Content -->
    <div id="page-content-wrapper" class="flex-grow-1 bg-light">
      <div class="container-fluid p-4">
        <div class="row mb-4">
          <div class="col-12">
            <h1 class="fw-bold">Panel de Control</h1>
          </div>
        </div>

        <!-- Tarjetas de acceso rápido -->
        <div class="row mb-5 g-3">
          <div class="col-12 col-md-6 col-lg-3">
            <router-link to="/ventas" class="text-decoration-none">
              <div class="card action-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                  <div
                    class="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10"
                  >
                    <i class="bi bi-cart text-primary" style="font-size: 2rem"></i>
                  </div>
                  <h5 class="card-title">Nueva Venta</h5>
                </div>
              </div>
            </router-link>
          </div>

          <div class="col-12 col-md-6 col-lg-3" v-if="user.role === 'admin'">
            <router-link to="/inventario" class="text-decoration-none">
              <div class="card action-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                  <div
                    class="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10"
                  >
                    <i class="bi bi-box-seam text-success" style="font-size: 2rem"></i>
                  </div>
                  <h5 class="card-title">Administrar Inventario</h5>
                </div>
              </div>
            </router-link>
          </div>

          <div class="col-12 col-md-6 col-lg-3">
            <router-link to="/historial-ventas" class="text-decoration-none">
              <div class="card action-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                  <div
                    class="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10"
                  >
                    <i class="bi bi-search text-info" style="font-size: 2rem"></i>
                  </div>
                  <h5 class="card-title">Buscar Ventas</h5>
                </div>
              </div>
            </router-link>
          </div>

          <div class="col-12 col-md-6 col-lg-3" v-if="user.role === 'admin'">
            <router-link to="/corte-caja" class="text-decoration-none">
              <div class="card action-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                  <div
                    class="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10"
                  >
                    <i class="bi bi-receipt-cutoff text-warning" style="font-size: 2rem"></i>
                  </div>
                  <h5 class="card-title">Corte de Caja</h5>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Resumen para administradores -->
        <template v-if="user.role === 'admin'">
          <div class="row mb-3">
            <div class="col-12">
              <h2 class="fw-bold">Resumen del Negocio</h2>
            </div>
          </div>

          <div class="row mb-5 g-3">
            <!-- Tarjetas de estadísticas -->
            <div class="col-12 col-sm-6 col-lg-3">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                  <div class="text-muted small text-uppercase">Ventas hoy</div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">$1,250</h3>
                    <span class="badge bg-success ms-2">+15%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                  <div class="text-muted small text-uppercase">Transacciones</div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">24</h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                  <div class="text-muted small text-uppercase">Productos Bajo Stock</div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">5</h3>
                    <span class="badge bg-danger ms-2">Alerta</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                  <div class="text-muted small text-uppercase">Venta Promedio</div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">$52.08</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Para cajeros -->
        <template v-else>
          <div class="row mb-3">
            <div class="col-12">
              <h2 class="fw-bold">Información de la Sesión</h2>
            </div>
          </div>

          <div class="row mb-5 g-3">
            <div class="col-12 col-md-6">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <div class="text-muted small text-uppercase">Caja actual</div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">Caja #1</h3>
                    <span class="badge bg-success ms-2">Activa</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <div class="text-muted small text-uppercase">Mis ventas hoy</div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">12</h3>
                    <span class="ms-2 text-muted">Transacciones</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
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
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css");

#wrapper {
  min-height: 100vh;
}

.list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.action-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
}
</style>
