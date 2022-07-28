<template>
  <div>
    <v-form class="ma-4 mb-4" ref="form" lazy-validation>
      <v-radio-group
        v-model="productDetails.hasVariations"
        @blur="$v.productDetails.hasVariations.$touch()"
        hint="Elegir si el producto viene en distintas presentaciones (variaciones).
          Por ejemplo, talla, color, tamaño, etc."
        persistent-hint
      >
        <h4 class="ma-2 font-weight-medium">Variantes del Producto</h4>
        <v-radio
          v-for="n in hasVariationsOptions"
          :key="n.value"
          :label="n.label"
          :value="n.value"
        >
        </v-radio>
      </v-radio-group>
      <v-list>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in item.items" :key="child.title">
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <div class="mt-4 mb-2">
        <v-btn class="mr-4" @click="cancelUpdate"> Cancelar </v-btn>
        <v-btn :disabled="!isValidForm" @click="saveProduct"> Guardar </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { required, requiredIf } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

const mustBePositive = (value) => value >= 0;

export default {
  name: "ProductInventoryTab",
  mixins: [validationMixin],
  data: () => ({
    productDetails: {
      hasVariations: null,
      variations: null,
    },
    baseProductDetails: {
      hasVariations: null,
      variations: null,
    },
    hasVariationsOptions: [
      { value: false, label: "No, presentación única" },
      { value: true, label: "Sí, tiene variantes" },
    ],
    items: [
      {
        action: "mdi-ticket",
        items: [{ title: "List Item" }],
        title: "Attractions",
      },
      {
        action: "mdi-silverware-fork-knife",
        active: true,
        items: [
          { title: "Breakfast & brunch" },
          { title: "New American" },
          { title: "Sushi" },
        ],
        title: "Dining",
      },
      {
        action: "mdi-school",
        items: [{ title: "List Item" }],
        title: "Education",
      },
      {
        action: "mdi-human-male-female-child",
        items: [{ title: "List Item" }],
        title: "Family",
      },
      {
        action: "mdi-bottle-tonic-plus",
        items: [{ title: "List Item" }],
        title: "Health",
      },
      {
        action: "mdi-briefcase",
        items: [{ title: "List Item" }],
        title: "Office",
      },
      {
        action: "mdi-tag",
        items: [{ title: "List Item" }],
        title: "Promotions",
      },
    ],
  }),
  validations: {
    productDetails: {
      hasVariations: {
        required,
      },
      variations: {
        required: requiredIf(function () {
          return this.productDetails.hasVariations === true;
        }),
      },
    },
  },
  watch: {
    activeProduct() {
      this.resetInventory();
    },
  },
  methods: {
    ...mapActions({ updateProduct: "updateProduct" }),
    resetInventory() {
      if (this.activeProduct === null) {
        this.productDetails = Object.assign({}, this.baseProductDetails);
      } else {
        this.productDetails = Object.assign({}, this.activeProduct.inventory);
      }
    },
    cancelUpdate() {
      this.resetInventory();
      this.$v.$reset();
    },
    saveProduct() {
      this.updateProduct({ inventory: this.productDetails }).then(() => {
        this.$notify({
          type: "success",
          text: "Operacion Existosa",
          group: "notifications",
        });
      });
    },
  },
  computed: {
    ...mapGetters({
      activeProduct: "activeProduct",
      user: "user",
      activeStore: "activeStore",
    }),
    isValidForm() {
      return !this.$v.productDetails.hasVariations.$invalid;
    },
  },
  mounted() {
    this.resetInventory();
  },
};
</script>
