<template>
  <div
    class="container d-flex flex-column align-items-center justify-content-center min-vh-100"
  >
    <h1 class="mb-4">Iniciar sesión</h1>
    <div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%">
      <div class="mb-3">
        <label for="email" class="form-label">Correo electrónico</label>
        <input
          type="text"
          id="email"
          class="form-control"
          placeholder="Ingresa tu email"
          v-model="email"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          id="password"
          class="form-control"
          placeholder="Ingresa tu contraseña"
          v-model="password"
        />
      </div>
      <p v-if="errMsg" class="text-danger">{{ errMsg }}</p>
      <button @click="register" class="btn btn-primary w-100 mb-2">
        Iniciar sesión
      </button>
      <button
        @click="signInWithGoogle"
        class="btn btn-danger w-100 d-flex align-items-center justify-content-center"
      >
        <i class="fab fa-google me-2"></i> Inicar sesión con Google
      </button>
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
const auth = getAuth();
const router = useRouter();

const register = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("Inicio de sesión con Email exitoso");
    router.push("/pos");
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Correo inválido";
        break;
      case "auth/missing-password":
        errMsg.value = "Ingresa la contraseña";
        break;
      default:
        errMsg.value = "Correo o contraseña incorrectas";
        break;
    }
  }
};

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    console.log("Usuario registrado con Google");
    router.push("/pos");
  } catch (error) {
    console.log("Algo salió mal al iniciar sesión con Google");
    errMsg.value = "Algo salió mal al iniciar sesión con Google";
  }
};

import { onMounted } from "vue";

onMounted(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
  link.integrity = "sha384-...";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
});
</script>
