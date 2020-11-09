import Vue from "vue";
import VueRouter from "vue-router";
import { isAuthenticated } from "./auth.js";
import { routes } from './routes.js'
import store from '../store/index.js'

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    store.state.authentication.isAuthenticated = isAuthenticated();

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