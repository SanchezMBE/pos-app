<template>
  <h1>Bienvenido</h1>
  <button @click="handleSignOut">Cerrar sesión</button>
</template>

<script setup>
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
const auth = getAuth();
const router = useRouter();

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};
</script>
