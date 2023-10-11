<template>
  <div id="map-wrap" style="height: 100vh">
    <!-- Set a relative position for the container -->
    <client-only>
      <l-map
        v-if="initialLatLon && initialLatLon.length"
        :zoom="13"
        :center="initialLatLon"
        style="z-index: 1"
      >
        <l-tile-layer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <div v-for="(location, index) in locations" :key="index">
          <l-marker :lat-lng="[location.latitude, location.longitude]">
            <l-popup>
              <div>
                {{ location.datetime }}
              </div>
            </l-popup>
          </l-marker>
        </div>
      </l-map>
    </client-only>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initialLatLon: [],
      locations: [], // Initialize an empty array to store API data
    };
  },
  mounted() {
    this.plotLocations();
    setInterval(this.plotLocations, 60 * 1000);
  },
  methods: {
    plotLocations() {
      let employee = this.$auth.user.employee;
      this.UserID = employee.system_user_id;
      this.$axios
        .get(
          `/realtime_location?company_id=${this.$auth.user.company_id}&UserID=${this.UserID}`
        ) // Replace with your API endpoint
        .then(({ data }) => {
          this.locations = data.data;
          let first = data.data[0];
          this.initialLatLon = [first.latitude, first.longitude];
        })
        .catch((error) => {
          console.error("Error fetching data from the API:", error);
        });
    },
  },
};
</script>
