import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      researcher: true,
    },
  },
  {
    path: "/onderzoeken",
    name: "Onderzoeken",
    component: () => import("../views/Onderzoeken.vue"),
    meta: {
      researcher: true,
    },
  },
  {
    path: "/gebieden",
    name: "Gebieden",
    component: () => import("../views/Gebieden.vue"),
    meta: {
      researcher: true,
    },
  },
  {
    path: "/gebruikers",
    name: "Gebruikers",
    component: () => import("../views/Gebruikers.vue"),
    meta: {
      researcher: true,
    },
  },
  {
    path: "*",
    redirect: "/",
    name: "Landing",
    component: () => import("../views/Landing.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to, from);
  if (to.matched.some((record) => record.meta.researcher)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/landing",
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
