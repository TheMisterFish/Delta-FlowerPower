import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Landing",
        component: () =>
            import ("../views/Test.vue"),
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () =>
            import ("../views/Dashboard.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "/create_research",
        name: "CreateResearch",
        component: () =>
            import ("../views/CreateResearch.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "*",
        redirect: "/",
        name: "Landing",
        component: () =>
            import ("../views/Landing.vue"),
    },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    console.log(to, from);
    if (to.matched.some((record) => record.meta.researcher)) {
        if (localStorage.getItem("token") == null) {
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