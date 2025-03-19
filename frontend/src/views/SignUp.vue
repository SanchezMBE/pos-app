<template>
  <h1>Crea una cuenta</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p v-if="errMsg">{{ errMsg }}</p>
  <p><button @click="register">Continuar</button></p>
  <p><button @click="signInWithGoogle">Registrarse con Google</button></p>
</template>

<script setup>
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
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
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("Usuario registrado con Email");
    router.push("/pos");
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        errMsg.value = "Correo asociado a una cuenta existente";
        break;
      case "auth/invalid-email":
        errMsg.value = "Correo inválido";
        break;
      case "auth/weak-password":
        errMsg.value = "Contraseña debil";
        break;
      default:
        errMsg.value = error.code;
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
  }
};
</script>
