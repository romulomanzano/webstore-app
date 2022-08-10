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
      <template v-if="!productDetails.hasVariations">
        <h4 class="ma-2 mt-4 font-weight-medium">Stock del Producto</h4>
        <v-text-field
          v-model="productDetails.uniqueStock"
          label="Stock"
          :error-messages="invalidStock"
          @blur="$v.productDetails.uniqueStock.$touch()"
        >
        </v-text-field>
      </template>
      <template v-if="productDetails.hasVariations">
        <h4 class="ma-2 mt-4 font-weight-medium">Variantes del Producto</h4>
        <v-data-table
          :headers="headers"
          :items="productDetails.variations"
          :disable-sort="true"
        >
          <template v-slot:top>
            <v-col class="mb-4">
              <template>
                <v-btn
                  color="primary"
                  x-small
                  :right="true"
                  absolute
                  fab
                  @click="addOption()"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-col>
          </template>
          <template v-slot:item.name="props">
            <v-edit-dialog
              :return-value.sync="props.item.name"
              large
              save-text="OK"
              cancel-text="Cancelar"
            >
              {{ props.item.name }}
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.name"
                  label="Editar"
                  single-line
                  counter
                  @blur="$v.productDetails.variations.$touch()"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.stock="props">
            <v-edit-dialog
              :return-value.sync="props.item.stock"
              large
              save-text="OK"
              cancel-text="Cancelar"
            >
              <div>{{ props.item.stock }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.stock"
                  label="Editar"
                  single-line
                  counter
                  @blur="$v.productDetails.variations.$touch()"
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.addOnCost="props">
            <v-edit-dialog
              :return-value.sync="props.item.addOnCost"
              large
              save-text="OK"
              cancel-text="Cancelar"
            >
              <div>{{ props.item.addOnCost }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.addOnCost"
                  label="Editar"
                  single-line
                  counter
                  @blur="$v.productDetails.variations.$touch()"
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="removeOption(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </template>

      <v-alert
        v-if="
          this.$v.productDetails.variations.$error &&
          this.productDetails.variations.length > 0
        "
        type="error"
        >{{ invalidVariations }}</v-alert
      >
      <div class="mt-4 mb-2">
        <v-btn class="mr-4" @click="cancelUpdate"> Cancelar </v-btn>
        <v-btn :disabled="!isValidForm" @click="saveProduct"> Guardar </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {
  required,
  requiredIf,
  minLength,
  numeric,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

const mustBePositive = (value) => value >= 0;

export default {
  name: "ProductInventoryTab",
  mixins: [validationMixin],
  data: () => ({
    pagination: {},
    baseOption: {
      name: "-",
      stock: 0,
      addOnCost: 0,
    },
    headers: [
      {
        text: "Opcion",
        align: "start",
        value: "name",
      },
      { text: "Stock", value: "stock" },
      { text: "Costo Adicional", value: "addOnCost" },
      { text: "Acciones", value: "actions" },
    ],
    productDetails: {
      hasVariations: null,
      variations: [],
      uniqueStock: null,
    },
    baseProductDetails: {
      hasVariations: null,
      variations: [],
      uniqueStock: null,
    },
    hasVariationsOptions: [
      { value: false, label: "No, presentación única" },
      { value: true, label: "Sí, tiene variantes" },
    ],
  }),
  validations: {
    productDetails: {
      hasVariations: {
        required,
      },
      uniqueStock: {
        required: requiredIf(function () {
          return this.productDetails.hasVariations === false;
        }),
        mustBePositive,
      },
      variations: {
        required: requiredIf(function () {
          return this.productDetails.hasVariations === true;
        }),
        $each: {
          name: {
            required,
            minLength: minLength(2),
          },
          name: {
            required,
            minLength: minLength(2),
          },
          stock: {
            required,
            numeric,
            mustBePositive,
          },
          addOnCost: {
            required,
            numeric,
            mustBePositive,
          },
        },
      },
    },
  },
  watch: {
    activeProduct() {
      this.resetInventory();
    },
    hasVariationsBoolean() {
      if (this.productDetails.hasVariations !== true) {
        this.productDetails.variations = [];
      } else {
        this.productDetails.uniqueStock = null;
        this.$v.$reset();
      }
    },
  },
  methods: {
    ...mapActions({ updateProduct: "updateProduct" }),
    addOption() {
      this.productDetails.variations.push(Object.assign({}, this.baseOption));
      this.$v.productDetails.variations.$touch();
    },
    resetInventory() {
      if (this.activeProduct?.inventory === undefined) {
        this.productDetails = Object.assign({}, this.baseProductDetails);
      } else {
        this.productDetails = Object.assign({}, this.activeProduct.inventory);
      }
    },
    removeOption(option) {
      this.productDetails.variations = this.productDetails.variations.filter(
        function (ele) {
          return ele != option;
        }
      );
      this.$v.productDetails.variations.$touch();
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
    hasVariationsBoolean() {
      return this.productDetails.hasVariations;
    },
    isValidForm() {
      return (
        !this.$v.productDetails.hasVariations.$invalid &&
        !this.$v.productDetails.variations.$invalid &&
        !this.$v.productDetails.uniqueStock.$invalid
      );
    },
    invalidStock() {
      if (this.$v.productDetails.uniqueStock.$error) {
        return "El stock debe ser un numero positivo";
      }
      return "";
    },

    invalidVariations() {
      if (
        this.$v.productDetails.variations.$error &&
        this.productDetails.variations.length > 0
      ) {
        return "La variante debe tener al menos 2 letras, y numeros positivos en stock y costos.";
      }
      return "";
    },
  },
  mounted() {
    this.resetInventory();
  },
};
</script>
