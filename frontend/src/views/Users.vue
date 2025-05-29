<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <div class="card-body">
        <h2 class="fw-bold">Perfiles de Usuario</h2>

    <!-- Page Content -->
        <div class="card shadow-lg border-0">
          <div class="card-body">

            <!-- Buscador centrado y botón agregar -->
            <div class="row justify-content-center align-items-center mb-4">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input v-model="filtro" type="text" class="form-control" placeholder="Buscar usuario...">
                </div>
              </div>
              <div class="col-md-3 text-end">
                <button v-if="!mostrarFormulario" @click="mostrarFormulario = true" class="btn btn-success">
                  <i class="bi bi-person-plus-fill me-1"></i> Agregar Usuario
                </button>
              </div>
            </div>

            <!-- Formulario para agregar usuario -->
            <div v-if="mostrarFormulario" class="row justify-content-center mb-4">
              <div class="col-md-8">
                <div class="card p-3">
                  <div class="row g-2">
                    <div class="col-md-4">
                      <input v-model="nuevoUsuario.nombre" type="text" class="form-control" placeholder="Nombre del usuario">
                    </div>
                    <div class="col-md-3">
                      <select v-model="nuevoUsuario.rol" class="form-select">
                        <option disabled value="">Rol</option>
                        <option>Administrador</option>
                        <option>Cajero</option>
                      </select>
                    </div>
                    <div class="col-md-3">
                      <select v-model="nuevoUsuario.turno" class="form-select">
                        <option disabled value="">Turno</option>
                        <option>Mañana</option>
                        <option>Tarde</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <input type="file" @change="cargarFoto" class="form-control form-control-sm">
                    </div>
                    <div class="col-12 text-end mt-2">
                      <button @click="agregarUsuario" class="btn btn-primary me-2">
                        <i class="bi bi-check-circle me-1"></i> Guardar
                      </button>
                      <button @click="mostrarFormulario = false" class="btn btn-outline-secondary">
                        <i class="bi bi-x-circle me-1"></i> Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarjetas de usuarios -->
            <div class="row">
              <div v-for="usuario in usuariosFiltrados" :key="usuario.id" class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                  <div class="card-body text-center">
                    <div class="mb-3">
                      <img v-if="usuario.foto" :src="usuario.foto" class="rounded-circle border" width="80" height="80" />
                      <i v-else class="bi bi-person-circle fs-1 text-secondary"></i>
                    </div>
                    <h5 class="card-title text-primary">{{ usuario.nombre }}</h5>
                    <p class="card-text"><strong>Rol:</strong> {{ usuario.rol }}</p>
                    <p class="card-text"><strong>Turno:</strong> {{ usuario.turno }}</p>
                    <div class="d-flex justify-content-center gap-2">
                      <button @click="editarUsuario = { ...usuario }" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-pencil-square me-1"></i> Editar
                      </button>
                      <button @click="eliminarUsuario(usuario.id)" class="btn btn-outline-danger btn-sm">
                        <i class="bi bi-trash-fill me-1"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal de edición -->
            <div v-if="editarUsuario" class="modal d-block" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Editar Usuario</h5>
                    <button type="button" class="btn-close" @click="editarUsuario = null"></button>
                  </div>
                  <div class="modal-body">
                    <input v-model="editarUsuario.nombre" type="text" class="form-control mb-2" placeholder="Nombre">
                    <select v-model="editarUsuario.rol" class="form-select mb-2">
                      <option>Administrador</option>
                      <option>Cajero</option>
                    </select>
                    <select v-model="editarUsuario.turno" class="form-select mb-2">
                      <option>Mañana</option>
                      <option>Tarde</option>
                    </select>
                  </div>
                  <div class="modal-footer">
                    <button @click="guardarEdicion" class="btn btn-success">Guardar</button>
                    <button @click="editarUsuario = null" class="btn btn-secondary">Cancelar</button>
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
import { ref, computed, onMounted } from 'vue';
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";

const user = ref({
  username: "Usuario",
  role: ""
});

onMounted(() => {
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
});

const usuarios = ref([
  { id: 1, nombre: 'Juan Pérez', rol: 'Administrador', turno: 'Mañana', foto: '' },
  { id: 2, nombre: 'Ana Martínez', rol: 'Cajero', turno: 'Tarde', foto: '' },
  { id: 3, nombre: 'Luis Gómez', rol: 'Cajero', turno: 'Mañana', foto: '' },
]);

const nuevoUsuario = ref({ nombre: '', rol: '', turno: '', foto: '' });
const editarUsuario = ref(null);
const mostrarFormulario = ref(false);
const filtro = ref('');

const usuariosFiltrados = computed(() =>
  usuarios.value.filter(u =>
    u.nombre.toLowerCase().includes(filtro.value.toLowerCase())
  )
);

const cargarFoto = (event) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = () => {
      nuevoUsuario.value.foto = reader.result;
    };
    reader.readAsDataURL(archivo);
  }
};

const agregarUsuario = () => {
  const { nombre, rol, turno } = nuevoUsuario.value;
  if (!nombre || !rol || !turno) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  usuarios.value.push({
    id: Date.now(),
    nombre,
    rol,
    turno,
    foto: nuevoUsuario.value.foto || ''
  });
  nuevoUsuario.value = { nombre: '', rol: '', turno: '', foto: '' };
  mostrarFormulario.value = false;
};

const guardarEdicion = () => {
  const { nombre, rol, turno } = editarUsuario.value;
  if (!nombre || !rol || !turno) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  const index = usuarios.value.findIndex(u => u.id === editarUsuario.value.id);
  if (index !== -1) {
    usuarios.value[index] = { ...editarUsuario.value };
    editarUsuario.value = null;
  }
};

const eliminarUsuario = (id) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    usuarios.value = usuarios.value.filter(usuario => usuario.id !== id);
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
img.rounded-circle {
  object-fit: cover;
}
</style>
