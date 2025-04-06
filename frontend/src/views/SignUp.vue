<template>
  <div class="register-container vh-100">
    <div class="row g-0 h-100">
      <!-- Panel lateral con imagen y mensaje -->
      <div class="col-lg-6 d-none d-lg-block bg-primary text-white">
        <div class="d-flex flex-column justify-content-center h-100 p-5">
          <h2 class="display-6 fw-bold mb-4">Únete a StorePOS</h2>
          <p class="fs-5 mb-4">Optimiza tu tienda de abarrotes con nuestro sistema integral de punto de venta.</p>
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

      <!-- Formulario de registro -->
      <div class="col-lg-6 bg-white">
        <div class="d-flex flex-column justify-content-center align-items-center h-100 p-4">
          <div class="text-center mb-4">
            <a href="/">
              <img
                src="../assets/favicon.ico"
                alt="Retail-Insight Logo"
                class="img-fluid mb-4"
                style="max-height: 60px"
              />
            </a>
            <h1 class="h3 mb-3 fw-bold">Crea una cuenta para tu negocio</h1>
            <p class="text-muted">
              {{ paso === 1 ? "Ingresa la información de tu negocio" : "Registra tus datos de usuario para finalizar" }}
            </p>
          </div>

          <div class="card border-1 shadow-sm w-100" style="max-width: 400px">
            <div class="card-body p-4">
              <!-- Paso 1: Datos del negocio -->
              <div v-if="paso === 1">
                <div class="mb-4">
                  <label for="businessName" class="form-label">Nombre del negocio</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-shop"></i>
                    </span>
                    <input
                      type="text"
                      id="businessName"
                      class="form-control border-start-1"
                      placeholder="Ingresa el nombre de tu negocio"
                      v-model="businessName"
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="address" class="form-label">Dirección</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-geo-alt"></i>
                    </span>
                    <input
                      type="text"
                      id="address"
                      class="form-control border-start-1"
                      placeholder="Ingresa la dirección de tu negocio"
                      v-model="address"
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="phone" class="form-label">Número telefónico</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      class="form-control border-start-1"
                      placeholder="Ingresa tu número telefónico"
                      v-model="phone"
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      class="form-control border-start-1"
                      :class="{
                        'is-invalid': !isEmailAvailable && emailMsg,
                        'is-valid': isEmailAvailable && emailMsg
                      }"
                      placeholder="Ingresa el correo de tu negocio"
                      v-model="email"
                    />
                  </div>
                  <div
                    v-if="emailMsg"
                    class="form-text"
                    :class="{
                      'text-success': isEmailAvailable,
                      'text-danger': !isEmailAvailable
                    }"
                  >
                    {{ emailMsg }}
                  </div>
                </div>
              </div>

              <!-- Paso 2: Datos del usuario -->
              <div v-else>
                <div class="mb-4">
                  <label for="name" class="form-label">Nombre completo</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-person-circle"></i>
                    </span>
                    <input
                      type="text"
                      id="name"
                      class="form-control border-start-1"
                      placeholder="Ingresa tu nombre completo"
                      v-model="name"
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="user" class="form-label">Nombre de usuario</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      id="user"
                      class="form-control border-start-1"
                      :class="{
                        'is-invalid': !isUserAvailable && userMsg,
                        'is-valid': isUserAvailable && userMsg
                      }"
                      placeholder="Ingresa un nombre de usuario"
                      v-model="user"
                    />
                  </div>
                  <div
                    v-if="userMsg"
                    class="form-text"
                    :class="{
                      'text-success': isUserAvailable,
                      'text-danger': !isUserAvailable
                    }"
                  >
                    {{ userMsg }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      v-model="password"
                      placeholder="Contraseña"
                    />
                    <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <small
                    :class="
                      passwordRequirements.length && passwordRequirements.number && passwordRequirements.special
                        ? 'text-success'
                        : 'text-danger'
                    "
                    >{{ passwordStrength }}</small
                  >
                </div>

                <div class="mb-4">
                  <label for="confirmPassword" class="form-label">Confirma tu contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-lock-fill"></i>
                    </span>
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      id="confirmPassword"
                      class="form-control border-start-1 border-end-0"
                      placeholder="Confirma tu contraseña"
                      v-model="confirmPassword"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <small :class="isPasswordMatch ? 'text-success' : 'text-danger'">{{ passwordMatch }}</small>
                </div>
              </div>

              <p v-if="errMsg" class="alert alert-danger py-2">{{ errMsg }}</p>

              <div class="d-flex gap-2 mb-3" v-if="paso === 2">
                <button @click="paso = 1" class="btn btn-outline-secondary flex-grow-1">Atrás</button>
                <button @click="register" class="btn btn-primary flex-grow-1" :disabled="isLoading">
                  <span
                    v-if="isLoading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Registrarse
                </button>
              </div>

              <button v-if="paso === 1" @click="siguientePaso" class="btn btn-primary w-100 py-2 mb-3">
                Siguiente
              </button>

              <div class="mt-4 text-center">
                <p class="mb-0">
                  ¿Ya tienes una cuenta?
                  <a href="/login" class="text-decoration-none fw-semibold">Inicia sesión</a>
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
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Simulación de base de datos con usuarios y correos existentes
const existingEmails = ["tienda@ejemplo.com", "abarrotes@ejemplo.com", "mini@ejemplo.com"];
const existingUsernames = ["admin", "cajero1", "usuario1", "vendedor"];

// Datos del usuario (paso 2)
const name = ref("");
const user = ref("");
const password = ref("");
const confirmPassword = ref("");
const passwordStrength = ref("");
const passwordRequirements = {
  length: false,
  number: false,
  special: false
};
const passwordMatch = ref("");
const isPasswordMatch = ref(false);

// Datos del negocio (paso 1)
const businessName = ref("");
const address = ref("");
const phone = ref("");
const email = ref("");

// Control de UI
const paso = ref(1);
const errMsg = ref("");
const userMsg = ref("");
const emailMsg = ref("");
const isUserAvailable = ref(true);
const isEmailAvailable = ref(true);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const router = useRouter();

// Funciones para verificación
// const isEmailRegistered = (emailToCheck) => {
//   return existingEmails.includes(emailToCheck.toLowerCase());
// };

// const isUsernameRegistered = (usernameToCheck) => {
//   return existingUsernames.includes(usernameToCheck.toLowerCase());
// };

// Verificación en tiempo real para usuario
// watch(user, (newValue) => {
//   if (newValue.length > 3) {
//     // Solo verificar cuando hay al menos 3 caracteres
//     if (isUsernameRegistered(newValue)) {
//       userMsg.value = "Este nombre de usuario ya está en uso";
//       isUserAvailable.value = false;
//     } else {
//       userMsg.value = "Nombre de usuario disponible";
//       isUserAvailable.value = true;
//     }
//   } else {
//     userMsg.value = "";
//     isUserAvailable.value = true;
//   }
// });

// Verificación en tiempo real para correo
// watch(email, (newValue) => {
//   if (newValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
//     if (isEmailRegistered(newValue)) {
//       emailMsg.value = "Este correo ya está registrado";
//       isEmailAvailable.value = false;
//     } else {
//       emailMsg.value = "Correo disponible";
//       isEmailAvailable.value = true;
//     }
//   } else {
//     emailMsg.value = "";
//     isEmailAvailable.value = true;
//   }
// });

// Verificación en tiempo real para contraseña
watch(password, (newValue) => {
  passwordRequirements.length = newValue.length >= 6;
  passwordRequirements.number = /[0-9]/.test(newValue);
  passwordRequirements.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newValue);

  if (newValue.length === 0) {
    passwordStrength.value = "";
  } else if (passwordRequirements.length && passwordRequirements.number && passwordRequirements.special) {
    passwordStrength.value = "Contraseña fuerte";
  } else {
    let mensaje = "La contraseña debe tener: ";
    if (!passwordRequirements.length) mensaje += "al menos 6 caracteres, ";
    if (!passwordRequirements.number) mensaje += "al menos un número, ";
    if (!passwordRequirements.special) mensaje += "al menos un carácter especial, ";
    passwordStrength.value = mensaje.slice(0, -2); // Quitar la última coma y espacio
  }
});

// Validar cambios en ambas contraseñas
watch([password, confirmPassword], ([newPassword, newConfirmPassword]) => {
  if (newConfirmPassword.length === 0) {
    passwordMatch.value = "";
    isPasswordMatch.value = false;
  } else if (newPassword === newConfirmPassword) {
    passwordMatch.value = "Las contraseñas coinciden";
    isPasswordMatch.value = true;
  } else {
    passwordMatch.value = "Las contraseñas no coinciden";
    isPasswordMatch.value = false;
  }
});

const siguientePaso = () => {
  // Validaciones para el paso 1 (negocio)
  if (!businessName.value || !address.value || !phone.value || !email.value) {
    errMsg.value = "Por favor, completa todos los campos del negocio";
    return;
  }

  // Validación para número telefónico (solo dígitos y mínimo 10)
  const phoneRegex = /^\d{10,}$/;
  if (!phoneRegex.test(phone.value)) {
    errMsg.value = "El número telefónico debe contener al menos 10 dígitos numéricos";
    return;
  }

  // Validación básica para email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errMsg.value = "Por favor, ingresa un correo electrónico válido";
    return;
  }

  // Verificar si el correo ya está registrado
  if (isEmailRegistered(email.value)) {
    errMsg.value = "Este correo electrónico ya está registrado. Por favor, utiliza otro.";
    return;
  }

  // Si todo está correcto, avanzamos al paso 2
  errMsg.value = "";
  paso.value = 2;
};

const register = async () => {
  // Validaciones para el paso 2 (usuario)
  if (!name.value || !user.value || !password.value || !confirmPassword.value) {
    errMsg.value = "Por favor, completa todos los campos";
    return;
  }

  // Verificar si el nombre de usuario ya está registrado
  if (isUsernameRegistered(user.value)) {
    errMsg.value = "Este nombre de usuario ya está en uso. Por favor, elige otro.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errMsg.value = "Las contraseñas no coinciden";
    return;
  }

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z]).{6,}$/;
  if (!passwordRegex.test(password.value)) {
    errMsg.value = "La contraseña debe tener al menos 6 caracteres, al menos un número y un carácter especial";
    return;
  }

  isLoading.value = true;
  errMsg.value = "";

  const data = {
    business: {
      name: businessName.value,
      address: address.value,
      phone: phone.value,
      email: email.value
    },
    user: {
      full_name: name.value,
      username: user.value,
      password: password.value
    }
  };

  try {
    const response = await axios.post("http://localhost:3000/api/signup", data);
    console.log(response);

    if (response.data) {
      const token = response.data.data.token;
      const user = response.data.data.user;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
    switch (error.response.status) {
      case 401:
        errMsg.value = "Credenciales inválidas";
        break;
      default:
        errMsg.value = "Error en el servidor. Inténtalo más tarde";
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  //Estilos de Bootstrap Icons
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const bootstrapIcons = document.createElement("link");
    bootstrapIcons.rel = "stylesheet";
    bootstrapIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";
    document.head.appendChild(bootstrapIcons);
  }
});
</script>
