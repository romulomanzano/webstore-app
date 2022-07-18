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
                @click="$store.dispatch('addProduct', defaultData)"
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
  name: "home",
  data: () => ({
    defaultData: {
      name: "avocado",
      amount: 42,
    },
  }),
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
          value: "name",
        },
        {
          text: "Amount",
          align: "right",
          value: "amount",
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      addProduct: "addProduct",
    }),
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
