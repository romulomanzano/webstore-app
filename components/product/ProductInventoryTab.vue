<template>
  <div>
    <v-form class="ma-4 mb-4" ref="form" lazy-validation>
      <v-radio-group
        v-model="productDetails.hasVariations"
        @blur="$v.productDetails.hasVariations.$touch()"
        hint="Elegir si el producto viene en distintas presentaciones (variantes).
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
          v-for="category in categories"
          :key="category.title"
          v-model="category.active"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="category.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <div>
            <v-data-table
              :headers="headers"
              :items="desserts"
              :disable-sort="true"
            >
              <template v-slot:item.name="props">
                <v-edit-dialog
                  :return-value.sync="props.item.name"
                  @save="save"
                  @cancel="cancel"
                  @open="open"
                  @close="close"
                >
                  {{ props.item.name }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.name"
                      label="Editar"
                      single-line
                      counter
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:item.stock="props">
                <v-edit-dialog
                  :return-value.sync="props.item.stock"
                  @save="save"
                  @cancel="cancel"
                  @open="open"
                  @close="close"
                >
                  <div>{{ props.item.stock }}</div>
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.stock"
                      label="Editar"
                      single-line
                      counter
                      autofocus
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:item.addOnCost="props">
                <v-edit-dialog
                  :return-value.sync="props.item.addOnCost"
                  @save="save"
                  @cancel="cancel"
                  @open="open"
                  @close="close"
                >
                  <div>{{ props.item.addOnCost }}</div>
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.addOnCost"
                      label="Editar"
                      single-line
                      counter
                      autofocus
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
            </v-data-table>

            <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
              {{ snackText }}

              <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" text @click="snack = false">
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </div>
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
    snack: false,
    snackColor: "",
    snackText: "",
    max25chars: (v) => v.length <= 25 || "Input too long!",
    pagination: {},
    headers: [
      {
        text: "Opcion",
        align: "start",
        value: "name",
      },
      { text: "Stock", value: "stock" },
      { text: "Costo Adicional", value: "addOnCost" },
    ],
    desserts: [
      {
        name: "Frozen Yogurt",
        stock: 159,
        addOnCost: 4.0,
      },
      {
        name: "Ice cream sandwich",
        stock: 237,
        addOnCost: 4.3,
      },
    ],
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
    categories: [
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
    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      console.log("Dialog closed");
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
