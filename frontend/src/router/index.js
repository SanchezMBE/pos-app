import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/LandingPage.vue") },
    { path: "/signup", component: () => import("../views/SignUp.vue") },
    { path: "/login", component: () => import("../views/LogIn.vue") },
    { path: "/articles", component: () => import("../views/Articles.vue") },
    { path: "/recover-password", component: () => import("../views/recoverPassword.vue") },
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

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
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
