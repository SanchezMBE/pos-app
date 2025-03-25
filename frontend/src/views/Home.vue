<template>
  <div class="container d-flex flex-column align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow-sm text-center" style="max-width: 400px; width: 100%">
      <h1 class="mb-4">Bienvenido {{ auth.currentUser.displayName ?? auth.currentUser.email }}</h1>
      <button @click="handleSignOut" class="btn btn-danger w-100">Cerrar sesión</button>
      <router-link 
        to="/articles" 
        class="btn btn-primary px-4 py-2 shadow-sm">
        Artículos
      </router-link>
    </div>
  </div>
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
