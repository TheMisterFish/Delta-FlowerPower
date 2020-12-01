import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                background: "#e6e6e6",
                primary: '#567a58', //updated
                secondary: '#424242',
                accent: '#3f6340', //updated
                error: '#bd7777', //updated
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#e0c280' //updated
            },
        },
    },
});