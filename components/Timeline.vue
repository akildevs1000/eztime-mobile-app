<template>
   <v-timeline dense clipped>
      <v-timeline-item
        class="mb-4"
        color="grey"
        icon-color="grey lighten-2"
        small
      >
        <v-row justify="space-between">
          <v-col cols="12"> This order was archived. </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item
        class="mb-4"
        color="green"
        icon-color="green"
        small
      >
        <v-row justify="space-between">
          <v-col cols="12"> This order was archived. </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item class="mb-4"  color="orange"  small>
        <v-row justify="space-between">
          <v-col cols="12">
            Digital Downloads fulfilled 1 item.
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item class="mb-4"  small>
        <v-row justify="space-between">
          <v-col cols="12">
            Digital Downloads fulfilled 1 item.
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item class="mb-4" color="pink" small>
        <v-row justify="space-between">
          <v-col cols="12">
            Order confirmation email was  
          </v-col>
        </v-row>
      </v-timeline-item>

   

      <v-timeline-item class="mb-4" color="grey" small>
        <v-row justify="space-between">
          <v-col cols="12">
            A $15.00 USD payment was 
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
</template>
<script>
export default {
  data: () => ({
    events: [],
    input: null,
    nonce: 0,
  }),

  computed: {
    timeline() {
      return this.events.slice().reverse();
    },
  },

  methods: {
    comment() {
      const time = new Date().toTimeString();
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time: time.replace(
          /:\d{2}\sGMT-\d{4}\s\((.*)\)/,
          (match, contents, offset) => {
            return ` ${contents
              .split(" ")
              .map((v) => v.charAt(0))
              .join("")}`;
          }
        ),
      });

      this.input = null;
    },
  },
};
</script>
