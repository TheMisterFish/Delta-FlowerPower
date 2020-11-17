import Vue from 'vue'
import App from './App.vue'
import router from './router'
import zeropc from 'zeropc';

const zeropc_client = zeropc;

Vue.config.productionTip = false

let client = new zeropc_client.Client()

client.connect("tcp://127.0.0.1:4242")

client.invoke("echo", "server ready", (error, res) => {
  if(error || res !== 'server ready') {
    console.error(error)
  } else {
    console.log("server is ready")
  }
})

client.invoke("calc", 1, (error, res) => {
  if(error) {
    console.error(error)
  } else {
    console.log("res:");
    console.log(res);
  }
});

new Vue({
  router,
  client,
  render: h => h(App)
}).$mount('#app')
