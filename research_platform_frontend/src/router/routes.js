export const routes = [{
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
        path: "/onderzoeken",
        name: "Onderzoeken",
        component: () =>
            import ("../views/Onderzoeken.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "/gebieden",
        name: "Gebieden",
        component: () =>
            import ("../views/Gebieden.vue"),
        meta: {
            researcher: true,
        },
    },
    {
        path: "/gebruikers",
        name: "Gebruikers",
        component: () =>
            import ("../views/Gebruikers.vue"),
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