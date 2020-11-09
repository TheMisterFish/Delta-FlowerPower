import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                background: "#e3e3e3",
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