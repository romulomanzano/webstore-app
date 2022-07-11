<template>
  <v-main>
    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="storeName"
        label="Store Name"
        required
      ></v-text-field>
      <v-textarea v-model="additionalInfo" auto-grow filled label="Info">
      </v-textarea>
      <v-text-field
        v-model="locationName"
        label="Location"
        required
        id="autocomplete"
      ></v-text-field>
      <v-autocomplete
        v-model="location"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="API"
        label="Location"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
        return-object
      ></v-autocomplete>
    </v-form>
  </v-main>
</template>

<script>

export default {
  data: () => ({
    descriptionLimit: 60,
    additionalInfo: "",
    locationName: "",
    storeName: "",
    entries: [],
    isLoading: false,
    location: null,
    search: null,
  }),

  computed: {
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

    const input = document.getElementById("autocomplete");
    new google.maps.places.Autocomplete(input, options);
  },
};
</script>
