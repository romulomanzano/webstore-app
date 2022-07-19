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
      <v-tab :disabled="activeStore === null">Enlaces</v-tab>
      <v-tab :disabled="activeStore === null">Contacto</v-tab>
      <v-tab :disabled="activeStore === null">Envio</v-tab>
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
    </v-tabs-items>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import GeneralTab from "@/components/store/GeneralTab";
import LinksTab from "@/components/store/LinksTab";
import ContactTab from "@/components/store/ContactTab";

export default {
  components: { GeneralTab, LinksTab, ContactTab },
  data: () => ({
    tab: 0,
  }),
  computed: {
    ...mapGetters({
      activeStore: "activeStore",
    }),
  },
};
</script>
