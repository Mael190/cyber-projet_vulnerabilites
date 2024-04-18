<template>
  <h1 class="logo">EPSI Drive</h1>
      <div class="container">
        <div class="card">
        <h2>Inscription</h2>
          <form class="form" @submit.prevent="signUp">
            <div class="input-group">
              <label class="label">Nom</label>
              <input v-model="form.lastname" autocomplete="off" name="lastname" id="lastname" class="input" type="text">
            </div>
            <div class="input-group">
              <label class="label">Prénom</label>
              <input v-model="form.firstname" autocomplete="off" name="firstname" id="firstname" class="input" type="text">
            </div>
            <div class="input-group">
              <label class="label">Adresse mail</label>
              <input v-model="form.email" autocomplete="off" name="email" id="email" class="input" type="email">
            </div>
            <div class="input-group">
              <label class="label">Mot de passe</label>
              <input v-model="form.password" autocomplete="off" name="password" id="password" class="input" type="password">
            </div>
            <input class="input-submit" type="submit" value="S'inscrire">
          </form>
      </div>
    </div> 
</template>
<script>

export default {
  data() {
    return {
      form: {
        lastname: '',
        firstname: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signUp() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        headers: myHeaders,
        method: "POST",
        body: JSON.stringify(this.form),
      };
      const response = await fetch("http://localhost:3000/signup", requestOptions);
      const result = await response.json();
      localStorage.setItem("token", result.token);
      this.$router.push('/home');
    }
  }
}

</script>

