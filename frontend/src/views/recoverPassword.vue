<template>
  <div class="recovery-container vh-100">
    <div class="row g-0 h-100">
      <!-- Panel lateral con imagen y mensaje -->
      <div class="col-lg-6 d-none d-lg-block bg-primary text-white">
        <div class="d-flex flex-column justify-content-center h-100 p-5">
          <h2 class="display-6 fw-bold mb-4">StorePOS</h2>
          <p class="fs-5 mb-4">Recupera el acceso a tu cuenta y vuelve a gestionar tu tienda de manera eficiente.</p>
          <div class="features mt-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-shield-lock-fill me-3 fs-4"></i>
              <span>Proceso seguro de recuperación</span>
            </div>
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-arrow-repeat me-3 fs-4"></i>
              <span>Restablecimiento simple de contraseña</span>
            </div>
            <div class="d-flex align-items-center">
              <i class="bi bi-clock-history me-3 fs-4"></i>
              <span>Recupera el acceso rápidamente</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de recuperación -->
      <div class="col-lg-6 bg-white">
        <div class="d-flex flex-column justify-content-center align-items-center h-100 p-4">
          <div class="text-center mb-4">
            <a href="/">
              <img src="../assets/favicon.ico" alt="StorePOS Logo" class="img-fluid mb-4" style="max-height: 60px" />
            </a>
            <h1 class="h3 mb-3 fw-bold">Recuperar contraseña</h1>
            <p class="text-muted" v-if="!codeSent && !resetSuccess">
              Ingresa tu nombre de usuario para recibir instrucciones de recuperación
            </p>
          </div>

          <div class="card border-1 shadow-sm w-100" style="max-width: 400px">
            <div class="card-body p-4">
              <!-- Paso 1: Solicitar recuperación -->
              <div v-if="!codeSent && !resetSuccess">
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

                <!-- Debug info para pruebas -->
                <div v-if="debugMode" class="alert alert-info mb-3">
                  <small>
                    <strong>Modo prueba:</strong> Cualquier usuario es válido. Se generará un código: 123456
                  </small>
                </div>

                <p v-if="errMsg" class="alert alert-danger py-2">{{ errMsg }}</p>
                <p v-if="successMsg" class="alert alert-success py-2">{{ successMsg }}</p>

                <button @click="requestRecovery" class="btn btn-primary w-100 py-2 mb-3" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Enviar instrucciones
                </button>
              </div>

              <!-- Paso 2: Ingresar código y nueva contraseña -->
              <div v-if="codeSent && !resetSuccess">
                <div class="text-center mb-3">
                  <i class="bi bi-envelope-check fs-1 text-success"></i>
                  <h4 class="mt-3">Código enviado</h4>
                  <p class="text-muted">
                    Se ha enviado un código de recuperación al correo electrónico asociado a tu cuenta.
                  </p>
                </div>

                <div class="mb-4">
                  <label for="recoveryCode" class="form-label">Código de recuperación</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-key"></i>
                    </span>
                    <input
                      type="text"
                      id="recoveryCode"
                      class="form-control border-start-0"
                      placeholder="Ingresa el código recibido"
                      v-model="recoveryCode"
                    />
                  </div>
                  <!-- Debug info para pruebas -->
                  <div v-if="debugMode" class="mt-1">
                    <small class="text-muted"> Código de prueba: <strong>123456</strong> </small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="newPassword" class="form-label">Nueva contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="newPassword"
                      class="form-control border-start-0 border-end-0"
                      :class="{ 'is-invalid': passwordValidated && !passwordValid }"
                      placeholder="Ingresa tu nueva contraseña"
                      v-model="newPassword"
                      @input="validatePassword"
                    />
                    <span
                      class="input-group-text bg-light border-start-0 cursor-pointer"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </span>
                  </div>
                </div>

                <!-- Indicadores de requisitos de contraseña -->
                <div class="mb-3 password-requirements small">
                  <div
                    class="requirement"
                    :class="{ 'text-success': minLength, 'text-danger': !minLength && passwordValidated }"
                  >
                    <i :class="minLength ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                    Al menos 6 caracteres
                  </div>
                  <div
                    class="requirement"
                    :class="{ 'text-success': hasNumber, 'text-danger': !hasNumber && passwordValidated }"
                  >
                    <i :class="hasNumber ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                    Al menos un número
                  </div>
                  <div
                    class="requirement"
                    :class="{ 'text-success': hasSpecial, 'text-danger': !hasSpecial && passwordValidated }"
                  >
                    <i :class="hasSpecial ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                    Al menos un carácter especial
                  </div>
                </div>

                <div class="mb-4">
                  <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-lock-fill"></i>
                    </span>
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      id="confirmPassword"
                      class="form-control border-start-0 border-end-0"
                      :class="{ 'is-invalid': confirmValidated && !passwordsMatch }"
                      placeholder="Confirma tu nueva contraseña"
                      v-model="confirmPassword"
                      @input="validateConfirm"
                    />
                    <span
                      class="input-group-text bg-light border-start-0 cursor-pointer"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </span>
                  </div>
                  <div v-if="confirmValidated && !passwordsMatch" class="invalid-feedback d-block">
                    Las contraseñas no coinciden
                  </div>
                </div>

                <p v-if="errMsg" class="alert alert-danger py-2">{{ errMsg }}</p>

                <button
                  @click="resetPassword"
                  class="btn btn-primary w-100 py-2 mb-3"
                  :disabled="isLoading || !passwordValid || !passwordsMatch"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Restablecer contraseña
                </button>
              </div>

              <!-- Paso 3: Éxito -->
              <div v-if="resetSuccess" class="text-center">
                <i class="bi bi-check-circle-fill fs-1 text-success"></i>
                <h4 class="mt-3">¡Contraseña restablecida!</h4>
                <p>Tu contraseña ha sido actualizada correctamente.</p>
                <button @click="goToLogin" class="btn btn-primary w-100 py-2 mt-3">Volver al inicio de sesión</button>
              </div>

              <div class="mt-4 text-center" v-if="!resetSuccess">
                <p class="mb-0">
                  <a href="#" @click.prevent="goToLogin" class="text-decoration-none">
                    <i class="bi bi-arrow-left me-1"></i> Volver al inicio de sesión
                  </a>
                </p>
              </div>

              <!-- Toggle modo debug -->
              <div class="mt-3 text-center">
                <small>
                  <a href="#" @click.prevent="toggleDebug" class="text-muted">
                    {{ debugMode ? "Ocultar ayuda de prueba" : "Mostrar ayuda de prueba" }}
                  </a>
                </small>
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
import { ref, computed } from "vue";

const username = ref("");
const recoveryCode = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errMsg = ref("");
const successMsg = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const codeSent = ref(false);
const resetSuccess = ref(false);
const debugMode = ref(true); // Activar modo debug por defecto

// Variables para validación en tiempo real
const passwordValidated = ref(false);
const confirmValidated = ref(false);
const minLength = ref(false);
const hasNumber = ref(false);
const hasSpecial = ref(false);
const passwordsMatch = ref(false);

// Cambiar el estado del modo debug
const toggleDebug = () => {
  debugMode.value = !debugMode.value;
};

// Validar la contraseña a medida que el usuario escribe
const validatePassword = () => {
  passwordValidated.value = true;

  // Verificar longitud mínima (6 caracteres)
  minLength.value = newPassword.value.length >= 6;

  // Verificar que contiene al menos un número
  hasNumber.value = /\d/.test(newPassword.value);

  // Verificar que contiene al menos un carácter especial
  hasSpecial.value = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword.value);

  // Verificar si las contraseñas coinciden (si ya se ha validado la confirmación)
  if (confirmValidated.value) {
    passwordsMatch.value = confirmPassword.value === newPassword.value;
  }
};

// Validar la confirmación de contraseña
const validateConfirm = () => {
  confirmValidated.value = true;
  passwordsMatch.value = confirmPassword.value === newPassword.value;
};

// Calcular si la contraseña es válida basada en las validaciones
const passwordValid = computed(() => {
  return minLength.value && hasNumber.value && hasSpecial.value;
});

// Simulación del paso 1: Solicitar código de recuperación
const requestRecovery = async () => {
  if (!username.value) {
    errMsg.value = "Por favor, ingresa tu nombre de usuario";
    return;
  }

  isLoading.value = true;
  errMsg.value = "";
  successMsg.value = "";

  // Simulación de tiempo de respuesta del servidor
  setTimeout(() => {
    // Simulación de respuesta exitosa
    successMsg.value = "Se han enviado las instrucciones de recuperación a tu correo electrónico";

    // Después de 2 segundos, pasar al siguiente paso
    setTimeout(() => {
      codeSent.value = true;
      successMsg.value = "";
    }, 2000);

    isLoading.value = false;
  }, 1500);
};

// Simulación del paso 2: Restablecer contraseña con código
const resetPassword = async () => {
  errMsg.value = "";

  // Validaciones
  if (!recoveryCode.value) {
    errMsg.value = "Por favor, ingresa el código de recuperación";
    return;
  }

  if (!newPassword.value) {
    errMsg.value = "Por favor, ingresa una nueva contraseña";
    return;
  }

  // Validación completa de contraseña
  if (!passwordValid.value) {
    errMsg.value = "La contraseña debe tener al menos 6 caracteres, un número y un carácter especial";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errMsg.value = "Las contraseñas no coinciden";
    return;
  }

  isLoading.value = true;

  // Simulación de tiempo de respuesta del servidor
  setTimeout(() => {
    if (recoveryCode.value === "123456") {
      // Código correcto, mostrar éxito
      resetSuccess.value = true;
    } else {
      // Código incorrecto, mostrar error
      errMsg.value = "Código de recuperación inválido o expirado";
    }

    isLoading.value = false;
  }, 1500);
};

// Redireccionar al login (simulado)
const goToLogin = () => {
  // En modo de prueba, reiniciamos el formulario para empezar de nuevo
  codeSent.value = false;
  resetSuccess.value = false;
  username.value = "";
  recoveryCode.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  errMsg.value = "";
  successMsg.value = "";
  passwordValidated.value = false;
  confirmValidated.value = false;
};

import { onMounted } from "vue";

onMounted(() => {
  // Cargar Bootstrap Icons
  const bootstrapIcons = document.createElement("link");
  bootstrapIcons.rel = "stylesheet";
  bootstrapIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";
  document.head.appendChild(bootstrapIcons);

  // Estilos adicionales
  const style = document.createElement("style");
  style.textContent = `
    .recovery-container {
      min-height: 100vh;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .password-requirements {
      margin-top: -8px;
      margin-bottom: 16px;
    }
    .requirement {
      margin-top: 4px;
    }
    .requirement i {
      margin-right: 5px;
    }
  `;
  document.head.appendChild(style);
});
</script>
