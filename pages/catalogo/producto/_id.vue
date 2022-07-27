<template>
  <v-main>
    <v-row class="justify-center"
      ><notifications group="notifications" position="top"
    /></v-row>
    <v-tabs
      background-color="primary"
      v-model="tab"
      center-active
      show-arrows
      dark
    >
      <v-tab>General</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <product-general-tab></product-general-tab>
      </v-tab-item>
    </v-tabs-items>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import ProductGeneralTab from "@/components/product/ProductGeneralTab";

export default {
  name: "producto",
  components: { ProductGeneralTab },
  data: () => ({
    tab: 0,
  }),
  computed: {
    ...mapGetters({
      activeStore: "activeStore",
    }),
  },
  mounted() {
    if (this.$route.params.id) {
      this.$store
        .dispatch("bindActiveProductDocument", { id: this.$route.params.id })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.$store.dispatch("unbindActiveProductDocument").catch((err) => {
        console.error(err);
      });
    }
  },
};
</script>
