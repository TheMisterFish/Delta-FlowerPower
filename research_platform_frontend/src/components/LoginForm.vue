<template>
  <form id="login-form">
    <h1 class="title">Flower Power</h1>
    <div class="input">
      <input id="email" v-model="username" type="text" placeholder="" />
      <label for="email">E-mail</label>
      <fieldset>
        <legend><span></span></legend>
      </fieldset>
    </div>
    <div class="input">
      <input id="password" v-model="password" type="password" placeholder="" />
      <label for="password">Wachtwoord</label>
      <fieldset>
        <legend><span></span></legend>
      </fieldset>
    </div>
    <button class="submit" type="submit">INLOGGEN</button>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

export default {
  name: "LoginForm",
};
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

#login-form .input {
  position: relative;

  display: flex;
  align-items: center;
  margin-bottom: 25px;

  width: 70%;
}

#login-form .input input {
  border: none;
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-family: inherit;
  color: rgb(50, 50, 50);
  outline: none;
}

#login-form .input label {
  z-index: 1;
  position: absolute;
  transform: translate(10px, 0px);
  padding: 0px 5px;
  background-color: white;
  color: rgb(50, 50, 50);

  transition: transform 0.15s ease-in-out, font-size 0.15s ease-in-out;
}

#login-form .input label {
  pointer-events: none;
}

#login-form .input:focus-within label,
#login-form .input input:not(:placeholder-shown) + label {
  transform: translate(10px, -24px);
  font-size: 0.75rem;
}

#login-form .input fieldset {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  border: 1px solid rgb(150, 150, 150);
  border-radius: 5px;

  margin: 0px;

  pointer-events: none;
}

#login-form .input fieldset legend {
  padding: 0px;
}

#login-form .input:hover fieldset {
  border-color: rgb(80, 80, 80);
}

#login-form .input:focus-within fieldset {
  border: 2px solid var(--primary-color);
}

#login-form .submit {
  margin-top: 25px;
  border: none;
  width: 100%;
  height: 75px;
  /* background-color: #e0c280; */
  background-color: var(--primary-color);
  font-size: 1.3rem;
  font-family: inherit;
  color: white;
  letter-spacing: 0.2rem;
}
</style>
