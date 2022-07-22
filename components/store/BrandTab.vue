<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-img
        :max-height="128"
        :max-width="128"
        :src="storeDetails.logoResized?.dataUrl"
      ></v-img>
      <image-uploader
        @input="setImage"
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
        @onComplete="info"
      >
      </image-uploader>
      <v-btn class="mr-4 mb-2 mt-2" @click="cancelUpdate"> Cancelar </v-btn>
      <v-btn class="mb-2 mt-2" :disabled="!isValidForm" @click="saveStore">
        Guardar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { helpers, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";
import ImageUploader from "vue-image-upload-resize";

export default {
  name: "BrandTab",
  mixins: [validationMixin],
  components: { ImageUploader },
  data: () => ({
    hasImage: false,
    storeDetails: {
      logo: null,
      logoResized: null,
    },
    basestoreDetails: {
      logo: null,
      logoResized: null,
    },
    logoRules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!",
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
      this.storeDetails.logoResized = file;
    },
    resetSettings() {
      if (this.activeStore.brandSettings === undefined) {
        this.storeDetails = Object.assign({}, this.baseStoreDetails);
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
    info() {
      console.log(this.storeDetails.logoResized);
    },
  },
  computed: {
    ...mapGetters({
      activeStore: "activeStore",
      user: "user",
    }),
    isValidForm() {
      return true;
    },
  },
  mounted() {
    this.resetSettings();
  },
};
</script>
