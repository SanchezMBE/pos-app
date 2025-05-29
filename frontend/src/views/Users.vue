<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <div class="card-body">
        <h2 class="fw-bold">Perfiles de Cajero</h2>

        <!-- Page Content -->
        <div class="card shadow-lg border-0">
          <div class="card-body">
            <!-- Buscador centrado y botón agregar -->
            <div class="row justify-content-center align-items-center mb-4">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input v-model="filtro" type="text" class="form-control" placeholder="Buscar cajero..." />
                </div>
              </div>
              <div class="col-md-3 text-end">
                <button v-if="!mostrarFormulario" @click="mostrarFormulario = true" class="btn btn-success">
                  <i class="bi bi-person-plus-fill me-1"></i> Agregar Cajero
                </button>
              </div>
            </div>

            <!-- Formulario para agregar cajero -->
            <div v-if="mostrarFormulario" class="row justify-content-center mb-4">
              <div class="col-md-10">
                <div class="card p-4">
                  <h5 class="mb-3">Nuevo Cajero</h5>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Nombre Completo *</label>
                      <input
                        v-model="nuevoCajero.nombreCompleto"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errores.nombreCompleto }"
                        placeholder="Ingrese el nombre completo"
                      />
                      <div v-if="errores.nombreCompleto" class="invalid-feedback">
                        {{ errores.nombreCompleto }}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Usuario *</label>
                      <input
                        v-model="nuevoCajero.usuario"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errores.usuario }"
                        placeholder="Ingrese el nombre de usuario"
                      />
                      <div v-if="errores.usuario" class="invalid-feedback">
                        {{ errores.usuario }}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Contraseña *</label>
                      <div class="input-group">
                        <input
                          v-model="nuevoCajero.contrasena"
                          :type="mostrarContrasena ? 'text' : 'password'"
                          class="form-control"
                          :class="{ 'is-invalid': errores.contrasena }"
                          placeholder="Mínimo 8 caracteres, 1 número y 1 carácter especial"
                        />
                        <button
                          @click="mostrarContrasena = !mostrarContrasena"
                          class="btn btn-outline-secondary"
                          type="button"
                        >
                          <i :class="mostrarContrasena ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                      <div v-if="errores.contrasena" class="invalid-feedback d-block">
                        {{ errores.contrasena }}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Confirmar Contraseña *</label>
                      <div class="input-group">
                        <input
                          v-model="nuevoCajero.confirmarContrasena"
                          :type="mostrarConfirmarContrasena ? 'text' : 'password'"
                          class="form-control"
                          :class="{ 'is-invalid': errores.confirmarContrasena }"
                          placeholder="Confirme la contraseña"
                        />
                        <button
                          @click="mostrarConfirmarContrasena = !mostrarConfirmarContrasena"
                          class="btn btn-outline-secondary"
                          type="button"
                        >
                          <i :class="mostrarConfirmarContrasena ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                      <div v-if="errores.confirmarContrasena" class="invalid-feedback d-block">
                        {{ errores.confirmarContrasena }}
                      </div>
                    </div>
                    <div class="col-12 text-end mt-3">
                      <button @click="agregarCajero" class="btn btn-primary me-2" :disabled="cargando">
                        <span v-if="cargando" class="spinner-border spinner-border-sm me-1" role="status"></span>
                        <i v-else class="bi bi-check-circle me-1"></i>
                        {{ cargando ? "Guardando..." : "Guardar" }}
                      </button>
                      <button @click="cancelarFormulario" class="btn btn-outline-secondary" :disabled="cargando">
                        <i class="bi bi-x-circle me-1"></i> Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarjetas de cajeros -->
            <div v-if="cargando" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-2">Cargando cajeros...</p>
            </div>

            <div v-else-if="error" class="alert alert-danger text-center">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
              <button @click="cargarCajeros" class="btn btn-outline-danger btn-sm ms-2">
                <i class="bi bi-arrow-clockwise me-1"></i> Reintentar
              </button>
            </div>

            <div v-else-if="cajerosFiltrados.length === 0" class="text-center py-4">
              <i class="bi bi-person-x fs-1 text-muted"></i>
              <p class="text-muted mt-2">
                {{ filtro ? "No se encontraron cajeros con ese filtro" : "No hay cajeros registrados" }}
              </p>
            </div>

            <div v-else class="row">
              <div v-for="cajero in cajerosFiltrados" :key="cajero.id" class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                  <div class="card-body text-center">
                    <div class="mb-3">
                      <i class="bi bi-person-circle fs-1 text-secondary"></i>
                    </div>
                    <h5 class="card-title text-primary">{{ cajero.full_name || cajero.nombreCompleto }}</h5>
                    <p class="card-text"><strong>Usuario:</strong> {{ cajero.username || cajero.usuario }}</p>
                    <p class="card-text"><strong>Rol:</strong> Cajero</p>
                    <div class="d-flex justify-content-center gap-2">
                      <button
                        @click="iniciarEdicion(cajero)"
                        class="btn btn-outline-primary btn-sm"
                        :disabled="cargando"
                      >
                        <i class="bi bi-pencil-square me-1"></i> Editar
                      </button>
                      <button
                        @click="eliminarCajero(cajero.id)"
                        class="btn btn-outline-danger btn-sm"
                        :disabled="cargando"
                      >
                        <i class="bi bi-trash-fill me-1"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal de edición -->
            <div v-if="editarCajero" class="modal d-block" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Editar Cajero</h5>
                    <button type="button" class="btn-close" @click="cancelarEdicion"></button>
                  </div>
                  <div class="modal-body">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label">Nombre Completo *</label>
                        <input
                          v-model="editarCajero.nombreCompleto"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': erroresEdicion.nombreCompleto }"
                          placeholder="Nombre completo"
                        />
                        <div v-if="erroresEdicion.nombreCompleto" class="invalid-feedback">
                          {{ erroresEdicion.nombreCompleto }}
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Usuario *</label>
                        <input
                          v-model="editarCajero.usuario"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': erroresEdicion.usuario }"
                          placeholder="Nombre de usuario"
                        />
                        <div v-if="erroresEdicion.usuario" class="invalid-feedback">
                          {{ erroresEdicion.usuario }}
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Nueva Contraseña (opcional)</label>
                        <div class="input-group">
                          <input
                            v-model="editarCajero.contrasena"
                            :type="mostrarContrasenaEdicion ? 'text' : 'password'"
                            class="form-control"
                            :class="{ 'is-invalid': erroresEdicion.contrasena }"
                            placeholder="Dejar vacío para mantener actual"
                          />
                          <button
                            @click="mostrarContrasenaEdicion = !mostrarContrasenaEdicion"
                            class="btn btn-outline-secondary"
                            type="button"
                          >
                            <i :class="mostrarContrasenaEdicion ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                          </button>
                        </div>
                        <div v-if="erroresEdicion.contrasena" class="invalid-feedback d-block">
                          {{ erroresEdicion.contrasena }}
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Confirmar Nueva Contraseña</label>
                        <div class="input-group">
                          <input
                            v-model="editarCajero.confirmarContrasena"
                            :type="mostrarConfirmarContrasenaEdicion ? 'text' : 'password'"
                            class="form-control"
                            :class="{ 'is-invalid': erroresEdicion.confirmarContrasena }"
                            placeholder="Confirmar nueva contraseña"
                          />
                          <button
                            @click="mostrarConfirmarContrasenaEdicion = !mostrarConfirmarContrasenaEdicion"
                            class="btn btn-outline-secondary"
                            type="button"
                          >
                            <i :class="mostrarConfirmarContrasenaEdicion ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                          </button>
                        </div>
                        <div v-if="erroresEdicion.confirmarContrasena" class="invalid-feedback d-block">
                          {{ erroresEdicion.confirmarContrasena }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button @click="guardarEdicion" class="btn btn-success" :disabled="cargando">
                      <span v-if="cargando" class="spinner-border spinner-border-sm me-1" role="status"></span>
                      <i v-else class="bi bi-check-circle me-1"></i>
                      {{ cargando ? "Guardando..." : "Guardar Cambios" }}
                    </button>
                    <button @click="cancelarEdicion" class="btn btn-secondary" :disabled="cargando">
                      <i class="bi bi-x-circle me-1"></i> Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import "bootstrap-icons/font/bootstrap-icons.css";
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
    } catch (e) {
      console.error("Error al parsear datos del usuario:", e);
    }
  }

  if (storedToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }

  // Cargar cajeros desde la base de datos
  await cargarCajeros();
});

// Estados
const cajeros = ref([]);
const cargando = ref(false);
const error = ref("");

const nuevoCajero = ref({
  nombreCompleto: "",
  usuario: "",
  contrasena: "",
  confirmarContrasena: ""
});

const editarCajero = ref(null);
const mostrarFormulario = ref(false);
const filtro = ref("");
const errores = ref({});
const erroresEdicion = ref({});

// Estados para mostrar/ocultar contraseñas
const mostrarContrasena = ref(false);
const mostrarConfirmarContrasena = ref(false);
const mostrarContrasenaEdicion = ref(false);
const mostrarConfirmarContrasenaEdicion = ref(false);

// Computed
const cajerosFiltrados = computed(() =>
  cajeros.value.filter((c) => {
    const nombre = c.full_name || c.nombreCompleto || "";
    const usuario = c.username || c.usuario || "";
    return (
      nombre.toLowerCase().includes(filtro.value.toLowerCase()) ||
      usuario.toLowerCase().includes(filtro.value.toLowerCase())
    );
  })
);

// Validaciones
const validarContrasena = (contrasena) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return regex.test(contrasena);
};

const validarFormulario = (datos, esEdicion = false) => {
  const errores = {};

  if (!datos.nombreCompleto.trim()) {
    errores.nombreCompleto = "El nombre completo es obligatorio";
  }

  if (!datos.usuario.trim()) {
    errores.usuario = "El usuario es obligatorio";
  } else {
    // Verificar que el usuario no exista (excepto en edición del mismo usuario)
    const usuarioExiste = cajeros.value.some(
      (c) => c.usuario.toLowerCase() === datos.usuario.toLowerCase() && (!esEdicion || c.id !== datos.id)
    );
    if (usuarioExiste) {
      errores.usuario = "Este usuario ya existe";
    }
  }

  // En edición, la contraseña es opcional
  if (!esEdicion || datos.contrasena.trim()) {
    if (!datos.contrasena.trim()) {
      errores.contrasena = "La contraseña es obligatoria";
    } else if (!validarContrasena(datos.contrasena)) {
      errores.contrasena = "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial";
    }

    if (!datos.confirmarContrasena.trim()) {
      errores.confirmarContrasena = "Debe confirmar la contraseña";
    } else if (datos.contrasena !== datos.confirmarContrasena) {
      errores.confirmarContrasena = "Las contraseñas no coinciden";
    }
  }

  return errores;
};

// Métodos de API
const cargarCajeros = async () => {
  try {
    cargando.value = true;
    error.value = "";
    const response = await axios.get("/api/cashiers");
    cajeros.value = response.data.data || [];
  } catch (err) {
    console.error("Error al cargar cajeros:", err);
    error.value = "Error al cargar los cajeros";
    // Mostrar mensaje de error al usuario
    if (err.response?.data?.message) {
      alert(`Error: ${err.response.data.message}`);
    } else {
      alert("Error al cargar los cajeros");
    }
  } finally {
    cargando.value = false;
  }
};

const crearCajero = async (datosCajero) => {
  try {
    cargando.value = true;
    const response = await axios.post("/api/cashiers", {
      full_name: datosCajero.nombreCompleto,
      username: datosCajero.usuario,
      password: datosCajero.contrasena
    });

    // Recargar la lista de cajeros
    await cargarCajeros();
    return response.data;
  } catch (err) {
    console.error("Error al crear cajero:", err);
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Error al crear el cajero");
    }
  } finally {
    cargando.value = false;
  }
};

const actualizarCajero = async (id, datosCajero) => {
  try {
    cargando.value = true;
    const payload = {
      full_name: datosCajero.nombreCompleto,
      username: datosCajero.usuario
    };

    // Solo incluir contraseña si se proporcionó una nueva
    if (datosCajero.contrasena && datosCajero.contrasena.trim()) {
      payload.password = datosCajero.contrasena;
    }

    const response = await axios.put(`/api/cashiers/${id}`, payload);

    // Recargar la lista de cajeros
    await cargarCajeros();
    return response.data;
  } catch (err) {
    console.error("Error al actualizar cajero:", err);
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Error al actualizar el cajero");
    }
  } finally {
    cargando.value = false;
  }
};

const eliminarCajeroAPI = async (id) => {
  try {
    cargando.value = true;
    await axios.delete(`/api/cashiers/${id}`);

    // Recargar la lista de cajeros
    await cargarCajeros();
  } catch (err) {
    console.error("Error al eliminar cajero:", err);
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Error al eliminar el cajero");
    }
  } finally {
    cargando.value = false;
  }
};

// Métodos
const agregarCajero = async () => {
  errores.value = validarFormulario(nuevoCajero.value);

  if (Object.keys(errores.value).length > 0) {
    return;
  }

  try {
    await crearCajero(nuevoCajero.value);
    cancelarFormulario();
    alert("Cajero agregado exitosamente");
  } catch (err) {
    alert(err.message);
  }
};

const cancelarFormulario = () => {
  nuevoCajero.value = { nombreCompleto: "", usuario: "", contrasena: "", confirmarContrasena: "" };
  errores.value = {};
  mostrarFormulario.value = false;
  mostrarContrasena.value = false;
  mostrarConfirmarContrasena.value = false;
};

const iniciarEdicion = (cajero) => {
  editarCajero.value = {
    id: cajero.id,
    nombreCompleto: cajero.full_name || cajero.nombreCompleto,
    usuario: cajero.username || cajero.usuario,
    contrasena: "",
    confirmarContrasena: ""
  };
  erroresEdicion.value = {};
};

const guardarEdicion = async () => {
  erroresEdicion.value = validarFormulario(editarCajero.value, true);

  if (Object.keys(erroresEdicion.value).length > 0) {
    return;
  }

  try {
    await actualizarCajero(editarCajero.value.id, editarCajero.value);
    cancelarEdicion();
    alert("Cajero actualizado exitosamente");
  } catch (err) {
    alert(err.message);
  }
};

const cancelarEdicion = () => {
  editarCajero.value = null;
  erroresEdicion.value = {};
  mostrarContrasenaEdicion.value = false;
  mostrarConfirmarContrasenaEdicion.value = false;
};

const eliminarCajero = async (id) => {
  if (confirm("¿Estás seguro de eliminar este cajero?")) {
    try {
      await eliminarCajeroAPI(id);
      alert("Cajero eliminado exitosamente");
    } catch (err) {
      alert(err.message);
    }
  }
};
</script>

<style scoped>
#wrapper {
  min-height: 100vh;
}

.text-primary {
  color: #000000 !important;
}

.card {
  border-radius: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>
