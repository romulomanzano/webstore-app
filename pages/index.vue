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
    head() {
        return {
        script: [
            {
            src:
                'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'
            }
        ],
        },
    },
  data: () => ({
    descriptionLimit: 60,
    additionalInfo: "",
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

  watch: {
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      this.$axios
        .get(
          "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
            val +
            "&language=es&types=%28cities%29&key=" +
            process.env.GOOGLE_API_KEY,
          { headers: { "Access-Control-Allow-Origin": "*" } }
        )
        .then((res) => {
          this.entries = res.data.predictions;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
