<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-text-field
        v-model="storeDetails.whatsapp"
        label="Whatsapp"
        :error-messages="invalidWhatsapp"
        @blur="$v.storeDetails.whatsapp.$touch()"
        prepend-icon="mdi-whatsapp"
      >
      </v-text-field>
      <v-btn class="mr-4 mb-2 mt-2" @click="cancelUpdate"> Cancelar </v-btn>
      <v-btn class="mb-2 mt-2" :disabled="!isValidForm" @click="saveStore">
        Guardar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { helpers } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

const phoneValidator = (value) =>
  helpers.regex(value, /^\+?\d{0,3}[\(\- ]?\d{3}\)?[\- ]?\d{3,4}[\- ]?\d{4}/);

export default {
  name: "ContactTab",
  mixins: [validationMixin],
  data: () => ({
    storeDetails: {
      whatsapp: "",
    },
    basestoreDetails: {
      whatsapp: "",
    },
  }),
  validations: {
    storeDetails: {
      whatsapp: {
        phoneValidator,
      },
    },
  },
  watch: {
    activeStore() {
      this.resetSettings();
    },
  },
  methods: {
    ...mapActions({ updateStore: "updateStore" }),
    resetSettings() {
      if (this.activeStore.contactSettings === undefined) {
        this.storeDetails = Object.assign({}, this.baseStoreDetails);
      } else {
        this.storeDetails = Object.assign({}, this.activeStore.contactSettings);
      }
    },
    cancelUpdate() {
      this.resetSettings();
      this.$v.$reset();
    },
    saveStore() {
      let data = { socialLinks: Object.assign({}, this.storeDetails) };
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
    }),
    isValidForm() {
      return !this.$v.storeDetails.whatsapp.$invalid;
    },
    invalidWhatsapp() {
      if (this.$v.storeDetails.whatsapp.$error) {
        return "Numero invalido";
      }
      return "";
    },
  },
  mounted() {
    this.resetSettings();
  },
};
</script>
