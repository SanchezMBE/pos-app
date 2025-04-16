<template>
  <div class="container py-4">
    <div class="row">
      <!-- Tabla de billetes y monedas (ahora a la izquierda) -->
      <div class="col-md-8 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-3">Apertura de Caja</h5>
            <table class="table table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Tipo</th>
                  <th>Denominación</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in denominaciones" :key="index">
                  <td>{{ item.tipo }}</td>
                  <td>${{ item.valor.toFixed(2) }}</td>
                  <td>
                    <input type="number" min="0" class="form-control" v-model.number="item.cantidad" />
                  </td>
                  <td>${{ (item.valor * item.cantidad).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Resumen a la derecha -->
      <div class="col-md-4">
        <div class="card bg-light shadow-sm">
          <div class="card-body">
            <h5 class="fw-bold mb-3">Resumen de Apertura</h5>
            <p class="fs-4">Total: <strong>${{ totalApertura.toFixed(2) }}</strong></p>
            <button class="btn btn-primary w-100 mt-3" @click="abrirCaja">
              <i class="bi bi-box-arrow-in-right me-2"></i> Abrir Caja
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const denominaciones = ref([
  { tipo: 'Billete', valor: 1000, cantidad: 0 },
  { tipo: 'Billete', valor: 500, cantidad: 0 },
  { tipo: 'Billete', valor: 200, cantidad: 0 },
  { tipo: 'Billete', valor: 100, cantidad: 0 },
  { tipo: 'Billete', valor: 50, cantidad: 0 },
  { tipo: 'Billete', valor: 20, cantidad: 0 },
  { tipo: 'Moneda', valor: 10, cantidad: 0 },
  { tipo: 'Moneda', valor: 5, cantidad: 0 },
  { tipo: 'Moneda', valor: 2, cantidad: 0 },
  { tipo: 'Moneda', valor: 1, cantidad: 0 },
  { tipo: 'Moneda', valor: 0.5, cantidad: 0 },
]);

const totalApertura = computed(() =>
  denominaciones.value.reduce((acc, item) => acc + item.valor * item.cantidad, 0)
);

const abrirCaja = () => {
  alert(`Caja abierta con: $${totalApertura.value.toFixed(2)}`);
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}
</style>
