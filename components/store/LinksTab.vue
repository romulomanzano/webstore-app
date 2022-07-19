<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-text-field
        v-model="storeDetails.instagram"
        label="Instagram"
        :error-messages="invalidInstagram"
        @blur="$v.storeDetails.instagram.$touch()"
        prepend-icon="mdi-instagram"
      >
      </v-text-field>
      <v-text-field
        v-model="storeDetails.facebook"
        label="Facebook"
        :error-messages="invalidFacebook"
        @blur="$v.storeDetails.facebook.$touch()"
        prepend-icon="mdi-facebook"
      >
      </v-text-field>
      <v-text-field
        v-model="storeDetails.twitter"
        label="Twitter"
        :error-messages="invalidTwitter"
        @blur="$v.storeDetails.twitter.$touch()"
        prepend-icon="mdi-twitter"
      >
      </v-text-field>
      <v-text-field
        v-model="storeDetails.linkedIn"
        label="LinkedIn"
        :error-messages="invalidLinkedIn"
        @blur="$v.storeDetails.linkedIn.$touch()"
        prepend-icon="mdi-linkedin"
      >
      </v-text-field>
      <v-text-field
        v-model="storeDetails.tiktok"
        label="TikTok"
        :error-messages="invalidTiktok"
        @blur="$v.storeDetails.tiktok.$touch()"
        prepend-icon="mdi-tiktok"
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
import { url } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "LinksTab",
  mixins: [validationMixin],
  data: () => ({
    storeDetails: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedIn: "",
      tiktok: "",
    },
    basestoreDetails: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedIn: "",
      tiktok: "",
    },
  }),
  validations: {
    storeDetails: {
      instagram: {
        url,
      },
      twitter: {
        url,
      },
      facebook: {
        url,
      },
      linkedIn: {
        url,
      },
      tiktok: {
        url,
      },
    },
  },
  watch: {
    activeStore() {
      this.resetLinks();
    },
  },
  methods: {
    ...mapActions({ updateStore: "updateStore" }),
    resetLinks() {
      if (this.activeStore.socialLinks === undefined) {
        this.storeDetails = Object.assign({}, this.baseStoreDetails);
      } else {
        this.storeDetails = Object.assign({}, this.activeStore.socialLinks);
      }
    },
    cancelUpdate() {
      this.resetLinks();
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
      return (
        !this.$v.storeDetails.instagram.$invalid &&
        !this.$v.storeDetails.facebook.$invalid &&
        !this.$v.storeDetails.twitter.$invalid &&
        !this.$v.storeDetails.tiktok.$invalid &&
        !this.$v.storeDetails.linkedIn.$invalid
      );
    },
    invalidInstagram() {
      if (this.$v.storeDetails.instagram.$error) {
        return "Enlace invalido";
      }
      return "";
    },
    invalidFacebook() {
      if (this.$v.storeDetails.facebook.$error) {
        return "Enlace invalido";
      }
      return "";
    },
    invalidTwitter() {
      if (this.$v.storeDetails.twitter.$error) {
        return "Enlace invalido";
      }
      return "";
    },
    invalidTiktok() {
      if (this.$v.storeDetails.tiktok.$error) {
        return "Enlace invalido";
      }
      return "";
    },
    invalidLinkedIn() {
      if (this.$v.storeDetails.linkedIn.$error) {
        return "Enlace invalido";
      }
      return "";
    },
  },
  mounted() {
    this.resetLinks();
  },
};
</script>
