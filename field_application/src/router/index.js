import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Landing",
        component: () =>
            import ("../views/Landing.vue"),
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
        path: "/create_drone_research",
        name: "CreateDroneResearch",
        component: () =>
            import ("../views/CreateDroneResearch.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "/create_sd_research",
        name: "CreateSdResearch",
        component: () =>
            import ("../views/CreateSdResearch.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "/active_drone_research",
        name: "ActiveDroneResearch",
        component: () =>
            import ("../views/ActiveDroneResearch.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "/active_sd_research/:id",
        name: "ActiveSdResearch",
        component: () =>
            import ("../views/ActiveSdResearch.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "/settings",
        name: "Settings",
        component: () =>
            import ("../views/Settings.vue"),
        meta: {
            researcher: true
        }
    },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    const firstLaunch = localStorage.getItem("firstLaunch");
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (to.matched.some((record) => record.meta.researcher)) {
        if (firstLaunch === null) {
            next({ name: "Landing" });
        } else if (!email && !password) {
            next({ name: "Landing" });
        } else {
            next();
        }
    } else {
        if (email && password) {
            next({ name: "Dashboard" })
        }
        next();
    }
});

export default router;