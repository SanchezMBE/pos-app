<script setup>
import { ref, watch, computed } from 'vue';
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "@/components/Sidebar.vue";

 
// Datos simulados de corte de caja
const corte = ref({
  fecha: '04/04/2025',
  turno: 'Mañana',
  usuario: 'Juan Pérez',
  ventas: 10125,
  ventasTarjeta: 1032,
  inicial: 586,
  efectivoActual: 9335,
  diferencia: 0,
});

// Computed
const ventasEfectivo = computed(() => corte.value.ventas - corte.value.ventasTarjeta);
const totalEsperado = computed(() => corte.value.inicial + ventasEfectivo.value);

const calcularDiferencia = () => {
  corte.value.diferencia = corte.value.efectivoActual - totalEsperado.value;
};

const diferenciaClass = computed(() => {
  if (corte.value.diferencia < 0) return 'text-danger';
  if (corte.value.diferencia > 0) return 'text-primary';
  return 'text-success';
});

const estadoCaja = computed(() => {
  if (corte.value.diferencia < 0) return 'Faltante';
  if (corte.value.diferencia > 0) return 'Sobrante';
  return 'Cuadrado';
});

// Watch
watch(() => [
  corte.value.inicial,
  corte.value.ventas,
  corte.value.ventasTarjeta,
  corte.value.efectivoActual
], calcularDiferencia);
</script>

<template>
  <div class="container py-4">
    <div class="card shadow-lg border-0">
      <div class="card-body">
        <h4 class="card-title mb-4 text-primary fw-bold text-center fs-1">Corte de Caja</h4>
        <div class="row">
          <!-- Formulario -->
          <div class="col-md-8">
            <div class="mb-3">
              <label for="fecha" class="form-label">Fecha</label>
              <input type="date" id="fecha" class="form-control" v-model="corte.fecha" />

              <label for="turno" class="form-label mt-2">Turno</label>
              <input type="text" id="turno" class="form-control" v-model="corte.turno" />

              <label for="usuario" class="form-label mt-2">Usuario</label>
              <input type="text" id="usuario" class="form-control" v-model="corte.usuario" />

              <label for="ventas" class="form-label mt-2">Ventas Totales</label>
              <input type="number" id="ventas" class="form-control" v-model="corte.ventas" />

              <label for="ventasTarjeta" class="form-label mt-2">Ventas con Tarjeta</label>
              <input type="number" id="ventasTarjeta" class="form-control" v-model="corte.ventasTarjeta" />

              <label for="inicial" class="form-label mt-2">Fondo Inicial</label>
              <input type="number" id="inicial" class="form-control" v-model="corte.inicial" />

              <label for="efectivo" class="form-label mt-2">Efectivo Actual</label>
              <input type="number" id="efectivo" class="form-control" v-model="corte.efectivoActual" />

            </div>
          </div>

          <!-- Resumen -->
          <div class="col-md-4">
            <div class="border p-3 rounded bg-light">
              <h5 class="fw-bold mb-3">Resumen del Corte</h5>
              <table class="table table-sm">
                <tbody>
                  <tr>
                    <th>Ventas Totales:</th>
                    <td>${{ corte.ventas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                  </tr>
                  <tr>
                    <th>Tarjeta:</th>
                    <td>${{ corte.ventasTarjeta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
                  </tr>
                  <tr>
                    <th>Efectivo:</th>
                    <td>${{ ventasEfectivo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
                  </tr>
                  <tr>
                    <th>Fondo Inicial:</th>
                    <td>${{ corte.inicial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
                  </tr>
                  <tr>
                    <th>Total Esperado:</th>
                    <td>${{ totalEsperado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
                  </tr>
                  <tr>
                    <th>Efectivo Actual:</th>
                    <td>${{ corte.efectivoActual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</td>
                  </tr>
                  <tr>
                    <th>Diferencia:</th>
                    <td :class="diferenciaClass">${{ corte.diferencia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}}</td>
                  </tr>
                  <tr>
                    <th>Estado:</th>
                    <td :class="diferenciaClass">{{ estadoCaja }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Botón centrado debajo de la tabla -->
              <div class="d-flex justify-content-center mt-3">
                <button class="btn btn-success btn-lg">
                  <i class="bi bi-save me-2"></i> Guardar Corte
                 </button>
                </div>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-weight: 600;
}

.text-success {
  color: #28a745 !important;
}
.text-danger {
  color: #dc3545 !important;
}
.text-primary {
  color: #278604 !important;
}
</style>
