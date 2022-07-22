<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-file-input
        :rules="logoRules"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="Pick an avatar"
        prepend-icon="mdi-camera"
        label="Logo"
        v-model="storeDetails.logo"
      ></v-file-input>
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

export default {
  name: "BrandTab",
  mixins: [validationMixin],
  data: () => ({
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
