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
  },
  {
    path: "/onderzoeken",
    name: "Onderzoeken",
    component: () => import("../views/Onderzoeken.vue"),
  },
  {
    path: "/gebieden",
    name: "Gebieden",
    component: () => import("../views/Gebieden.vue"),
  },
  {
    path: "/gebruikers",
    name: "Gebruikers",
    component: () => import("../views/Gebruikers.vue"),
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

export default router;
