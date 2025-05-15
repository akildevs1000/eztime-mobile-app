<template>
  <div class="pa-3" style="display: flex; justify-content: space-between; justify-items: center">
    <div>Upcoming Holiday</div>
    <div>
      <b>{{ item?.name }}</b>
      <v-icon class="ml-1" small color="success">mdi-arrow-up</v-icon>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      item: null,
      loading: true,
    };
  },

  computed: {
    isDarkMode() {
      return this.$isDark();
    },
  },

  watch: {
    isDarkMode() {},
  },

  methods: {},

  async mounted() {
    try {
      this.item = await this.$axios.$get("/upcoming-holiday?company_id=43");
      this.loading = false;
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }
  },
};
</script>
