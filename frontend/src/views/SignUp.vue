<template>
  <div class="register-container">
    <div class="row g-0 h-100">
      <!-- Panel lateral con imagen y mensaje -->
      <div class="col-lg-6 d-none d-lg-block bg-primary text-white">
        <div class="d-flex flex-column justify-content-center h-100 p-5">
          <h2 class="display-6 fw-bold mb-4">Únete a Retail-Insight</h2>
          <p class="fs-5 mb-4">Optimiza tu negocio con nuestra plataforma de análisis inteligente.</p>
          <div class="features mt-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill me-3 fs-4"></i>
              <span>Análisis automatizado con IA generativa</span>
            </div>
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill me-3 fs-4"></i>
              <span>Visualizaciones interactivas de datos</span>
            </div>
            <div class="d-flex align-items-center">
              <i class="bi bi-check-circle-fill me-3 fs-4"></i>
              <span>Recomendaciones estratégicas personalizadas</span>
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
              src="/favicon.ico" 
              alt="Retail-Insight Logo" 
              class="img-fluid mb-4"
              style="max-height: 60px;"
            />
          </a>
            <h1 class="h3 mb-3 fw-bold">Crea una cuenta</h1>
            <p class="text-muted">Regístrate para empezar a optimizar tu negocio</p>
          </div>
          
          <div class="card border-0 shadow-sm w-100" style="max-width: 400px;">
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
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <div class="d-flex justify-content-between">
                  <label for="confirmPassword" class="form-label">Confirma tu contraseña</label>
                </div>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    class="form-control border-start-0 border-end-0"
                    placeholder="Confirma tu contraseña"
                    v-model="confirmPassword"
                  />
                  <span 
                    class="input-group-text bg-light border-start-0 cursor-pointer"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </span>
                </div>
              </div>
              
              <p v-if="errMsg" class="alert alert-danger py-2">{{ errMsg }}</p>
              
              <button @click="register" class="btn btn-primary w-100 py-2 mb-3" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registrarse
              </button>
              
              <div class="text-center mb-3">
                <span class="text-muted small">O continúa con</span>
              </div>
              
              <button @click="signInWithGoogle" class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center py-2" :disabled="isLoading">
                <i class="fab fa-google me-2"></i> Registrarse con Google
              </button>
              
              <div class="mt-4 text-center">
                <p class="mb-0">
                  ¿Ya tienes una cuenta? <a href="/login" class="text-decoration-none fw-semibold">Inicia sesión</a>
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
import { ref, onMounted } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errMsg = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const auth = getAuth();
const router = useRouter();

const register = async () => {
  // Validaciones básicas
  if (!email.value || !password.value || !confirmPassword.value) {
    errMsg.value = "Por favor, completa todos los campos";
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errMsg.value = "Las contraseñas no coinciden";
    return;
  }
  
  if (password.value.length < 6) {
    errMsg.value = "La contraseña debe tener al menos 6 caracteres";
    return;
  }
  
  isLoading.value = true;
  errMsg.value = "";
  
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("Registro exitoso");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error de registro:", error.code);
    switch(error.code) {
      case 'auth/email-already-in-use':
        errMsg.value = "Este correo electrónico ya está registrado";
        break;
      case 'auth/invalid-email':
        errMsg.value = "El formato del correo electrónico es inválido";
        break;
      case 'auth/weak-password':
        errMsg.value = "La contraseña es demasiado débil";
        break;
      default:
        errMsg.value = "Error en el registro: " + error.message;
    }
  } finally {
    isLoading.value = false;
  }
};

const signInWithGoogle = async () => {
  isLoading.value = true;
  errMsg.value = "";
  
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    console.log("Registro con Google exitoso");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error de registro con Google:", error);
    if (error.code === 'auth/popup-closed-by-user') {
      errMsg.value = "Ventana de autenticación cerrada";
    } else {
      errMsg.value = "Error al registrarse con Google";
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Cargar estilos CSS si no están en el head
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const bootstrapIcons = document.createElement("link");
    bootstrapIcons.rel = "stylesheet";
    bootstrapIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";
    document.head.appendChild(bootstrapIcons);
  }
  
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
    document.head.appendChild(fontAwesome);
  }
});
</script>

<style scoped>
.register-container {
  min-height: 100vh;
}
.cursor-pointer {
  cursor: pointer;
}
</style>