<template>
  <div>
    <v-app>
      <v-main>
        <v-container class="pa-0 layout-container" fluid>
          <v-row justify="center" class="mt-12 mb-8">
            <!--  <v-img src="/logo.jpg" max-width="100" max-height="100"> </v-img>  -->
          </v-row>
          <v-main>
            <v-container>
              <Nuxt />
            </v-container>
          </v-main>
        </v-container>
      </v-main>
      <v-footer app>
        <Footer></Footer>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";

export default {
  middleware: "unauthenticated",
  components: { Footer },
  data() {
    return {
      title: "App",
    };
  },
};
</script>
