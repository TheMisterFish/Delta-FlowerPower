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
                title: "Add research",
                action: true
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
                name: "areas",
                component: () =>
                    import ("../views/Areas.vue"),
                meta: {
                    title: "Areas",
                    drawer: true
                },
            },
            {
                path: ":id",
                name: "areas/:id",
                component: () =>
                    import ("../views/Area.vue"),
                meta: {
                    title: "Areas",
                },
            },
            {
                path: "add",
                name: "areas/add",
                component: () =>
                    import ("../views/AddArea.vue"),
                meta: {
                    title: "Add area",
                    action: true
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