<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-text-field
        v-model="storeDetails.storeName"
        label="Nombre de la Tienda"
        required
        :error-messages="invalidStoreName"
        @blur="$v.storeDetails.storeName.$touch()"
        @change="updateDomain()"
      >
      </v-text-field>
      <v-text-field
        v-model="storeDetails.storeDomain"
        label="Pagina Web"
        prepend-icon="mdi-clipboard"
        @click:prepend="doCopy()"
        :error-messages="invalidStoreDomain"
        @blur="$v.storeDetails.storeDomain.$touch()"
        prefix="https://"
        suffix=".web.tienda"
      ></v-text-field>
      <v-textarea
        v-model="storeDetails.description"
        auto-grow
        filled
        label="Descripción"
        :error-messages="invalidDescription"
        @blur="$v.storeDetails.description.$touch()"
      >
      </v-textarea>
      <v-text-field
        v-model="storeDetails.city"
        label="Ciudad"
        :error-messages="invalidCity"
        @blur="$v.storeDetails.city.$touch()"
        @change="changed()"
        id="autocomplete"
      ></v-text-field>
      <v-autocomplete
        v-model="storeDetails.currency"
        :items="currencies"
        :filter="customFilter"
        color="white"
        hide-no-data
        hide-selected
        item-text="moneda"
        item-value="codigo_iso"
        label="Moneda"
        placeholder="Buscar"
        return-object
        :error-messages="invalidCurrencyCode"
        @blur="$v.storeDetails.currency.$touch()"
      ></v-autocomplete>
      <v-btn class="mr-4 mb-2 mt-2" @click="cancelUpdate"> Cancelar </v-btn>
      <v-btn class="mb-2 mt-2" :disabled="!isValidForm" @click="saveStore">
        Guardar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GeneralTab",
  mixins: [validationMixin],
  data: () => ({
    currencySearch: "",
    cityAutocomplete: null,
    storeDetails: {
      description: "",
      currency: null,
      storeName: "",
      storeDomain: "",
      city: "",
    },
    baseStoreDetails: {
      description: "",
      currency: null,
      storeName: "",
      storeDomain: "",
      city: "",
    },
    storeDomainExists: false,
  }),
  validations: {
    storeDetails: {
      storeName: {
        required,
        minLength: minLength(4),
      },
      storeDomain: {
        required,
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(140),
      },
      city: {
        required,
      },
      currency: {
        moneda: {
          required,
        },
        codigo_iso: {
          required,
        },
      },
    },
  },
  watch: {
    activeStore() {
      this.storeDetails = Object.assign({}, this.activeStore);
    },
    async storeUrl() {
      //search if exists in DB
      const similarStores = await this.$fire.firestore
        .collection("stores")
        .where("storeDomain", "==", this.storeDetails.storeDomain)
        .limit(1)
        .get();
      if (
        similarStores.docs.length > 0 &&
        (!this.activeStore ||
          this.activeStore.storeDomain !== this.storeDetails.storeDomain)
      ) {
        this.storeDomainExists = true;
      } else {
        this.storeDomainExists = false;
      }
    },
  },
  methods: {
    ...mapActions({ addStore: "addStore", updateStore: "updateStore" }),
    changed() {
      let place = this.cityAutocomplete.getPlace();
      this.storeDetails.city =
        place === undefined ? null : place.formatted_address;
    },
    cancelUpdate() {
      if (this.activeStore === null) {
        this.storeDetails = Object.assign({}, this.baseStoreDetails);
      } else {
        this.storeDetails = Object.assign({}, this.activeStore);
      }
      this.$v.$reset();
    },
    saveStore() {
      let promise = null;
      if (this.activeStore === null) {
        promise = this.addStore(this.storeDetails);
      } else {
        promise = this.updateStore(this.storeDetails);
      }
      promise.then(() => {
        this.$notify({
          type: "success",
          text: "Operacion Existosa",
          group: "notifications",
        });
      });
    },
    async doCopy() {
      if (this.storeUrl !== "") {
        await this.$copyText(this.storeUrl);
        this.$notify({
          type: "info",
          text: "Enlace Copiado Existosamente",
          group: "notifications",
        });
      }
    },
    async updateDomain() {
      if (this.activeStore === null) {
        this.storeDetails.storeDomain = this.storeDetails.storeName
          .replace(/[^a-z0-9 -]/gi, "")
          .trim()
          .replace(/\s+/g, "-")
          .toLocaleLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
      }
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.moneda
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      const textTwo = item.codigo_iso.toLocaleLowerCase();
      const searchText = queryText
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
  },
  computed: {
    ...mapGetters({
      currencies: "currencies/currencies",
      activeStore: "activeStore",
      user: "user",
    }),
    isValidForm() {
      return (
        !this.$v.storeDetails.storeName.$invalid &&
        !this.$v.storeDetails.description.$invalid &&
        !this.$v.storeDetails.currency.$invalid &&
        !this.$v.storeDetails.city.$invalid &&
        !this.$v.storeDetails.storeDomain.$invalid &&
        !this.$v.storeDomainExists
      );
    },
    storeUrl() {
      return this.storeDetails.storeDomain !== "" &&
        !this.$v.storeDetails.storeName.$error
        ? "https://" + this.storeDetails.storeDomain + ".web.tienda"
        : "";
    },
    invalidStoreName() {
      if (this.$v.storeDetails.storeName.$error) {
        return "El nombre de la tienda debe tener al menos 4 letras";
      }
      return "";
    },
    invalidStoreDomain() {
      if (this.$v.storeDetails.storeDomain.$error) {
        return "Solo debe contener letras, numeros o un guion.";
      } else if (this.storeDomainExists) {
        return "El nombre de pagina ya existe";
      }
      return "";
    },
    invalidCurrencyCode() {
      if (this.$v.storeDetails.currency.codigo_iso.$error) {
        return "Debe seleccionar una moneda";
      }
      return "";
    },
    invalidCity() {
      if (this.$v.storeDetails.city.$error) {
        return "Debe seleccionar una ciudad";
      }
      return "";
    },
    invalidDescription() {
      if (this.$v.storeDetails.description.$error) {
        return "La descripción debe tener entre 10 y 140 letras.";
      }
      return "";
    },
  },
  mounted() {
    const options = {
      types: ["(cities)"],
    };
    let input = document.getElementById("autocomplete");
    this.cityAutocomplete = new google.maps.places.Autocomplete(input, options);
    this.cityAutocomplete.addListener("place_changed", this.changed);
  },
};
</script>
