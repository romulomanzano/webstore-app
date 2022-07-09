<i18n>
{
  "en": {
    "login" : "Login"
  },
  "es": {
    "login": "Iniciar Sesión"
  }
}
</i18n>

<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <notifications group="auth" position="top" />
        <v-flex xs12 sm12 md5>
          <v-card class="elevation-12">
            <v-card-text>
              <section>
                <v-row align="center" justify="space-around" class="mt-6 mb-6">
                  <v-btn
                    @click="signIn"
                    color="google"
                    class="mb-5 white--text"
                  >
                    <v-icon left> mdi-google </v-icon>
                    {{ $t("login") }}
                  </v-btn>
                </v-row>
              </section>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  layout: "login",
  name: "login",
  data: () => ({}),
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn === true) {
        this.$router.push({ path: "/" });
      }
    },
  },
  methods: {
    signIn() {
      const provider = new this.$fireModule.auth.GoogleAuthProvider();
      this.$fire.auth.signInWithPopup(provider);
    },
  },
};
</script>
