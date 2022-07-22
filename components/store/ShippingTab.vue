<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-checkbox v-model="storeDetails.storePickup" label="Buscar en Tienda" />
      <v-checkbox
        v-model="storeDetails.shippingAllowed"
        label="Se hacen envios"
      />
      <v-radio-group
        v-if="storeDetails.shippingAllowed"
        v-model="storeDetails.shippingMethod"
        :disabled="!storeDetails.shippingAllowed"
      >
        <v-radio
          v-for="n in shippingMethod"
          :key="n.value"
          :label="n.label"
          :value="n.value"
        >
        </v-radio>
      </v-radio-group>
      <v-text-field
        v-if="storeDetails.shippingMethod === 'fixedCost'"
        label="Costo de Envio"
        v-model="storeDetails.shippingFee"
        :prefix="activeStore.currency.simbolo"
        @blur="$v.storeDetails.shippingFee.$touch()"
        :error-messages="invalidShippingFee"
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
import { requiredIf, numeric } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";

export default {
  name: "ShippingTab",
  mixins: [validationMixin],
  data: () => ({
    storeDetails: {
      storePickup: false,
      shippingAllowed: false,
      shippingMethod: null,
      shippingFee: null,
    },
    basestoreDetails: {
      storePickup: false,
      shippingAllowed: false,
      shippingMethod: null,
      shippingFee: null,
    },
    shippingMethod: [
      { label: "Gratis", value: "free" },
      { label: "Costo Fijo", value: "fixedCost" },
      { label: "A coordinar con el cliente", value: "toBeDetermined" },
    ],
  }),
  validations: {
    storeDetails: {
      shippingFee: {
        numeric,
        required: requiredIf(function () {
          return this.storeDetails.shippingMethod === "fixedCost";
        }),
      },
    },
  },
  watch: {
    activeStore() {
      this.resetSettings();
    },
    shippingAllowedVal() {
      if (!this.storeDetails.shippingAllowed) {
        this.storeDetails.shippingMethod = null;
      }
    },
    shippingMethodVal() {
      if (this.storeDetails.shippingMethod !== "fixedCost") {
        this.storeDetails.shippingFee = null;
      }
    },
  },
  methods: {
    ...mapActions({ updateStore: "updateStore" }),
    resetSettings() {
      if (this.activeStore.shippingSettings === undefined) {
        this.storeDetails = Object.assign({}, this.baseStoreDetails);
      } else {
        this.storeDetails = Object.assign(
          {},
          this.activeStore.shippingSettings
        );
      }
    },
    cancelUpdate() {
      this.resetSettings();
    },
    saveStore() {
      let data = { shippingSettings: Object.assign({}, this.storeDetails) };
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
        !(
          this.storeDetails.shippingMethod === null &&
          this.storeDetails.shippingAllowed
        ) && !this.$v.storeDetails.shippingFee.$invalid
      );
    },
    invalidShippingFee() {
      if (this.$v.storeDetails.shippingFee.$error) {
        return "Debes introducir un numero valido";
      }
      return "";
    },
    shippingAllowedVal() {
      return this.storeDetails.shippingAllowed;
    },
    shippingMethodVal() {
      return this.storeDetails.shippingMethod;
    },
  },
  mounted() {
    this.resetSettings();
  },
};
</script>
