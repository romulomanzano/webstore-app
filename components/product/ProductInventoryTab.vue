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
              @save="save"
              @cancel="cancel"
              @close="close"
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
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.stock="props">
            <v-edit-dialog
              :return-value.sync="props.item.stock"
              @save="save"
              @cancel="cancel"
              @close="close"
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
              @close="close"
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
                  autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="removeOption(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>

        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
          {{ snackText }}

          <template v-slot:action="{ attrs }">
            <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
          </template>
        </v-snackbar>
      </template>
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
    },
    baseProductDetails: {
      hasVariations: null,
      variations: [],
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
    productDetails() {
      if (this.productDetails.hasVariations !== true) {
        this.productDetails.variations = []
      }
    }

  },
  methods: {
    ...mapActions({ updateProduct: "updateProduct" }),
    addOption() {
      this.productDetails.variations.push(Object.assign({}, this.baseOption));
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
