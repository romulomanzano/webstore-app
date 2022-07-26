<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <notifications group="alerts" position="top" />
        <v-data-table :headers="headers" :items="products" class="elevation-1">
          <template v-slot:top>
            <template>
              <v-btn
                color="primary"
                class="mb-2"
                @click="$router.push({ path: '/catalogo/producto' })"
              >
                Add Product
              </v-btn>
            </template>
          </template>
        </v-data-table>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "catalogo",
  data: () => ({}),
  computed: {
    ...mapGetters({
      products: "products",
    }),
    headers() {
      return [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "productName",
        },
        {
          text: "Description",
          align: "right",
          value: "description",
        },
      ];
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("bindProductsCollection");
    } catch (e) {
      console.error(e);
    }
  },
};
</script>
