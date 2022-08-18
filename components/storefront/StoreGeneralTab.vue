<template>
  <div>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Descubre</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="card in storeFrontProducts"
          :key="card.title"
          :cols="card.flex"
        >
          <v-card v-if="ready">
            <v-carousel height="256" width="256">
              <v-carousel-item
                v-for="(item, i) in card.images"
                :key="i"
                :src="item.dataUrl"
                reverse-transition="fade-transition"
                transition="fade-transition"
                :max-height="256"
                :max-width="256"
                :width="256"
                :height="256"
              >
              </v-carousel-item>
            </v-carousel>
            <v-card-title
              v-text="card.name"
              class="black--text align-end"
            ></v-card-title>
            <v-card-subtitle class="text-h6">{{
              card.price | currency(storeFront?.currency.simbolo, 0)
            }}</v-card-subtitle>
            <v-card-text v-text="card.description"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon @click="addToCartSheet=true">mdi-cart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon @click="doCopy(card.id)">mdi-link-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <template>
        <v-dialog v-model="dialog" height="256" width="256">
          <v-card>
            <v-carousel height="256" width="256">
              <v-carousel-item
                v-for="(item, i) in dialogCard.images"
                :key="i"
                :src="item.dataUrl"
                reverse-transition="fade-transition"
                transition="fade-transition"
                :max-height="256"
                :max-width="256"
                :width="256"
                :height="256"
              >
              </v-carousel-item>
            </v-carousel>
            <v-card-title
              v-text="dialogCard.name"
              class="black--text align-end"
            ></v-card-title>
            <v-card-subtitle class="text-h6">{{
              dialogCard.price | currency(storeFront?.currency.simbolo, 0)
            }}</v-card-subtitle>
            <v-card-text v-text="dialogCard.description"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-cart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon @click="doCopy(dialogCard.id)">mdi-link-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-bottom-sheet v-model="addToCartSheet">
          <v-sheet class="text-center" height="200px">
            <v-btn class="mt-6" text color="red" @click="addToCartSheet = !addToCartSheet">
              Cerrar
            </v-btn>
            <div class="py-3">
              This is a bottom sheet using the controlled by v-model instead of
              activator
            </div>
          </v-sheet>
        </v-bottom-sheet>
      </template>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    ready: false,
    dialog: false,
    dialogCard: {},
    addToCartSheet: false,
    cards: [
      {
        title: "Pre-fab homes",
        items: [
          { src: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
          { src: "https://cdn.vuetifyjs.com/images/cards/road.jpg" },
        ],
        flex: 6,
      },
      {
        title: "Favorite road trips",
        items: [
          { src: "https://cdn.vuetifyjs.com/images/cards/road.jpg" },
          { src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg" },
        ],
        flex: 6,
      },
      {
        title: "Best airlines",
        items: [
          { src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg" },
          { src: "https://cdn.vuetifyjs.com/images/cards/house.jpg" },
        ],
        flex: 6,
      },
    ],
  }),
  watch: {
    storeFront() {
      if (this.storeFront !== null) {
        this.ready = true;
      }
    },
  },
  computed: {
    ...mapGetters({
      storeFront: "storeFront",
      storeFrontProducts: "storeFrontProducts",
    }),
    storeUrl() {
      return "https://" + this.storeFront?.storeDomain + ".tienda.app";
    },
  },
  methods: {
    async doCopy(productId) {
      let url = this.storeUrl + "/" + productId;
      await this.$copyText(url);
      this.$notify({
        type: "info",
        text: "Enlace Copiado Existosamente",
        group: "notifications",
      });
    },
    addToCart(card) {
      this.dialogCard = Object.assign({}, card);
    },
  },
  mounted() {
    if (this.storeFront !== null) {
      this.ready = true;
    }
  },
};
</script>
