<template>
  <div class="login-container vh-100">
    <div class="row g-0 h-100">
      <!-- Panel lateral con imagen y mensaje -->
      <div class="col-lg-6 d-none d-lg-block bg-primary text-white">
        <div class="d-flex flex-column justify-content-center h-100 p-5">
          <h2 class="display-6 fw-bold mb-4">StorePOS</h2>
          <p class="fs-5 mb-4">
            Optimiza la gestión de tu tienda de abarrotes con nuestro sistema integral de punto de venta.
          </p>
          <div class="features mt-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill me-3 fs-4"></i>
              <span>Control de inventario en tiempo real</span>
            </div>
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill me-3 fs-4"></i>
              <span>Gestión eficiente de ventas y transacciones</span>
            </div>
            <div class="d-flex align-items-center">
              <i class="bi bi-check-circle-fill me-3 fs-4"></i>
              <span>Corte de caja automatizado y reportes detallados</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de login -->
      <div class="col-lg-6 bg-white">
        <div class="d-flex flex-column justify-content-center align-items-center h-100 p-4">
          <div class="text-center mb-4">
            <a href="/">
              <img src="../assets/favicon.ico" alt="StorePOS Logo" class="img-fluid mb-4" style="max-height: 60px" />
            </a>
            <h1 class="h3 mb-3 fw-bold">Accede a tu cuenta</h1>
            <p class="text-muted">Ingresa tus credenciales para continuar</p>
          </div>

          <div class="card border-1 shadow-sm w-100" style="max-width: 400px">
            <div class="card-body p-4">
              <div class="mb-4">
                <label for="username" class="form-label">Nombre de usuario</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    id="username"
                    class="form-control border-start-1"
                    placeholder="Ingresa tu nombre de usuario"
                    v-model="username"
                  />
                </div>
              </div>

              <div class="mb-4">
                <div class="d-flex justify-content-between">
                  <label for="password" class="form-label">Contraseña</label>
                  <a href="/recuperar-password" class="text-decoration-none small">¿Olvidaste tu contraseña?</a>
                </div>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control border-start-1 border-end-0"
                    placeholder="Ingresa tu contraseña"
                    v-model="password"
                  />
                  <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <p v-if="errMsg" class="alert alert-danger py-2">{{ errMsg }}</p>

              <button @click="login" class="btn btn-primary w-100 py-2 mb-3" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                Iniciar sesión
              </button>

              <div class="mt-4 text-center">
                <p class="mb-0">
                  ¿No tienes una cuenta?
                  <a href="/signup" class="text-decoration-none fw-semibold">Regístrate</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const username = ref("");
const password = ref("");
const errMsg = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const router = useRouter();

const login = async () => {
  if (!username.value || !password.value) {
    errMsg.value = "Por favor, completa todos los campos";
    return;
  }

  isLoading.value = true;

  try {
    // Realizar petición al backend para autenticar con la base de datos local
    const response = await axios.post("http://localhost:3000/api/login", {
      username: username.value,
      password: password.value
    });

    // Si la autenticación es exitosa, guardar datos del usuario en localStorage
    if (response.data) {
      const token = response.data.data.token;
      const user = response.data.data.user;

      // Guardar información del usuario y el token
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Registro exitoso");
      // Redirigir según el rol del usuario (?)
      if (user.role === "admin") {
        router.push("/pos");
      } else {
        router.push("/pos");
      }
    }
  } catch (error) {
    // Manejar diferentes tipos de errores
    if (error.response) {
      // Respuesta del servidor con código de error
      switch (error.response.status) {
        case 401:
          errMsg.value = "Usuario o contraseña incorrectos";
          break;
        case 403:
          errMsg.value = "Cuenta bloqueada. Contacta al administrador";
          break;
        case 429:
          errMsg.value = "Demasiados intentos fallidos. Inténtalo más tarde";
          break;
        default:
          errMsg.value = "Error en el servidor. Inténtalo más tarde";
      }
    } else if (error.request) {
      // No se recibió respuesta del servidor
      errMsg.value = "No se pudo conectar con el servidor";
    } else {
      // Error en la configuración de la solicitud
      errMsg.value = "Error al procesar la solicitud";
    }
  } finally {
    isLoading.value = false;
  }
};

import { onMounted } from "vue";

onMounted(() => {
  // // Verificar si ya hay una sesión activa
  // const authToken = localStorage.getItem("authToken");
  // const user = localStorage.getItem("user");

  // if (authToken && user) {
  //   // Configurar token para peticiones
  //   axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

  //   // Verificar si el token sigue siendo válido (opcional)
  //   axios
  //     .get("http://localhost:3000/api/login")
  //     .then(() => {
  //       const userData = JSON.parse(user);
  //       // Redirigir según el rol del usuario
  //       if (userData.role === "admin") {
  //         router.push("/admin");
  //       } else {
  //         router.push("/pos");
  //       }
  //     })
  //     .catch((err) => {
  //       // Si el token no es válido, limpiar localStorage
  //       localStorage.removeItem("authToken");
  //       localStorage.removeItem("user");
  //       console.log("Sesión expirada o inválida");
  //     });
  // }

  // Cargar Bootstrap Icons
  const bootstrapIcons = document.createElement("link");
  bootstrapIcons.rel = "stylesheet";
  bootstrapIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";
  document.head.appendChild(bootstrapIcons);

  // Cargar Font Awesome para los íconos que puedan seguir usándose en otras partes
  const fontAwesome = document.createElement("link");
  fontAwesome.rel = "stylesheet";
  fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
  document.head.appendChild(fontAwesome);

  // Estilos adicionales
  const style = document.createElement("style");
  style.textContent = `
    .login-container {
      min-height: 100vh;
    }
    .cursor-pointer {
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
});
</script>
