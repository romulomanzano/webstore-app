<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-text-field
        label="Correo"
        :value="user.email"
        readonly
        :disabled="true"
        prepend-icon="mdi-at"
      >
      </v-text-field>
      <v-text-field
        v-model="storeDetails.whatsapp"
        label="Whatsapp"
        :error-messages="invalidWhatsapp"
        @blur="$v.storeDetails.whatsapp.$touch()"
        prepend-icon="mdi-whatsapp"
        hint="Utiliza el simbolo +, seguido por codigo de pais, y numero. Ejemplo: +18887775555"
        persistent-hint
        class="mb-2"
        required
      >
      </v-text-field>
      <v-radio-group
        v-model="storeDetails.orderChannel"
        @blur="$v.storeDetails.orderChannel.$touch()"
        :error-messages="invalidOrderChannel"
      >
        <h4 class="ma-2 font-weight-medium">Opciones de Orden</h4>
        <p class="mt-2 mb-4 font-weight-light">
          Elegir si recibir ordenes via chat en vivo, o via notificaciones al
          correo electronico o WhatsApp
        </p>
        <v-radio
          v-for="n in orderOptions"
          :key="n.value"
          :label="n.label"
          :value="n.value"
        >
        </v-radio>
      </v-radio-group>
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

const phoneValidator = helpers.regex(
  "phoneValidator",
  /^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/
);

export default {
  name: "ContactTab",
  mixins: [validationMixin],
  data: () => ({
    storeDetails: {
      whatsapp: "",
      orderChannel: "",
    },
    basestoreDetails: {
      whatsapp: "",
      orderChannel: "",
    },
    orderOptions: [
      { label: "Chat via WhatsApp", value: "liveChatWhatsapp" },
      { label: "Notificacion via WhatsApp", value: "notificationWhatsapp" },
      { label: "Notificacion via Email", value: "notificationEmail" },
    ],
  }),
  validations: {
    storeDetails: {
      whatsapp: {
        phoneValidator,
        required,
      },
      orderChannel: {
        required,
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
      let data = { contactSettings: Object.assign({}, this.storeDetails) };
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
      return (
        !this.$v.storeDetails.whatsapp.$invalid &&
        !this.$v.storeDetails.orderChannel.$invalid
      );
    },
    invalidWhatsapp() {
      if (this.$v.storeDetails.whatsapp.$error) {
        return "Numero invalido";
      }
      return "";
    },
    invalidOrderChannel() {
      if (this.$v.storeDetails.orderChannel.$error) {
        return "Requerido";
      }
      return "";
    },
  },
  mounted() {
    this.resetSettings();
  },
};
</script>
