<template>
  <v-main>
    <v-container>
      <v-layout>
        <v-cols>
          <v-row><notifications group="notifications" position="top" /></v-row>
          <template v-if="ready">
            <v-col>
              <v-row>
                <h1>Codigo QR</h1>
                <v-spacer></v-spacer>
              </v-row>
              <v-row class="mb-4">
                <body-1
                  >Descarga tu codigo QR y compartelo con tus clientes!</body-1
                >
                <v-spacer></v-spacer>
              </v-row>
              <v-row>
                <QrcodeVue
                  id="qrcode"
                  class="mx-2"
                  :value="storeUrl"
                  :size="160"
                  render-as="canvas"
                  level="M"
                  margin="2"
                  background="#ffffff"
                />
              </v-row>
              <v-row>
                <v-btn class="mx-2" @click="download()" small color="primary">
                  <v-icon dark> mdi-download </v-icon>
                  Descargar
                </v-btn>
              </v-row>
            </v-col>
          </template>
        </v-cols>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import QrcodeVue from "qrcode.vue";

export default {
  name: "qr-code-tab",
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
      return domain;
    },
  },
  methods: {
    download() {
      let qrcode = document.getElementById("qrcode");
      let canvasImage = qrcode
        .getElementsByTagName("canvas")[0]
        .toDataURL("image/png");
      let xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = function () {
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = "qrcode.png";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open("GET", canvasImage);
      xhr.send();
      this.$notify({
        type: "success",
        text: "Descarga Existosa",
        group: "notifications",
      });
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
