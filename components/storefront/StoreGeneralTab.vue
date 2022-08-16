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
        <v-col v-for="card in cards" :key="card.title" :cols="card.flex">
          <v-card>
            <v-carousel height="200px">
              <v-carousel-item
                v-for="(item, i) in card.items"
                :key="i"
                :src="item.src"
                reverse-transition="fade-transition"
                transition="fade-transition"
              >
                <v-card-title
                  v-text="card.title"
                  class="white--text align-end"
                ></v-card-title>
              </v-carousel-item>
            </v-carousel>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({
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
};
</script>
