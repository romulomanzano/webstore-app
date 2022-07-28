<template>
  <div>
    <v-form class="ma-4" ref="form" lazy-validation>
      <v-row v-for="item in images" :key="item.name" align="end">
        <v-img
          class="mt-4"
          :max-height="128"
          :max-width="128"
          :src="item.dataUrl"
        />
        <v-icon color="white" @click="removeEntry(item)"> mdi-delete </v-icon>
      </v-row>
      <template>
        <vuetify-image-uploader
          @input="setImage"
          label="Subir Foto"
          :debug="1"
          :maxWidth="1024"
          :maxHeight="1024"
          :quality="0.9"
          :autoRotate="true"
          outputFormat="verbose"
          :preview="false"
          :className="['fileinput', { 'fileinput--loaded': hasImage }]"
          :capture="true"
          accept="image/*"
          doNotResize="['gif', 'svg']"
          class="mt-4"
          :disabled="limitReached"
        >
        </vuetify-image-uploader>
      </template>
      <v-btn class="mr-4 mb-2 mt-2" @click="cancelUpdate"> Cancelar </v-btn>
      <v-btn class="mb-2 mt-2" @click="saveProduct" :disabled="limitReached">
        Guardar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProductImagesTab",
  mixins: [validationMixin],
  data: () => ({
    images: [],
    hasImage: false,
  }),
  watch: {
    activeProduct() {
      this.resetProductDetails();
    },
  },
  methods: {
    ...mapActions({ updateProduct: "updateProduct" }),
    resetProductDetails() {
      if (this.activeProduct === null) {
        this.images = [];
      } else {
        this.images =
          this.activeProduct.images !== undefined
            ? Object.assign([], this.activeProduct.images)
            : [];
      }
    },
    cancelUpdate() {
      this.resetProductDetails();
    },
    saveProduct() {
      this.updateProduct({ images: this.images }).then(() => {
        this.$notify({
          type: "success",
          text: "Operacion Existosa",
          group: "notifications",
        });
      });
    },
    setImage: function (file) {
      this.hasImage = true;
      let img = file;
      img.info.modifiedDate = null; //needed to avoid upload errors
      this.images.push(img);
    },
    removeEntry(value) {
      this.images = this.images.filter(function (ele) {
        return ele != value;
      });
    },
  },
  computed: {
    ...mapGetters({
      activeProduct: "activeProduct",
      user: "user",
      activeStore: "activeStore",
    }),
    limitReached() {
      return this.images.length >= 4;
    },
  },
  mounted() {
    this.resetProductDetails();
  },
};
</script>
