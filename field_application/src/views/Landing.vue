<template>
        <div id="landing">
                <LoginForm />
        </div>
</template>

<script>
import Vue from "vue";

import LoginForm from "../components/LoginForm.vue";

export default Vue.extend({
        name: "landing",
        components: {
                LoginForm,
        },
});
</script>

<style scoped>
#landing {
        display: grid;
        place-items: center;

        height: 100vh;
        
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
}
</style>
