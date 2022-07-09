<template>
  <div>
    <span>Copyright &copy; {{ new Date().getFullYear() }} App Labs, LLC</span>
    <a
      href="#"
      class="ml-2"
      v-for="locale in availableLocales"
      :key="locale.code"
      @click.prevent.stop="setLocale(locale.code)"
      >{{ locale.name }}</a
    >
  </div>
</template>
<script>
export default {
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
  },
  methods: {
    setLocale(code) {
      this.$i18n.setLocale(code);
    },
  },
};
</script>
