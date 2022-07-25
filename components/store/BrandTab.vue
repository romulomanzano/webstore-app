<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <h3>Logo</h3>
      <template>
        <v-row align="end" v-show="storeDetails.logo !== null">
          <v-img
            class="mt-4"
            :max-height="128"
            :max-width="128"
            :src="storeDetails.logo?.dataUrl"
          />
          <v-icon color="white" @click="storeDetails.logo = null">
            mdi-delete
          </v-icon>
        </v-row>
        <vuetify-image-uploader
          @input="setImage"
          :label="imgLabel"
          :debug="1"
          :maxWidth="128"
          :maxHeight="128"
          :quality="0.9"
          :autoRotate="true"
          outputFormat="verbose"
          :preview="false"
          :className="['fileinput', { 'fileinput--loaded': hasImage }]"
          :capture="true"
          accept="image/*"
          doNotResize="['gif', 'svg']"
          class="mt-4"
        >
        </vuetify-image-uploader>
      </template>
      <h3 class="mt-4">Color Principal</h3>
      <v-color-picker
        v-model="storeDetails.primaryColor"
        hide-canvas
        mode="hexa"
        hide-mode-switch
      ></v-color-picker>
      <h3 class="mt-4">Color Secundario</h3>
      <v-color-picker
        v-model="storeDetails.secondaryColor"
        hide-canvas
        mode="hexa"
        hide-mode-switch
      ></v-color-picker>
      <v-btn class="mr-4 mb-2 mt-2" @click="cancelUpdate"> Cancelar </v-btn>
      <v-btn class="mb-2 mt-2" :disabled="!isValidForm" @click="saveStore">
        Guardar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VuetifyImageUploader from "@/components/VuetifyImageUploader";

export default {
  name: "BrandTab",
  components: { VuetifyImageUploader },
  data: () => ({
    hasImage: false,
    storeDetails: {
      logo: null,
      primayColor: null,
      secondaryColor: null,
    },
    logoRules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "El archivo debe tener un tamaño menor de 2 MB!",
    ],
  }),
  watch: {
    activeStore() {
      this.resetSettings();
    },
  },
  methods: {
    ...mapActions({ updateStore: "updateStore" }),
    setImage: function (file) {
      this.hasImage = true;
      this.storeDetails.logo = file;
      this.storeDetails.logo.info.modifiedDate = null; //needed to avoid upload errors
    },
    resetSettings() {
      if (this.activeStore.brandSettings === undefined) {
        const settings = {
          logo: null,
          primaryColor: this.$vuetify.theme.themes.dark.primary,
          secondaryColor: this.$vuetify.theme.themes.dark.secondary,
        };
        this.storeDetails = Object.assign({}, settings);
      } else {
        this.storeDetails = Object.assign({}, this.activeStore.brandSettings);
      }
    },
    cancelUpdate() {
      this.resetSettings();
    },
    saveStore() {
      let data = { brandSettings: Object.assign({}, this.storeDetails) };
      this.updateStore(data).then(() => {
        this.$notify({
          type: "success",
          text: "Operacion Existosa",
          group: "notifications",
        });
      });
    },
  },
  computed: {
    ...mapGetters({
      activeStore: "activeStore",
      user: "user",
    }),
    imgLabel() {
      return this.storeDetails.logo === null ? 'Subir logo' : 'Reemplazar logo'
    },
    isValidForm() {
      return true;
    },
  },
  mounted() {
    this.resetSettings();
  },
};
</script>
