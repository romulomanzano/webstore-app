<template>
  <v-main>
    <v-row class="justify-center"
      ><notifications group="notifications" position="top"
    /></v-row>
    <template v-if="ready">
      <v-tabs
        background-color="primary"
        v-model="tab"
        center-active
        show-arrows
        dark
      >
        <v-tab>General</v-tab>
        <v-tab>Fotos</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <product-general-tab></product-general-tab>
        </v-tab-item>
        <v-tab-item>
          <product-images-tab></product-images-tab>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import ProductGeneralTab from "@/components/product/ProductGeneralTab";
import ProductImagesTab from "@/components/product/ProductImagesTab";

export default {
  name: "producto",
  components: { ProductGeneralTab, ProductImagesTab },
  data: () => ({
    tab: 0,
    ready: false,
  }),
  computed: {
    ...mapGetters({
      activeStore: "activeStore",
    }),
  },
  methods: {
    async handleBinding() {
      if (this.activeStore !== null) {
        if (this.$route.params.id) {
          this.$store
            .dispatch("bindActiveProductDocument", {
              id: this.$route.params.id,
            })
            .then((this.ready = true));
        } else {
          this.$store
            .dispatch("unbindActiveProductDocument")
            .then((this.ready = true));
        }
      }
    },
  },
  watch: {
    activeStore() {
      this.handleBinding();
    },
  },
  mounted() {
    if (this.activeStore !== null) {
      this.handleBinding();
    }
  },
};
</script>
