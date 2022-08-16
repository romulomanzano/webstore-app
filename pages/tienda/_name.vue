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
          <store-general-tab></store-general-tab>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-main>
</template>

<script>
import StoreGeneralTab from "@/components/storefront/StoreGeneralTab";
//import StoreContactTab from "@/components/storefront/StoreContactTab";

export default {
  layout: "topsite",
  name: "tienda",
  components: { StoreGeneralTab },
  data: () => ({
    tab: 0,
    ready: false,
  }),
  computed: {},
  methods: {},
  mounted() {
    this.ready = true;
  },
};
</script>
