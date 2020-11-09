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
            title: "Dashboard",
            drawer: true
        },
    },
    {
        path: "/researches",
        component: emptyRouteView,
        meta: {
            researcher: true,
        },
        children: [{
            path: "",
            name: "Researches",
            component: () =>
                import ("../views/Researches.vue"),
            meta: {
                title: "Researches",
                drawer: true
            }
        }, {
            path: "add",
            component: () =>
                import ("../views/AddResearch.vue"),
            meta: {
                title: "Add research"
            }
        }]
    },
    {
        path: "/areas",
        component: emptyRouteView,
        meta: {
            researcher: true,
        },
        children: [{
                path: "",
                name: "Areas",
                component: () =>
                    import ("../views/Areas.vue"),
                meta: {
                    title: "Areas",
                    drawer: true
                },
            },
            {
                path: "add",
                component: () =>
                    import ("../views/AddArea.vue"),
                meta: {
                    title: "Areas",
                }
            }
        ]
    },
    {
        path: "/users",
        name: "Users",
        component: () =>
            import ("../views/Users.vue"),
        meta: {
            researcher: true,
            title: "Users",
            drawer: true
        },
    },
    {
        path: "/logout",
        name: "Logout",
        component: () =>
            import ("../views/Logout.vue")
    },
    {
        path: "/account",
        name: "Account",
        component: () =>
            import ("../views/Account.vue")
    },
    {
        path: "*",
        redirect: "/",
        name: "Landing",
        component: () =>
            import ("../views/Landing.vue"),
    },
];