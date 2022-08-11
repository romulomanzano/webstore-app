<template>
  <v-main>
    <v-row class="justify-center"
      ><notifications group="notifications" position="top"
    /></v-row>
    <template v-if="ready">
      <QrcodeVue
        :value="storeUrl"
        :size="160"
        render-as="canvas"
        level="M"
        margin="2"
        background="#ffffff"
      />
    </template>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import QrcodeVue from "qrcode.vue";

export default {
  name: "sharing",
  components: { QrcodeVue },
  data: () => ({ ready: false }),
  computed: {
    ...mapGetters({
      activeStore: "activeStore",
    }),
    storeUrl() {
      const domain =
        this.activeStore.storeDomain !== null &&
        this.activeStore.storeDomain !== undefined
          ? "https://" + this.activeStore.storeDomain + ".tienda.app"
          : "";
      console.log(domain);
      return domain;
    },
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
