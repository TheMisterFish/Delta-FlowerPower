<template>
  <div id="landing">
    <v-form id="login-form">
      <h1 class="text-h4">Flower Power</h1>
      <v-text-field
        class="input"
        v-model="email"
        label="Email"
        required
      ></v-text-field>
      <v-text-field
        class="input"
        type="password"
        v-model="password"
        label="Password"
        required
      ></v-text-field>
      <button
        @click.prevent="login"
        v-if="validLoginForm"
        class="submit submit-valid"
        type="submit"
      >
        Inloggen
      </button>
      <button disabled v-else class="submit submit-invalid" type="submit">
        Voer uw gegevens in
      </button>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data: () => ({
    email: "",
    password: "",
  }),
  methods: {
    login() {
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch("login", { email, password })
        .then(() => {
          this.$store.dispatch("hideSnackbar");
          this.$router.push("dashboard");
        })
        .catch(() => {
          this.$store.dispatch(
            "showSnackbar",
            "Onjuist e-mailadres of wachtwoord"
          );
        });
    },
  },
  computed: {
    validLoginForm() {
      return this.email && this.password;
    },
  },
};
</script>

<style scoped>
#landing {
  display: grid;
  place-items: center;
  height: 100vh;

  background-image: linear-gradient(
      to top left,
      rgba(13, 59, 14, 0.8),
      50%,
      rgba(147, 245, 149, 0.4) 100%
    ),
    url("../assets/landing_background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

#landing #login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.2);
  background-color: white;
}

#landing #login-form h1 {
  margin: 25px 0px;
}

#landing #login-form .input {
  width: 55%;
}

#landing #login-form .submit {
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

#landing #login-form .submit-valid {
  background-color: var(--primary-color);
}

#landing #login-form .submit-valid:hover {
  cursor: pointer;
}

#landing #login-form .submit-invalid {
  background-color: #e0c280;
}
</style>
