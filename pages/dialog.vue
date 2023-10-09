<template>
  <div>
    <v-btn @click="toggleDialog">Toggle Image</v-btn>

    <transition name="slide-y-transition">
      <div class="text-center">
        <v-img
          v-if="dialog"
          src="sucess.png"
          alt="Avatar"
          height="50px"
          width="50px"
          style="display: inline-block"
        ></v-img>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    toggleDialog() {
      this.dialog = !this.dialog;
      setTimeout(() => (this.dialog = false), 2000);
    },
  },
};
</script>

<style scoped>
.slide-y-enter-active,
.slide-y-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-y-enter, .slide-y-leave-to /* .slide-y-leave-active below version 2.1.8 */ {
  transform: translateY(100%);
  opacity: 0;
}
.slide-y-leave-active {
  position: absolute;
}
</style>
