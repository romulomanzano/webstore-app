<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <notifications group="alerts" position="top" />
        <v-data-table
          :headers="headers"
          :items="products"
          class="elevation-1"
          @click:row="editProductPage"
        >
          <template v-slot:item.price="{ item }">
            <div>
              {{ item.price | currency(activeStore?.currency.simbolo, 0) }}
            </div>
          </template>
          <template v-slot:item.hide="{ item }">
            <div>
              {{ item.hide ? "No" : "Si" }}
            </div>
          </template>

          <template v-slot:top>
            <template>
              <v-btn
                color="primary"
                class="mb-2"
                @click="$router.push({ path: '/catalogo/producto' })"
                :disabled="disableAdding"
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
import { mapGetters } from "vuex";

export default {
  name: "catalogo",
  data: () => ({}),
  computed: {
    ...mapGetters({
      products: "products",
      activeStore: "activeStore",
    }),
    disableAdding() {
      return this.products.lenght >= 10;
    },
    headers() {
      return [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "Description",
          align: "right",
          value: "description",
        },
        {
          text: "Precio",
          align: "right",
          value: "price",
        },
        {
          text: "Visible",
          align: "right",
          value: "hide",
        },
      ];
    },
  },
  methods: {
    editProductPage(value) {
      this.$router.push({ path: "/catalogo/producto/" + value.id });
    },
    async handleBinding() {
      if (this.activeStore !== null) {
        this.$store.dispatch("bindProductsCollection");
      }
    },
  },
  watch: {
    activeStore() {
      this.handleBinding();
    },
  },
  mounted() {
    this.handleBinding();
  },
};
</script>
