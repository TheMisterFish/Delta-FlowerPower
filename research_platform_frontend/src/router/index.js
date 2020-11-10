import Vue from "vue";
import VueRouter from "vue-router";
import { decodeJWT, isAuthenticated } from "./auth.js";
import { routes } from './routes.js'
import store from '../store/index.js'

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.params.title) {
        store.state.title.title = to.params.title;
    }

    store.state.authentication.isAuthenticated = isAuthenticated();

    if (isAuthenticated()) {
        store.state.authentication.user = decodeJWT();
    }

    if (to.name === "Landing" && isAuthenticated()) {
        next({
            name: "Dashboard"
        });
    }

    if (to.matched.some((record) => record.meta.researcher)) {
        if (isAuthenticated()) {
            next();
        } else {
            next({
                name: "Landing"
            });
        }
    } else {
        next();
    }
});

export default router;