<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Page Content -->
    <div id="page-content-wrapper" class="flex-grow-1 bg-light">
      <div class="container-fluid p-4">
        <div class="row mb-4">
          <div class="col-12 d-flex justify-content-between align-items-center">
            <h2 class="fw-bold mb-0">Usuarios</h2>
            <button v-if="user.role === 'admin'" class="btn btn-primary" @click="showAddModal = true">
              <i class="bi bi-plus-circle me-2"></i>Agregar Usuario
            </button>
          </div>
        </div>

        <!-- Acceso restringido para no-administradores -->
        <div v-if="user.role !== 'admin'" class="alert alert-warning" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          No tienes permisos para acceder a la gestión de usuarios.
        </div>

        <!-- Lista de usuarios (solo visible para administradores) -->
        <div v-else>
          <!-- Spinner de carga -->
          <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-else-if="error" class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-circle me-2"></i>
            {{ error }}
          </div>

          <!-- Tabla de usuarios -->
          <div v-else class="card shadow-sm">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Nombre completo</th>
                      <th>Rol</th>
                      <th>Fecha de creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="users.length === 0">
                      <td colspan="5" class="text-center py-3">No hay usuarios registrados</td>
                    </tr>
                    <tr v-for="u in users" :key="u.id">
                      <td>{{ u.username }}</td>
                      <td>{{ u.full_name }}</td>
                      <td>
                        <span :class="u.role === 'admin' ? 'badge bg-danger' : 'badge bg-success'">
                          {{ u.role === "admin" ? "Administrador" : "Cajero" }}
                        </span>
                      </td>
                      <td>{{ formatDate(u.created_at) }}</td>
                      <td>
                        <!-- Solo mostrar acciones para cajeros -->
                        <div v-if="u.role === 'cashier'" class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" @click="editUser(u)" title="Editar">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-outline-danger" @click="confirmDelete(u)" title="Eliminar">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                        <div v-else>
                          <span class="text-muted fst-italic">No editable</span>
                        </div>
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

  <!-- Modal para añadir usuario -->
  <div
    class="modal fade"
    id="addUserModal"
    tabindex="-1"
    aria-labelledby="addUserModalLabel"
    aria-hidden="true"
    ref="addModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addUserModalLabel">
            {{ editMode ? "Editar Usuario" : "Agregar Nuevo Usuario" }}
          </h5>
          <button type="button" class="btn-close" @click="closeAddModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUser">
            <div class="mb-3">
              <label for="username" class="form-label">Nombre de usuario</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="newUser.username"
                :disabled="editMode"
                required
              />
            </div>
            <div class="mb-3">
              <label for="fullName" class="form-label">Nombre completo</label>
              <input type="text" class="form-control" id="fullName" v-model="newUser.full_name" required />
            </div>
            <div class="mb-3">
              <label for="role" class="form-label">Rol</label>
              <select class="form-select" id="role" v-model="newUser.role" required>
                <option value="cashier">Cajero</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">
                {{ editMode ? "Nueva contraseña (dejar en blanco para mantener)" : "Contraseña" }}
              </label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="newUser.password"
                :required="!editMode"
              />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="confirmPassword"
                :required="!editMode || newUser.password"
              />
              <div class="form-text text-danger" v-if="passwordMismatch">Las contraseñas no coinciden</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeAddModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="saveUser" :disabled="loading || passwordMismatch">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ editMode ? "Actualizar Usuario" : "Guardar Usuario" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación de eliminación -->
  <div
    class="modal fade"
    id="deleteModal"
    tabindex="-1"
    aria-labelledby="deleteModalLabel"
    aria-hidden="true"
    ref="deleteModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Confirmar eliminación</h5>
          <button type="button" class="btn-close" @click="closeDeleteModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ¿Estás seguro de que deseas eliminar el usuario
          <strong>{{ userToDelete?.username }}</strong
          >? Esta acción no se puede deshacer.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteUser" :disabled="deleteLoading">
            <span v-if="deleteLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Modal } from "bootstrap";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";

// Estado del usuario actual
const user = ref({
  id: null,
  username: "",
  role: "",
  business_id: null
});

// Estado para la lista de usuarios
const users = ref([]);
const loading = ref(false);
const error = ref(null);

// Estado para el modal de añadir/editar usuario
const showAddModal = ref(false);
const addModal = ref(null);
const editMode = ref(false);
const newUser = ref({
  username: "",
  full_name: "",
  role: "cashier",
  password: "",
  business_id: null
});
const confirmPassword = ref("");
const passwordMismatch = computed(() => {
  return newUser.value.password && newUser.value.password !== confirmPassword.value;
});

// Estado para el modal de eliminación
const showDeleteModal = ref(false);
const deleteModal = ref(null);
const userToDelete = ref(null);
const deleteLoading = ref(false);

// Obtener datos del usuario actual del localStorage
onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("authToken");

  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);

      // Si el usuario es administrador, cargar la lista de usuarios
      if (user.value.role === "admin") {
        loadUsers();
      }
    } catch (e) {
      console.error("Error al parsear datos del usuario:", e);
    }
  }

  if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
});

// Observar cambios en los estados de los modales para mostrarlos/ocultarlos
watch(showAddModal, (newVal) => {
  if (newVal) {
    if (!addModal.value) {
      addModal.value = new Modal(document.getElementById("addUserModal"));
    }
    addModal.value.show();
  } else if (addModal.value) {
    addModal.value.hide();
  }
});

watch(showDeleteModal, (newVal) => {
  if (newVal) {
    if (!deleteModal.value) {
      deleteModal.value = new Modal(document.getElementById("deleteModal"));
    }
    deleteModal.value.show();
  } else if (deleteModal.value) {
    deleteModal.value.hide();
  }
});

// Cargar la lista de usuarios desde el backend
const loadUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get("http://localhost:3000/api/users");
    users.value = response.data;
  } catch (err) {
    console.error("Error al cargar usuarios:", err);
    error.value = "No se pudieron cargar los usuarios. Por favor, intenta de nuevo más tarde.";
  } finally {
    loading.value = false;
  }
};

// Formatear fecha para mostrar en la tabla
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Abrir modal para editar usuario
const editUser = (userToEdit) => {
  editMode.value = true;
  newUser.value = {
    id: userToEdit.id,
    username: userToEdit.username,
    full_name: userToEdit.full_name,
    role: userToEdit.role,
    password: "",
    business_id: userToEdit.business_id
  };
  confirmPassword.value = "";
  showAddModal.value = true;
};

// Abrir modal para confirmar eliminación
const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// Reiniciar formulario y cerrar modal
const closeAddModal = () => {
  resetForm();
  showAddModal.value = false;
};

// Cerrar modal de confirmación de eliminación
const closeDeleteModal = () => {
  userToDelete.value = null;
  showDeleteModal.value = false;
};

// Reiniciar formulario
const resetForm = () => {
  editMode.value = false;
  newUser.value = {
    username: "",
    full_name: "",
    role: "cashier",
    password: "",
    business_id: user.value.business_id
  };
  confirmPassword.value = "";
};

// Guardar nuevo usuario o actualizar uno existente
const saveUser = async () => {
  // Validar que las contraseñas coincidan
  if (newUser.value.password && newUser.value.password !== confirmPassword.value) {
    return;
  }

  loading.value = true;
  try {
    // Asegurar que el usuario se crea para el mismo negocio del admin
    newUser.value.business_id = user.value.business_id;

    if (editMode.value) {
      // Actualizar usuario existente
      const userData = { ...newUser.value };
      // Solo enviar la contraseña si se ha proporcionado una nueva
      if (!userData.password) {
        delete userData.password;
      }

      await axios.put(`http://localhost:3000/api/users${newUser.value.id}`, userData);
    } else {
      // Crear nuevo usuario
      await axios.post("http://localhost:3000/api/users", newUser.value);
    }

    // Recargar la lista de usuarios
    await loadUsers();

    // Cerrar el modal y reiniciar el formulario
    closeAddModal();
  } catch (err) {
    console.error("Error al guardar usuario:", err);
    error.value = `No se pudo ${editMode.value ? "actualizar" : "crear"} el usuario. ${err.response?.data?.message || "Por favor, intenta de nuevo más tarde."}`;
  } finally {
    loading.value = false;
  }
};

// Eliminar usuario
const deleteUser = async () => {
  if (!userToDelete.value) return;

  deleteLoading.value = true;
  try {
    await axios.delete(`/api/users/${userToDelete.value.id}`);

    // Recargar la lista de usuarios
    await loadUsers();

    // Cerrar el modal
    closeDeleteModal();
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    error.value = `No se pudo eliminar el usuario. ${err.response?.data?.message || "Por favor, intenta de nuevo más tarde."}`;
  } finally {
    deleteLoading.value = false;
  }
};
</script>

<style scoped>
#wrapper {
  min-height: 100vh;
}
</style>
