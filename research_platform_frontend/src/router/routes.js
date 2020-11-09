import emptyRouteView from "../views/EmptyRouteView.vue"

export const routes = [{
        path: "/",
        name: "Landing",
        component: () =>
            import ("../views/Landing.vue"),
        meta: {
            title: "Landing"
        }
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () =>
            import ("../views/Dashboard.vue"),
        meta: {
            researcher: true,
            title: "Dashboard"
        },
    },
    {
        path: "/researches",
        meta: {
            researcher: true,
            title: "Researches"
        },
        component: emptyRouteView,
        children: [{
            path: "",
            name: "Researches",
            component: () =>
                import ("../views/Researches.vue"),
        }, {
            path: "add",
            component: () =>
                import ("../views/AddResearch.vue")
        }]
    },
    {
        path: "/areas",
        name: "Areas",
        component: () =>
            import ("../views/Areas.vue"),
        meta: {
            researcher: true,
            title: "Areas"
        },
    },
    {
        path: "/users",
        name: "Users",
        component: () =>
            import ("../views/Users.vue"),
        meta: {
            researcher: true,
            title: "Users"
        },
    },
    {
        path: "/logout",
        name: "Logout",
        component: () =>
            import ("../views/Logout.vue")
    },
    {
        path: "*",
        redirect: "/",
        name: "Landing",
        component: () =>
            import ("../views/Landing.vue"),
    },
];