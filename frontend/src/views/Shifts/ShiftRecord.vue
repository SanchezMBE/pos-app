<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <div class="card-body">
        <h2 class="fw-bold">Turnos de Entrada</h2>

        <div class="card shadow-lg border-0">
          <div class="card-body">

            <!-- Buscador y botón agregar -->
            <div class="row justify-content-center align-items-center mb-4">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input v-model="filtro" type="text" class="form-control" placeholder="Buscar por trabajador o turno...">
                </div>
              </div>
              <div class="col-md-3 text-end">
                <button v-if="!mostrarFormulario" @click="mostrarFormulario = true" class="btn btn-success">
                  <i class="bi bi-clock-history me-1"></i> Agregar Turno
                </button>
              </div>
            </div>

            <!-- Formulario para agregar turno -->
            <div v-if="mostrarFormulario" class="row justify-content-center mb-4">
              <div class="col-md-8">
                <div class="card p-3">
                  <div class="row g-2">

                    <div class="col-md-4">
                      <input v-model="nuevoTurno.trabajador" type="text" class="form-control" placeholder="Nombre del trabajador" />
                    </div>

                    <div class="col-md-3">
                      <select v-model="nuevoTurno.turno" class="form-select">
                        <option disabled value="">Selecciona turno</option>
                        <option>Mañana</option>
                        <option>Tarde</option>
                        <option>Nocturno</option>
                      </select>
                    </div>

                    <div class="col-md-3">
                      <input v-model="nuevoTurno.fecha" type="date" class="form-control" />
                    </div>

                    <div class="col-md-2">
                      <input v-model="nuevoTurno.horaEntrada" type="time" class="form-control" />
                    </div>

                    <div class="col-12 text-end mt-2">
                      <button @click="agregarTurno" class="btn btn-primary me-2">
                        <i class="bi bi-check-circle me-1"></i> Guardar
                      </button>
                      <button @click="cancelarFormulario" class="btn btn-outline-secondary">
                        <i class="bi bi-x-circle me-1"></i> Cancelar
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de turnos -->
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Trabajador</th>
                    <th>Turno</th>
                    <th>Fecha</th>
                    <th>Hora de Entrada</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="turno in turnosFiltrados" :key="turno.id">
                    <td>{{ turno.trabajador }}</td>
                    <td>{{ turno.turno }}</td>
                    <td>{{ turno.fecha }}</td>
                    <td>{{ turno.horaEntrada }}</td>
                    <td class="text-center">
                      <button @click="editarTurno = { ...turno }" class="btn btn-outline-primary btn-sm me-1">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button @click="eliminarTurno(turno.id)" class="btn btn-outline-danger btn-sm">
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="turnosFiltrados.length === 0">
                    <td colspan="5" class="text-center text-muted">No se encontraron turnos.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Modal edición turno -->
            <div v-if="editarTurno" class="modal d-block" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Editar Turno</h5>
                    <button type="button" class="btn-close" @click="editarTurno = null"></button>
                  </div>
                  <div class="modal-body">
                    <input v-model="editarTurno.trabajador" type="text" class="form-control mb-2" placeholder="Nombre del trabajador" />
                    <select v-model="editarTurno.turno" class="form-select mb-2">
                      <option>Mañana</option>
                      <option>Tarde</option>
                      <option>Nocturno</option>
                    </select>
                    <input v-model="editarTurno.fecha" type="date" class="form-control mb-2" />
                    <input v-model="editarTurno.horaEntrada" type="time" class="form-control mb-2" />
                  </div>
                  <div class="modal-footer">
                    <button @click="guardarEdicion" class="btn btn-success">Guardar</button>
                    <button @click="editarTurno = null" class="btn btn-secondary">Cancelar</button>
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

const user = ref({ username: "Usuario", role: "" });

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch {}
  }
});

const turnos = ref([
  { id: 1, trabajador: "Juan Pérez", turno: "Mañana", fecha: "2025-05-25", horaEntrada: "08:00" },
  { id: 2, trabajador: "Ana Martínez", turno: "Tarde", fecha: "2025-05-25", horaEntrada: "14:00" },
]);

const nuevoTurno = ref({ trabajador: "", turno: "", fecha: "", horaEntrada: "" });
const editarTurno = ref(null);
const mostrarFormulario = ref(false);
const filtro = ref("");

const turnosFiltrados = computed(() =>
  turnos.value.filter(t =>
    t.trabajador.toLowerCase().includes(filtro.value.toLowerCase()) ||
    t.turno.toLowerCase().includes(filtro.value.toLowerCase())
  )
);

const agregarTurno = () => {
  const { trabajador, turno, fecha, horaEntrada } = nuevoTurno.value;
  if (!trabajador || !turno || !fecha || !horaEntrada) {
    alert("Por favor, completa todos los campos.");
    return;
  }
  turnos.value.push({
    id: Date.now(),
    trabajador,
    turno,
    fecha,
    horaEntrada,
  });
  nuevoTurno.value = { trabajador: "", turno: "", fecha: "", horaEntrada: "" };
  mostrarFormulario.value = false;
};

const cancelarFormulario = () => {
  mostrarFormulario.value = false;
  nuevoTurno.value = { trabajador: "", turno: "", fecha: "", horaEntrada: "" };
};

const guardarEdicion = () => {
  const { trabajador, turno, fecha, horaEntrada } = editarTurno.value;
  if (!trabajador || !turno || !fecha || !horaEntrada) {
    alert("Por favor, completa todos los campos.");
    return;
  }
  const index = turnos.value.findIndex(t => t.id === editarTurno.value.id);
  if (index !== -1) {
    turnos.value[index] = { ...editarTurno.value };
    editarTurno.value = null;
  }
};

const eliminarTurno = (id) => {
  if (confirm("¿Estás seguro de eliminar este turno?")) {
    turnos.value = turnos.value.filter(t => t.id !== id);
  }
};
</script>

<style scoped>
#wrapper {
  min-height: 100vh;
}
.card {
  border-radius: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
