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
        <v-tab :disabled="activeStore === null">Enlaces</v-tab>
        <v-tab :disabled="activeStore === null">Contacto</v-tab>
        <v-tab :disabled="activeStore === null">Envios</v-tab>
        <v-tab :disabled="activeStore === null">Personalizacion</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <general-tab></general-tab>
        </v-tab-item>
        <v-tab-item>
          <links-tab></links-tab>
        </v-tab-item>
        <v-tab-item>
          <contact-tab></contact-tab>
        </v-tab-item>
        <v-tab-item>
          <shipping-tab></shipping-tab>
        </v-tab-item>
        <v-tab-item>
          <brand-tab></brand-tab>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import GeneralTab from "@/components/store/GeneralTab";
import LinksTab from "@/components/store/LinksTab";
import ContactTab from "@/components/store/ContactTab";
import ShippingTab from "@/components/store/ShippingTab";
import BrandTab from "@/components/store/BrandTab";

export default {
  name: "home",
  components: { GeneralTab, LinksTab, ContactTab, ShippingTab, BrandTab },
  data: () => ({
    tab: 0,
    ready: false,
  }),
  computed: {
    ...mapGetters({
      activeStore: "activeStore",
    }),
  },
  watch: {
    activeStore(value) {
      this.ready = value !== null ? true : false;
    },
  },
  mounted() {
    if (this.activeStore !== null) {
      this.ready = true;
    }
  },
};
</script>
