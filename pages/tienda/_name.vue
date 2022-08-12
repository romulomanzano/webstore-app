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
        <v-tab>Productos</v-tab>
        <v-tab :disabled="true">Contacto</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <store-general-tab></store-general-tab>
        </v-tab-item>
        <v-tab-item>
          <store-contact-tab></store-contact-tab>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import StoreGeneralTab from "@/components/store/StoreGeneralTab";
import StoreContactTab from "@/components/store/StoreContactTab";

export default {
  name: "tienda",
  components: { StoreGeneralTab, StoreContactTab },
  data: () => ({
    tab: 0,
    ready: false,
  }),
  computed: {
    ...mapGetters({
      storeFront: "storeFront",
    }),
  },
  methods: {},
  mounted() {
    if (this.$route.params.id) {
      this.$store
        .dispatch("bindStoreFront", {
          id: this.$route.params.name,
        })
        .then((this.ready = true));
    } else {
      console.log("redirect!");
    }
  },
};
</script>
