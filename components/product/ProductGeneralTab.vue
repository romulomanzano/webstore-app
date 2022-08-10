<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-text-field
        v-model="productDetails.name"
        label="Nombre del Producto"
        required
        :error-messages="invalidName"
        @blur="$v.productDetails.name.$touch()"
      >
      </v-text-field>
      <v-textarea
        v-model="productDetails.description"
        auto-grow
        filled
        label="Descripción"
        :error-messages="invalidDescription"
        @blur="$v.productDetails.description.$touch()"
      >
      </v-textarea>
      <v-text-field
        v-model="productDetails.price"
        label="Precio"
        :prefix="activeStore.currency.simbolo"
        :error-messages="invalidPrice"
        @blur="$v.productDetails.price.$touch()"
      >
      </v-text-field>
      <v-checkbox
        v-model="productDetails.hide"
        label="Ocultar Producto"
        messages="Selecciona para ocultar el producto de tu pagina."
      />
      <v-text-field
        class="mt-2"
        v-model="productDetails.sku"
        label="SKU"
        hint="Identifica tus productos internamente"
        persistent-hint
      >
      </v-text-field>
      <v-btn class="mr-4 mb-2 mt-2" @click="cancelUpdate"> Cancelar </v-btn>
      <v-btn class="mb-2 mt-2" :disabled="!isValidForm" @click="saveProduct">
        Guardar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import {
  required,
  minLength,
  maxLength,
  numeric,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

const mustBePositive = (value) => value >= 0;

export default {
  name: "ProductGeneralTab",
  mixins: [validationMixin],
  data: () => ({
    productDetails: {
      description: "",
      name: "",
      price: null,
      hide: null,
      sku: null,
    },
    baseProductDetails: {
      description: "",
      name: "",
      price: null,
      hide: null,
      sku: null,
    },
  }),
  validations: {
    productDetails: {
      name: {
        required,
        minLength: minLength(4),
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(140),
      },
      price: {
        required,
        numeric,
        mustBePositive,
      },
    },
  },
  watch: {
    activeProduct() {
      this.productDetails = Object.assign({}, this.activeProduct);
    },
  },
  methods: {
    ...mapActions({ addProduct: "addProduct", updateProduct: "updateProduct" }),
    cancelUpdate() {
      if (this.activeProduct === null) {
        this.productDetails = Object.assign({}, this.baseProductDetails);
      } else {
        this.productDetails = Object.assign({}, this.activeProduct);
      }
      this.$v.$reset();
    },
    saveProduct() {
      let promise = null;
      if (this.activeProduct === null) {
        promise = this.addProduct(this.productDetails);
      } else {
        promise = this.updateProduct(this.productDetails);
      }
      promise.then(() => {
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
      return (
        !this.$v.productDetails.name.$invalid &&
        !this.$v.productDetails.description.$invalid &&
        !this.$v.productDetails.price.$invalid
      );
    },
    invalidName() {
      if (this.$v.productDetails.name.$error) {
        return "El nombre del producto debe tener al menos 4 letras";
      }
      return "";
    },
    invalidPrice() {
      if (this.$v.productDetails.price.$error) {
        return "El precio del producto debe ser un numero positivo";
      }
      return "";
    },
    invalidDescription() {
      if (this.$v.productDetails.description.$error) {
        return "La descripción debe tener entre 10 y 140 letras.";
      }
      return "";
    },
  },
};
</script>
