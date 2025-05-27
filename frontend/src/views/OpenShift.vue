<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <div id="page-content-wrapper" class="flex-grow-1 bg-light p-4">
      <div class="card-body">
        <h2 class="fw-bold">Apertura de Caja</h2>

        <div class="card shadow-lg border-0">
          <div class="card-body">

            <div class="row justify-content-center">
              <!-- Columna de billetes -->
              <div class="col-12 col-md-4">
                <h5 class="mb-3">Billetes</h5>
                <div
                  v-for="(denom, i) in billetes"
                  :key="'billete-' + i"
                  class="input-group mb-3"
                >
                  <span class="input-group-text">{{ denom.etiqueta }}</span>
                  <input
                    v-model.number="denom.cantidad"
                    type="number"
                    class="form-control"
                    min="0"
                  />
                  <span
                    class="input-group-text bg-light text-muted"
                    style="min-width: 90px;"
                  >
                    ${{ (denom.valor * denom.cantidad).toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Columna de monedas -->
              <div class="col-12 col-md-4">
                <h5 class="mb-3">Monedas</h5>
                <div
                  v-for="(denom, i) in monedas"
                  :key="'moneda-' + i"
                  class="input-group mb-3"
                >
                  <span class="input-group-text">{{ denom.etiqueta }}</span>
                  <input
                    v-model.number="denom.cantidad"
                    type="number"
                    class="form-control"
                    min="0"
                  />
                  <span
                    class="input-group-text bg-light text-muted"
                    style="min-width: 90px;"
                  >
                    ${{ (denom.valor * denom.cantidad).toFixed(2) }}
                  </span>
                </div>

                <!-- Total abajo de monedas -->
                <div class="total-amount mt-3">
                  <h4>Total: ${{ total.toFixed(2) }}</h4>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="row mt-4">
              <div class="col-12 text-end">
                <button
                  class="btn btn-success btn-lg px-4 py-2"
                  @click="guardarApertura"
                >
                  <i class="bi bi-check-circle me-1"></i> Guardar Apertura
                </button>
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
import Sidebar from "@/components/Sidebar.vue";
import "bootstrap-icons/font/bootstrap-icons.css";

const user = ref({ username: "Usuario", role: "" });

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch {}
  }
});

// Definimos billetes y monedas por separado
const billetes = ref([
  { etiqueta: "$1000", valor: 1000, cantidad: 0 },
  { etiqueta: "$500", valor: 500, cantidad: 0 },
  { etiqueta: "$200", valor: 200, cantidad: 0 },
  { etiqueta: "$100", valor: 100, cantidad: 0 },
  { etiqueta: "$50", valor: 50, cantidad: 0 },
  { etiqueta: "$20", valor: 20, cantidad: 0 },
  { etiqueta: "$10", valor: 10, cantidad: 0 },
]);

const monedas = ref([
  { etiqueta: "$5", valor: 5, cantidad: 0 },
  { etiqueta: "$2", valor: 2, cantidad: 0 },
  { etiqueta: "$1", valor: 1, cantidad: 0 },
  { etiqueta: "$0.50", valor: 0.5, cantidad: 0 },
]);

const total = computed(() => {
  const sumaBilletes = billetes.value.reduce(
    (sum, d) => sum + d.valor * d.cantidad,
    0
  );
  const sumaMonedas = monedas.value.reduce(
    (sum, d) => sum + d.valor * d.cantidad,
    0
  );
  return sumaBilletes + sumaMonedas;
});

const guardarApertura = () => {
  if (total.value === 0) {
    alert("El total no puede ser cero.");
    return;
  }

  const datosApertura = {
    fecha: new Date().toISOString(),
    total: total.value,
    desglose: [...billetes.value, ...monedas.value],
  };

  console.log("Apertura guardada:", datosApertura);
  alert("Apertura de caja guardada con éxito.");
  // Aquí puedes hacer un POST a backend si quieres
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
.input-group-text {
  min-width: 80px;
  justify-content: center;
}

/* Fondo verde suave para total */
.total-amount {
  background-color: #d4edda; /* verde suave */
  padding: 10px 15px;
  border-radius: 8px;
  color: #155724; /* verde oscuro para texto */
  font-weight: 600;
  text-align: center;
}
</style>
