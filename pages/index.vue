<template>
  <v-main>
    <v-form ref="form" lazy-validation>
      <v-row class="justify-center"
        ><notifications group="notifications" position="top"
      /></v-row>

      <v-text-field
        v-model="storeName"
        label="Nombre de la Tienda"
        required
        :error-messages="invalidStoreName"
        @blur="$v.storeName.$touch()"
        @change="updateDomain()"
      >
      </v-text-field>
      <v-text-field
        :value="storeDomain"
        label="Pagina Web"
        readonly
        prepend-icon="mdi-clipboard"
        @click:prepend="doCopy()"
        :error-messages="invalidStoreDomain"
        @blur="$v.storeDomain.$touch()"
        prefix="https://"
        suffix=".web.tienda"
      ></v-text-field>
      <v-textarea
        v-model="description"
        auto-grow
        filled
        label="Descripción"
        :error-messages="invalidDescription"
        @blur="$v.description.$touch()"
      >
      </v-textarea>
      <v-text-field
        v-model="city"
        label="Ciudad"
        :error-messages="invalidCity"
        @blur="$v.city.$touch()"
        @change="changed()"
        id="autocomplete"
      ></v-text-field>
      <v-autocomplete
        v-model="currency"
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
        @blur="$v.currency.$touch()"
      ></v-autocomplete>
    </v-form>
  </v-main>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters } from "vuex";

export default {
  mixins: [validationMixin],
  data: () => ({
    description: "",
    currency: null,
    currencySearch: "",
    city: "",
    storeName: "",
    cityAutocomplete: null,
    storeDomain: "",
    storeDomainExists: false,
  }),
  validations: {
    storeName: {
      required,
      minLength: minLength(4),
    },
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
  methods: {
    changed() {
      let place = this.cityAutocomplete.getPlace();
      this.city = place === undefined ? null : place.formatted_address;
    },
    async doCopy() {
      console.log("here");
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
      this.storeDomain = this.storeName
        .replace(/[^a-z0-9 -]/gi, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

      //search if exists in DB
      const similarStores = await this.$fire.firestore
        .collection("stores")
        .where("storeDomain", "==", this.storeDomain)
        .limit(1)
        .get();
      if (similarStores.docs.length > 0) {
        this.storeDomainExists = true;
      } else {
        this.storeDomainExists = false;
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
    saveStore() {},
  },
  computed: {
    ...mapGetters({
      currencies: "currencies/currencies",
    }),
    storeUrl() {
      return this.storeDomain !== "" && !this.$v.storeName.$error
        ? "https://" + this.storeDomain + ".web.tienda"
        : "";
    },
    invalidStoreName() {
      if (this.$v.storeName.$error) {
        return "El nombre de la tienda debe tener al menos 4 letras";
      }
      return "";
    },
    invalidStoreDomain() {
      if (this.$v.storeDomain.$error) {
        return "Solo debe contener letras, numeros o un guion.";
      } else if (this.storeDomainExists) {
        return "El nombre de pagina ya existe";
      }
      return "";
    },
    invalidCurrencyCode() {
      if (this.$v.currency.codigo_iso.$error) {
        return "Debe seleccionar una moneda";
      }
      return "";
    },
    invalidCity() {
      if (this.$v.city.$error) {
        return "Debe seleccionar una ciudad";
      }
      return "";
    },
    invalidDescription() {
      if (this.$v.description.$error) {
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
