<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <div class="bg-dark text-white border-right" id="sidebar-wrapper">
      <div class="sidebar-heading py-4 px-3 d-flex align-items-center">
        <a href="/pos">
          <img
            src="C:\Users\Admin\OneDrive\Documentos\ProyectoPuntoVentaMedina\pos-app\frontend\src\assets\favicon.ico"
            alt="Retail-Insight Logo"
            class="img-fluid me-3"
            style="max-height: 60px"
          />
        </a>
        <div>
          <h4 class="mb-0 fw-bold">Store POS</h4>
          <small>Control de Ventas</small>
        </div>
      </div>

      <div class="list-group list-group-flush">
        <!-- Opciones para ambos roles -->
        <router-link
          to="/ventas"
          class="list-group-item list-group-item-action bg-dark text-white border-0 py-3"
        >
          <i class="bi bi-cart me-2"></i> Punto de Venta
        </router-link>

        <router-link
          to="/historial-ventas"
          class="list-group-item list-group-item-action bg-dark text-white border-0 py-3"
        >
          <i class="bi bi-clock-history me-2"></i> Historial de Ventas
        </router-link>

        <!-- Opciones solo para administradores -->
        <template v-if="userRole === 'Administrador'">
          <router-link
            to="/inventario"
            class="list-group-item list-group-item-action bg-dark text-white border-0 py-3"
          >
            <i class="bi bi-box-seam me-2"></i> Inventario
          </router-link>

          <router-link
            to="/corte-caja"
            class="list-group-item list-group-item-action bg-dark text-white border-0 py-3"
          >
            <i class="bi bi-receipt-cutoff me-2"></i> Corte de Caja
          </router-link>

          <router-link
            to="/reportes"
            class="list-group-item list-group-item-action bg-dark text-white border-0 py-3"
          >
            <i class="bi bi-graph-up me-2"></i> Reportes
          </router-link>

          <router-link
            to="/usuarios"
            class="list-group-item list-group-item-action bg-dark text-white border-0 py-3"
          >
            <i class="bi bi-people me-2"></i> Usuarios
          </router-link>
        </template>
      </div>

      <!-- Usuario y cierre de sesión -->
      <div class="mt-auto border-top p-3">
        <div class="d-flex align-items-center">
          <div
            class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
            style="width: 40px; height: 40px"
          >
            {{ getUserInitials() }}
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold">{{ getUserDisplayName() }}</div>
            <small>{{ userRole }}</small>
          </div>
          <button @click="handleSignOut" class="btn btn-sm btn-outline-light">
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

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
            <router-link to="/Sales" class="text-decoration-none">
              <div class="card action-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                  <div
                    class="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10"
                  >
                    <i
                      class="bi bi-cart text-primary"
                      style="font-size: 2rem"
                    ></i>
                  </div>
                  <h5 class="card-title">Nueva Venta</h5>
                </div>
              </div>
            </router-link>
          </div>

          <div
            class="col-12 col-md-6 col-lg-3"
            v-if="userRole === 'Administrador'"
          >
            <router-link to="/inventario" class="text-decoration-none">
              <div class="card action-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                  <div
                    class="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10"
                  >
                    <i
                      class="bi bi-box-seam text-success"
                      style="font-size: 2rem"
                    ></i>
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
                    <i
                      class="bi bi-search text-info"
                      style="font-size: 2rem"
                    ></i>
                  </div>
                  <h5 class="card-title">Buscar Ventas</h5>
                </div>
              </div>
            </router-link>
          </div>

          <div
            class="col-12 col-md-6 col-lg-3"
            v-if="userRole === 'Administrador'"
          >
            <router-link to="/corte-caja" class="text-decoration-none">
              <div class="card action-card h-100 shadow-sm">
                <div class="card-body text-center p-4">
                  <div
                    class="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10"
                  >
                    <i
                      class="bi bi-receipt-cutoff text-warning"
                      style="font-size: 2rem"
                    ></i>
                  </div>
                  <h5 class="card-title">Corte de Caja</h5>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Resumen para administradores -->
        <template v-if="userRole === 'Administrador'">
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
                  <div class="text-muted small text-uppercase">
                    Transacciones
                  </div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">24</h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                  <div class="text-muted small text-uppercase">
                    Productos Bajo Stock
                  </div>
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
                  <div class="text-muted small text-uppercase">
                    Venta Promedio
                  </div>
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
                  <div class="text-muted small text-uppercase">
                    Mis ventas hoy
                  </div>
                  <div class="d-flex align-items-center mt-2">
                    <h3 class="mb-0 fw-bold">12</h3>
                    <span class="ms-2 text-muted">Transacciones</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Productos - visible para ambos roles -->
        <div class="row mb-3">
          <div class="col-12">
            <h2 class="fw-bold">Productos</h2>
          </div>
        </div>

        <div class="row">
    <div class="col-12">
      <div class="card border-0 shadow-lg rounded-4">
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover table-striped align-middle text-center">
              <thead class="table-dark">
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Código</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Ventas</th>
                  <th scope="col">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in topProducts" :key="index">
                  <td class="fw-semibold">{{ product.name }}</td>
                  <td>{{ product.code }}</td>
                  <td>{{ product.category }}</td>
                  <td>{{ product.sales }}</td>
                  <td>
                    <span
                      :class="[
                        'badge fs-6',
                        product.stock < 10 ? 'bg-danger' : 'bg-success'
                      ]"
                    >
                      {{ product.stock }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const router = useRouter();
const db = getFirestore();
const userRole = ref("Administrador"); // Valor por defecto para el rol de usuario

// Datos de ejemplo para la tabla de productos
const topProducts = [
  {
    name: "Leche entera 1L",
    code: "LC001",
    category: "Lácteos",
    sales: 45,
    stock: 23,
  },
  {
    name: "Pan blanco",
    code: "PAN01",
    category: "Panadería",
    sales: 38,
    stock: 15,
  },
  {
    name: "Refresco Cola 2L",
    code: "BEB023",
    category: "Bebidas",
    sales: 36,
    stock: 42,
  },
  {
    name: "Jabón de tocador",
    code: "HG012",
    category: "Higiene",
    sales: 28,
    stock: 18,
  },
  {
    name: "Pasta dental",
    code: "HG008",
    category: "Higiene",
    sales: 25,
    stock: 7,
  },
];

onMounted(async () => {
  try {
    // Obtener el rol del usuario desde Firestore
    const userDoc = await getDoc(doc(db, "usuarios", auth.currentUser.uid));
    if (userDoc.exists()) {
      userRole.value = userDoc.data().rol || "";
    } else {
      userRole.value = "";
    }
  } catch (error) {
    console.error("Error al cargar el rol del usuario:", error);
    userRole.value = "";
  }
});

const getUserDisplayName = () => {
  return auth.currentUser.displayName || auth.currentUser.email || "Usuario";
};

const getUserInitials = () => {
  const name = auth.currentUser.displayName || auth.currentUser.email || "U";
  return name.charAt(0).toUpperCase();
};

const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      router.push("/");
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
};
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css");

#wrapper {
  min-height: 100vh;
}

#sidebar-wrapper {
  width: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
