<template>
  <v-main>
    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="storeName"
        label="Nombre de la Tienda"
        required
      ></v-text-field>
      <v-textarea v-model="additionalInfo" auto-grow filled label="Descripción">
      </v-textarea>
      <v-text-field
        v-model="city"
        label="Ciudad"
        required
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
      ></v-autocomplete>
    </v-form>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    descriptionLimit: 60,
    additionalInfo: "",
    currency: "",
    currencySearch: "",
    city: "",
    storeName: "",
    entries: [],
    isLoading: false,
    location: null,
    search: null,
    autocomplete: null,
  }),

  methods: {
    changed() {
      let place = this.autocomplete.getPlace();
      this.city = place.formatted_address;
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.moneda.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "");
      const textTwo = item.codigo_iso.toLocaleLowerCase();
      const searchText = queryText.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "");
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
  },
  computed: {
    ...mapGetters({
      currencies: "currencies/currencies",
    }),
    fields() {
      if (!this.location) return [];

      return Object.keys(this.location).map((key) => {
        return {
          key,
          value: this.location[key] || "n/a",
        };
      });
    },
    items() {
      return this.entries.map((entry) => {
        const Description =
          entry.description.length > this.descriptionLimit
            ? entry.description.slice(0, this.descriptionLimit) + "..."
            : entry.description;

        return Object.assign({}, entry, { Description });
      });
    },
  },
  mounted() {
    const options = {
      types: ["(cities)"],
    };
    let input = document.getElementById("autocomplete");
    this.autocomplete = new google.maps.places.Autocomplete(input, options);
    this.autocomplete.addListener("place_changed", this.changed);
  },
};
</script>
