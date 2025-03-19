<template>
  <h1>Iniciar sesión</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p v-if="errMsg">{{ errMsg }}</p>
  <p><button @click="register">Continuar</button></p>
  <p><button @click="signInWithGoogle">Iniciar sesión con Google</button></p>
</template>

<script setup>
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
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value,
    );
    console.log("Inicio de sesión con Email exitoso");
    router.push("/pos");
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Correo inválido"
        break;
      default:
        errMsg.value = "Correo o contraseña incorrectas"
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
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Correo inválido"
        break;
      default:
        errMsg.value = "Correo o contraseña incorrectas"
        break;
    }
  }
};
</script>
