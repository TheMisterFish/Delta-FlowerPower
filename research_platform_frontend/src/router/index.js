import Vue from "vue";
import VueRouter from "vue-router";
import { decodeJWT, isAuthenticated } from "./auth.js";
import { routes } from './routes.js'
import store from '../store/index.js'
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueRouter);

Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyBc2Pf6i6qNU934cChcEozdBmyFaIvwjSA",
        libraries: "drawing"
    }
});

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
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