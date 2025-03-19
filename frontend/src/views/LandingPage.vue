<template>
  <div class="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <h1 class="display-4 fw-bold text-dark mb-4">Punto de venta</h1>
    <nav class="d-flex gap-3">
      <router-link 
        to="/signup" 
        class="btn btn-primary px-4 py-2 shadow-sm">
        Registrarse
      </router-link>
      <router-link 
        to="/login" 
        class="btn btn-success px-4 py-2 shadow-sm">
        Iniciar sesión
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
</script>
