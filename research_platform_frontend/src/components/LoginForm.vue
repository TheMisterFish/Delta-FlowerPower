<template>
  <form id="login-form" @submit.prevent="login">
    <h1 class="title">Flower Power</h1>
    <Input v-model="email" label="E-mail" />
    <Input v-model="password" label="Password" type="password" />
    <button
      v-if="validateLoginForm()"
      class="submit submit-valid"
      type="submit"
    >
      Inloggen
    </button>
    <button disabled v-else class="submit submit-invalid" type="submit">
      Voer uw gegevens in
    </button>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

import Input from "@/components/Input.vue";

export default Vue.extend({
  name: "LoginForm",
  data: function() {
    return {
      email: "",
      password: "",
    };
  },
  components: {
    Input,
  },
  methods: {
    validateLoginForm(): boolean {
      return Boolean(this.email && this.password);
    },

    login(): void {
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch("login", { email, password })
        .then(() => this.$router.push("/"))
        .catch((error) => console.log(error));
    },
  },
});
</script>

<style scoped>
#login-form {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 400px;

  background-color: white;

  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.2);
}

#login-form .title {
  color: var(--primary-color);
  margin: 40px 0px;
}

#login-form .submit {
  margin-top: 25px;
  border: none;
  padding: 0px;
  width: 100%;
  height: 75px;
  font-size: 1.2rem;
  font-family: inherit;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
}

#login-form .submit-valid {
  background-color: var(--primary-color);
}

#login-form .submit-valid:hover {
  cursor: pointer;
}

#login-form .submit-invalid {
  background-color: #e0c280;
}
</style>
