<template>
  <div>
    <div id="map" style="height: 100vh"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      geocoder: null,
      infowindow: null,
      locations: [],
      initialLatLon: [],
    };
  },
  mounted() {
    this.plotLocations();
    this.loadGoogleMapsScript(this.initMap);

    setInterval(this.plotLocations, 60 * 1000);
  },
  methods: {
    loadGoogleMapsScript(callback) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA1gRWcOb3kuzIvykjNeJ8ezm4l5YCpJFw`;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", callback);
      document.head.appendChild(script);
    },

    async plotLocations() {
      let employee = this.$auth.user.employee;
      this.UserID = employee.system_user_id;
      await this.$axios
        .get(
          `/realtime_location?company_id=${this.$auth.user.company_id}&UserID=${this.UserID}`
        )
        .then(({ data }) => {
          let first = data.data[0];
          this.initialLatLon = [first.latitude, first.longitude];

          data.data.forEach(({ latitude, longitude, datetime }) => {
            const marker = new google.maps.Marker({
              position: {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude),
              },
              map: this.map,
            });

            marker.addListener("click", () => {
              this.geocoder
                .geocode({
                  location: {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                  },
                })
                .then((response) => {
                  if (response.results[0]) {
                    this.infowindow.setContent(datetime);
                    this.infowindow.open(map, marker);
                  } else {
                    window.alert("No results found");
                  }
                })
                .catch((e) => window.alert("Geocoder failed due to: " + e));
            });

            // Add click event for markers here if needed
          });
        })
        .catch((error) => {
          console.error("Error fetching data from the API:", error);
        });
    },
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: 25.276987, lng: 55.296249 },
      });
      this.geocoder = new google.maps.Geocoder();
      this.infowindow = new google.maps.InfoWindow();
    },
  },
};
</script>
