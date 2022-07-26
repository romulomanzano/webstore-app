<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-text-field
        v-model="productDetails.productName"
        label="Nombre del Producto"
        required
        :error-messages="invalidProductName"
        @blur="$v.productDetails.productName.$touch()"
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
      <v-btn class="mr-4 mb-2 mt-2" @click="cancelUpdate"> Cancelar </v-btn>
      <v-btn class="mb-2 mt-2" :disabled="!isValidForm" @click="saveProduct">
        Guardar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GeneralTab",
  mixins: [validationMixin],
  data: () => ({
    productDetails: {
      description: "",
      productName: "",
    },
    baseProductDetails: {
      description: "",
      productName: "",
    },
  }),
  validations: {
    productDetails: {
      productName: {
        required,
        minLength: minLength(4),
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(140),
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
      activeStore: "activeStore",
      user: "user",
    }),
    isValidForm() {
      return (
        !this.$v.productDetails.productName.$invalid &&
        !this.$v.productDetails.description.$invalid
      );
    },
    invalidProductName() {
      if (this.$v.productDetails.productName.$error) {
        return "El nombre de la tienda debe tener al menos 4 letras";
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
