import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/LandingPage.vue") },
    { path: "/signup", component: () => import("../views/SignUp.vue") },
    { path: "/login", name: "Login", component: () => import("../views/LogIn.vue") },
    { path: "/recuperar-contraseña", component: () => import("../views/recoverPassword.vue") },
    { path: "/pos", component: () => import("../views/Home.vue"), meta: { requiresAuth: true } },
    { path: "/nueva-venta", component: () => import("../views/NewSale.vue") },
    { path: "/inventario", component: () => import("../views/Articles.vue") },
    { path: "/historial-ventas", component: () => import("../views/Sales.vue") },
    { path: "/corte-caja", component: () => import("../views/CashAudit.vue") },
    { path: "/usuarios", component: () => import("../views/Users.vue") }
  ]
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("authToken");

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (user && token) {
      // El usuario está logueado, permite el acceso
      next();
    } else {
      // No hay usuario, redirige al login
      next({ name: "Login" });
    }
  } else if (to.path === "/login" && user && token) {
    // Si el usuario ya está logueado y trata de acceder a la página de login, redirige al home
    next({ path: "/pos" });
  } else if (to.path === "/signup" && user && token) {
    // Si el usuario ya está logueado y trata de acceder a la página de signup, redirige al home
    next({ path: "/pos" });
  } else {
    // La ruta no requiere autenticación
    next();
  }
});

export default router;
