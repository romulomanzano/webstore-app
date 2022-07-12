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
        v-model="city"
        label="Location"
        required
        id="autocomplete"
      ></v-text-field>
    </v-form>
  </v-main>
</template>

<script>

export default {
  data: () => ({
    descriptionLimit: 60,
    additionalInfo: "",
    city: "",
    locationName: "",
    storeName: "",
    entries: [],
    isLoading: false,
    location: null,
    search: null,
    autocomplete: null,
  }),
  watch: {
    locationName() {
      console.log(this.locationName);
    },
  },
  methods: {
    changed() {
      let place = this.autocomplete.getPlace();
      console.log(place)
      this.city = place.formatted_address;
    }
  },
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
    let input = document.getElementById("autocomplete");
    this.autocomplete = new google.maps.places.Autocomplete(input, options);
    this.autocomplete.addListener('place_changed', this.changed);
  },
};
</script>
