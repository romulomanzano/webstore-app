<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <notifications group="alerts" position="top" />
        <template>
          <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
              <v-card-title class="text-h5"> Eliminar producto? </v-card-title>
              <v-card-text
                >Una vez eliminado, no podras recibir mas pedidos por el
                producto.</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="cancelDelete()">
                  Cancelar
                </v-btn>
                <v-btn color="green darken-1" text @click="deleteProduct()">
                  Confirmar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <v-data-table
          :headers="headers"
          :items="products"
          class="elevation-1"
          @click:row="editProductPage"
          :disable-sort="true"
          :footer-props="{
            'items-per-page-text': 'Productos por pagina',
          }"
        >
          <template v-slot:item.description="{ item }">
            <div>
              {{ item.description.substring(0, 20) + "..." }}
            </div>
          </template>
          <template v-slot:item.price="{ item }">
            <div>
              {{ item.price | currency(activeStore?.currency.simbolo, 0) }}
            </div>
          </template>
          <template v-slot:item.hide="{ item }">
            <div>
              {{ item.hide !== true ? "Si" : "No" }}
            </div>
          </template>
          <template v-slot:item.stock="{ item }">
            <div>
              {{
                item.inventory?.hasVariations
                  ? getAggregateStock(item.inventory?.variations)
                  : item.inventory?.uniqueStock
              }}
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click.stop="editProductPage(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click.stop="setDelete(item)"> mdi-delete </v-icon>
          </template>

          <template v-slot:top>
            <template>
              <v-btn
                color="primary"
                class="ma-2"
                @click="$router.push({ path: '/catalogo/producto' })"
                :disabled="disableAdding"
              >
                Añadir Producto
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
  data: () => ({
    dialog: false,
    pendingProduct: null,
  }),
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
          text: "Stock",
          align: "right",
          value: "stock",
        },
        {
          text: "Visible",
          value: "hide",
        },
        {
          text: "Acciones",
          value: "actions",
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
    setDelete(item) {
      this.dialog = true;
      this.pendingProduct = item;
    },
    cancelDelete(item) {
      this.dialog = false;
      this.pendingProduct = null;
    },
    getAggregateStock(a) {
      var total = 0;
      for (var i in a) {
        total += parseInt(a[i].stock);
      }
      return total;
    },
    deleteProduct() {
      this.$fire.firestore
        .collection("stores")
        .doc(this.activeStore.id)
        .collection("products")
        .doc(this.pendingProduct.id)
        .delete();
      this.dialog = false;
      this.pendingProduct = null;
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
