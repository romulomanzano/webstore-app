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
        <h4 class="ma-2 font-weight-medium">Preferencia</h4>
        <v-radio
          v-for="n in hasVariationsOptions"
          :key="n.value"
          :label="n.label"
          :value="n.value"
        >
        </v-radio>
      </v-radio-group>
      <h4 class="ma-2 mt-4 font-weight-medium">Variantes del Producto</h4>
      <v-list>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item> </v-list-item>

          <v-list-item v-for="child in item.items" :key="child.key">
            <v-list-item-content>
              <v-card outlined rounded elevation="2" class="pa-2">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="child.title"
                      filled
                      label="Opcion"
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="child.stock"
                      filled
                      label="# disponibles"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="child.additionalCost"
                      filled
                      label="Costo adicional"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn
                    text
                    color="primary"
                    @click="removeOption(item, child)"
                  >
                    Eliminar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="primary"
              @click="addOption(item)"
            >
              <v-icon dark> mdi-plus </v-icon>
            </v-btn>
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
        items: [{ title: "List Item", key: "f", additionalCost: 3, stock: 2 }],
        title: "Attractions",
      },
      {
        active: true,
        items: [
          {
            title: "Breakfast & brunch",
            key: "f2",
            additionalCost: 3,
            stock: 2,
          },
          { title: "New American", key: "f1", additionalCost: 3, stock: 2 },
          { title: "Sushi", key: "f", additionalCost: 3, stock: 2 },
        ],
        title: "Dining",
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
    addOption(item) {
      item.items.push({ key: "awesome", title: "" });
    },
    removeOption(item, option) {
      item.items = item.items.filter(function (ele) {
        return ele != option;
      });
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
