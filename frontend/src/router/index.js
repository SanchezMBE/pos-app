import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/LandingPage.vue") },
    { path: "/signup", component: () => import("../views/SignUp.vue") },
    { path: "/login", component: () => import("../views/LogIn.vue") },
    { path: "/articles", component: () => import("../views/Articles.vue") },
    { path: "/sales", component: () => import("../views/Sales.vue") },
    { path: "/boxcut", component: () => import("../views/boxcut.vue") },
    { path: "/boxopening", component: () => import("../views/boxopening.vue") },
    { path: "/recover-password", component: () => import("../views/recoverPassword.vue") },
    { path: "/inventario", component: () => import("../views/Articles.vue") },
    {
      path: "/pos",
      component: () => import("../views/Home.vue"),
      // children: [
      //   { path: "/articles", component: () => import("../views/Articles.vue")},
      // ],
      meta: {
        requiresAuth: true
      }
    }
  ]
});

const getCurrentUser = () => {};

router.beforeEach(async (to, from, next) => {
  // cambiar true por verificar si hay un usuario autenticado
  if (true) {
    if (true) {
      next();
    } else {
      console.error("Acceso denegado");
      next("/");
    }
  } else {
    next();
  }
});

export default router;
