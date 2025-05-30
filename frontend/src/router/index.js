import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/LandingPage.vue") },
    { path: "/signup", component: () => import("../views/SignUp.vue") },
    { path: "/login", component: () => import("../views/LogIn.vue") },
    { path: "/pos", component: () => import("../views/Home.vue"), meta: { requiresAuth: true } },
    { path: "/nueva-venta", component: () => import("../views/NewSale.vue"), meta: { requiresAuth: true } },
    { path: "/inventario", component: () => import("../views/Articles.vue"), meta: { requiresAuth: true } },
    { path: "/historial-ventas", component: () => import("../views/SalesHistory.vue"), meta: { requiresAuth: true } },
    { path: "/perfil", component: () => import("../views/Profile.vue"), meta: { requiresAuth: true } },
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

      if (userStore.user.role !== "admin" && to.path === "/usuarios") {
        return next("/pos");
      }
      if (userStore.user.role !== "admin" && to.path === "/inventario") {
        return next("/pos");
      }
      if (userStore.user.role !== "admin" && to.path === "/historial-ventas") {
        return next("/pos");
      }
      if (userStore.user.role !== "admin" && to.path === "/perfil") {
        return next("/pos");
      }
    } catch (error) {}
  }

  next();
});

export default router;
