<template>
  <div class="login-container vh-100">
    <div class="row g-0 h-100">
      <!-- Panel lateral con imagen y mensaje -->
      <div class="col-lg-6 d-none d-lg-block bg-primary text-white">
        <div class="d-flex flex-column justify-content-center h-100 p-5">
          <h2 class="display-6 fw-bold mb-4">StorePOS</h2>
          <p class="fs-5 mb-4">
            Optimiza la gestión de tu tienda de abarrotes con nuestro sistema
            integral de punto de venta.
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
        <div
          class="d-flex flex-column justify-content-center align-items-center h-100 p-4"
        >
          <div class="text-center mb-4">
            <a href="/">
              <img
                src="D:\pos-app\pos-app\frontend\src\assets\favicon.ico"
                alt="Retail-Insight Logo"
                class="img-fluid mb-4"
                style="max-height: 60px"
              />
            </a>
            <h1 class="h3 mb-3 fw-bold">Accede a tu cuenta</h1>
            <p class="text-muted">Ingresa tus credenciales para continuar</p>
          </div>

          <div class="card border-0 shadow-sm w-100" style="max-width: 400px">
            <div class="card-body p-4">
              <div class="mb-4">
                <label for="email" class="form-label">Correo electrónico</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    class="form-control border-start-0"
                    placeholder="nombre@empresa.com"
                    v-model="email"
                  />
                </div>
              </div>

              <div class="mb-4">
                <div class="d-flex justify-content-between">
                  <label for="password" class="form-label">Contraseña</label>
                  <a href="#" class="text-decoration-none small"
                    >¿Olvidaste tu contraseña?</a
                  >
                </div>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control border-start-0 border-end-0"
                    placeholder="Ingresa tu contraseña"
                    v-model="password"
                  />
                  <span
                    class="input-group-text bg-light border-start-0 cursor-pointer"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                    ></i>
                  </span>
                </div>
              </div>

              <!--
              <div class="form-check mb-4">
                <input class="form-check-input" type="checkbox" id="remember" v-model="rememberMe">
                <label class="form-check-label" for="remember">
                  Recordar mi sesión
                </label>
              </div>
              -->

              <p v-if="errMsg" class="alert alert-danger py-2">{{ errMsg }}</p>

              <button
                @click="register"
                class="btn btn-primary w-100 py-2 mb-3"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Iniciar sesión
              </button>

              <div class="text-center mb-3">
                <span class="text-muted small">O continúa con</span>
              </div>

              <button
                @click="signInWithGoogle"
                class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center py-2"
                :disabled="isLoading"
              >
                <i class="fab fa-google me-2"></i> Google
              </button>

              <div class="mt-4 text-center">
                <p class="mb-0">
                  ¿No tienes una cuenta?
                  <a href="/signup" class="text-decoration-none fw-semibold"
                    >Regístrate</a
                  >
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
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errMsg = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const auth = getAuth();
const router = useRouter();

const register = async () => {
  if (!email.value || !password.value) {
    errMsg.value = "Por favor, completa todos los campos";
    return;
  }

  isLoading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("Inicio de sesión con Email exitoso");
    router.push("/pos");
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Formato de correo electrónico inválido";
        break;
      case "auth/missing-password":
        errMsg.value = "Por favor, ingresa tu contraseña";
        break;
      case "auth/too-many-requests":
        errMsg.value = "Demasiados intentos fallidos. Inténtalo más tarde";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        errMsg.value = "Correo o contraseña incorrectos";
        break;
      default:
        errMsg.value = `Error al iniciar sesión: ${error.message}`;
        break;
    }
  } finally {
    isLoading.value = false;
  }
};

const signInWithGoogle = async () => {
  isLoading.value = true;
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    console.log("Usuario autenticado con Google");
    router.push("/pos");
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    errMsg.value = "No se pudo completar el inicio de sesión con Google";
  } finally {
    isLoading.value = false;
  }
};

import { onMounted } from "vue";

onMounted(() => {
  // Cargar Bootstrap Icons
  const bootstrapIcons = document.createElement("link");
  bootstrapIcons.rel = "stylesheet";
  bootstrapIcons.href =
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";
  document.head.appendChild(bootstrapIcons);

  // Cargar Font Awesome
  const fontAwesome = document.createElement("link");
  fontAwesome.rel = "stylesheet";
  fontAwesome.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
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
