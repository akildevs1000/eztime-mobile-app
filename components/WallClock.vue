<template>
  <div>
    <v-sheet> {{ currentDate }}</v-sheet>
    <v-sheet> {{ currentTime }} </v-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: "",
      currentTime: "",
    };
  },
  methods: {
    updateClock() {
      const now = new Date();
      const options = {
        weekday: "long",
        month: "short",
        day: "numeric",
      };
      this.currentDate = now.toLocaleDateString("en-US", options);
      this.currentTime = now.toLocaleTimeString();
    },
  },
  mounted() {
    this.updateClock();
    setInterval(this.updateClock, 1000); // Update every second
  },
};
</script>

<style scoped></style>
