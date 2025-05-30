import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/LandingPage.vue") },
    { path: "/signup", component: () => import("../views/SignUp.vue") },
    { path: "/login", component: () => import("../views/LogIn.vue") },
    // { path: "/recuperar-password", component: () => import("../views/recoverPassword.vue"), meta: { requiresAuth: true } },
    { path: "/pos", component: () => import("../views/Home.vue"), meta: { requiresAuth: true } },
    { path: "/nueva-venta", component: () => import("../views/NewSale.vue"), meta: { requiresAuth: true } },
    { path: "/inventario", component: () => import("../views/Articles.vue"), meta: { requiresAuth: true } },
    { path: "/historial-ventas", component: () => import("../views/SalesHistory.vue"), meta: { requiresAuth: true } },
    { path: "/registros-turnos", component: () => import("../views/ShiftRecord.vue"), meta: { requiresAuth: true } },
    { path: "/corte-caja", component: () => import("../views/CloseShift.vue"), meta: { requiresAuth: true } },
    { path: "/perfil", component: () => import("../views/Perfil.vue"), meta: { requiresAuth: true } },
    { path: "/usuarios", component: () => import("../views/Users.vue"), meta: { requiresAuth: true } }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();

    try {
      await userStore.fetchUser();

      if (!userStore.isAuthenticated) {
        return next("/login");
      }
    } catch (error) {}
  }

  next();
});

export default router;
