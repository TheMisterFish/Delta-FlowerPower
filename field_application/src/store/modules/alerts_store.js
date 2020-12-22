import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var timeout;

const alerts_store = {
    state: {
        alert_active: false,
        alert_text: null
    },
    mutations: {
        alert(state, payload) {
            state.alert_text = payload.alert_text
            if(state.alert_active){
                state.alert_active = false;
            }
            state.alert_active = true;
            timeout = setTimeout(() => {
                state.alert_active = false;
            }, 1000);
        },
    },
    actions: {
        alert({
            commit
        }, payload) {
            commit("alert", payload);
        },
        api_response({
            commit
        }, payload) {
            var error = {
                alert_text: "Netwerk error"
            };
            if (payload.err) {
                error = {
                    alert_text: "Error code: " + payload.err.status
                };
                switch (payload.err.status) {
                    case 304:
                        error.alert_text = "Er is niets veranderd";
                        break;
                    case 417:
                        error.alert_text = "Je taak is opgeslagen, maar niet bij iedereen geupdate";
                        break;
                    case 500:
                        if (payload.err.data) {
                            error.alert_text = payload.err.data[0];
                        }
                        break;
                    case 200:
                        if (payload.err.data) {
                            error.alert_text = payload.err.data[0];
                        }
                        break;
                    case 403:
                        error.alert_text = "Je hebt de bevoegdheid niet om deze actie uit te voeren.";
                        break;
                    case 401:
                        error.alert_text = "Je moet inloggen voor deze actie.";
                        break;
                    default:
                        if (payload.err.data.error) {
                            error.alert_text = payload.err.data.error;
                        } else {
                            error.alert_text = "Er is iets fouts gegaan, sorry voor het ongemak.";
                        }
                }
            }
            commit("alert", error);

        },
    },
    getters: {
        hasAlert: state => state.alert_active,
        alertText: state => state.alert_text
    },
};

export default alerts_store;