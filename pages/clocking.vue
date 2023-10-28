<template>
  <div class="text-center mt-5">
    <v-container>
      <v-sheet class="text-h4 text-center">
        {{ currentTime }}
      </v-sheet>

      <div class="text-center">{{ formattedDateTime || "Loading..." }}</div>

      <!-- <div class="text-center">formattedDateTime  EID: {{ UserID }}</div> -->

      <v-card flat>
        <v-avatar size="150" class="mt-10">
          <img :src="puching_image" alt="Avatar" @click="generateLog" />
        </v-avatar>

        <div class="text-center mt-5">
          <v-icon>mdi-map-marker-radius</v-icon
          ><span class="mx-1 pt-2">
            {{
              (locationData && locationData.display_name) ||
              "Getting location..."
            }}
            <!-- Sheikh Zayed Road (north), Sheikh Zayed Road, Trade Centre, Dubai,
            United Arab Emirates -->
          </span>
        </div>
      </v-card>
    </v-container>

    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-toolbar flat dense>
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-toolbar>

          <v-card-text>
            <p class="text-center">
              <v-img
                :src="response_image"
                alt="Avatar"
                height="50px"
                width="50px"
                style="display: inline-block"
              ></v-img>
            </p>
            <p class="text-center">
              {{ message }}
            </p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <div class="error--text" v-if="locationError">{{ locationError }}</div>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [
      { text: "LogTime", value: "LogTime" },
      { text: "Device", value: "DeviceID" },
      // { text: "location", value: "location" },
    ],
    formattedDateTime: null,
    UserID: null,
    attendanceLogs: [],
    profile_pictrue: "no-profile-image.jpg",
    puching_image: "/C-IN.png",

    response_image: "/sucess.png",

    uniqueDeviceId: null,
    device_id: null,
    isButtonDisabled: false,
    message: "",
    response: "",
    shift_type_id: "",
    logsCount: null,

    disableCheckInButton: false,
    disableCheckOutButton: true,

    currentTime: "",
    formattedDateTime: "",
    dialog: false,
    nextPunchAllowed: true,
    coordinates: {},

    locationError: null,
    company_id: 0,
    intervalId: 0,

    log_type: "in",
  }),
  async mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },

  computed: {
    locationData() {
      return this.$store.state.locationData;
    },
    latitude() {
      return this.$store.state.latitude;
    },
    longitude() {
      return this.$store.state.longitude;
    },
    currentDate() {
      return this.$store.state.currentDate;
    },
    initialPunch() {
      return this.$store.state.initialPunch;
    },
  },

  async created() {
    let employee = this.$auth.user.employee;
    this.UserID = employee.system_user_id;
    this.profile_pictrue = employee.profile_picture;
    this.shift_type_id = employee.schedule.shift_type_id;
    this.company_id = this.$auth.user.company_id;
    this.device_id = `Mobile-${this.UserID}`;
    // this.getLogs();
  },
  methods: {
    generateLog() {
      if (!this.nextPunchAllowed) {
        this.dialog = true;
        this.message = "Next Clocking allowed after 1 minute only";
        this.response_image = "/fail.png";
        setTimeout(() => (this.dialog = false), 3000);
        return;
      }
      let payload = {
        UserID: this.UserID,
        LogTime: `${this.getFormattedDate()} ${this.getFormattedTime()}`,
        log_type: this.log_type,
        DeviceID: this.device_id,
        company_id: this.$auth.user.company_id,
        gps_location: this.locationData.display_name || "location not found",
      };

      this.$axios
        .post(`/generate_log`, payload)
        .then(({ data }) => {
          this.nextPunchAllowed = false;
          this.dialog = true;

          if (!data.status) {
            this.message = data.message;
            this.response_image = "/fail.png";
            setTimeout(() => (this.dialog = false), 3000);
            return;
          }

          this.message = "Your clocking has been recorded successfully";
          this.response_image = "/success.png";

          this.ifExist();

          this.puching_image = "";

          if (this.log_type == "in") {
            if (this.$auth.user.tracking_status) {
              this.insertRealTimeLocation();
              this.intervalId = setInterval(() => {
                this.insertRealTimeLocation();
              }, 60 * 1000);
            }
            this.log_type = "out";
            this.disableCheckInButton = true;
            this.puching_image = "/C-OUT.PNG";
          } else {
            this.log_type = "in";
            this.puching_image = "/C-IN.png";
            console.log(this.puching_image);
            this.disableCheckOutButton = true;
            clearInterval(this.intervalId);
          }
        })
        .catch(({ message }) => {
          this.message = message;
          this.response_image = "/fail.png";
        });

      setTimeout(() => (this.dialog = false), 3000);
      setTimeout(() => (this.nextPunchAllowed = true), 60 * 1000);
    },

    async insertRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            if (
              this.initialPunch == false &&
              this.latitude == latitude &&
              this.longitude == longitude &&
              this.currentDate == this.getFormattedDate()
            ) {
              console.log(`same location found on ${this.currentDate} date.`);
              return;
            }

            let payload = {
              company_id: this.company_id,
              device_id: this.device_id,
              UserID: this.UserID,
              latitude,
              longitude,
              short_name: "---",
              full_name: "---",
            };

            this.$axios
              .post(`/realtime_location`, payload)
              .then(({ data }) => {
                this.setRealTimeLocation(latitude, longitude);
              })
              .catch(({ message }) => console.log(message));
          },
          ({ message }) => {
            this.locationError = message;
          }
        );
      } else {
        this.locationError = "Location not available";
      }
    },
    ifExist() {
      this.$axios
        .get(`/device-by-user/${this.device_id}`)
        .then(({ data }) => {
          if (!data) {
            this.registerDevice();
          } else {
            console.log(`This device id already exist`);
          }
        })
        .catch(({ message }) => console.log(message));
    },
    registerDevice() {
      let payload = {
        device_id: this.device_id,
        name: "Mobile",
        short_name: "Mobile",
        model_number: this.device_id,
        location: this.locationData.display_name ?? "---",
        company_id: this.$auth.user.company_id,
        branch_id: this.$auth.user.branch_id,
        status_id: 1,
        function: "ignore",
        utc_time_zone: "ignore",
        device_type: "auto",
        ip: "0.0.0.0",
        port: "0000",
      };

      this.$axios
        .post(`/device`, payload)
        .then(({ data }) => console.log(`This device registered successfully`))
        .catch(({ message }) => console.log(message));
    },

    getFormattedTime() {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    },

    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;
    },

    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },

    updateDateTime() {
      const now = new Date();
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const dayOfWeek = daysOfWeek[now.getDay()];
      const month = months[now.getMonth()];
      const dayOfMonth = now.getDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      this.formattedDateTime = `${dayOfWeek}, ${month} ${dayOfMonth}`;
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },

    setRealTimeLocation(latitude, longitude) {
      this.$axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
        .then(({ data }) => {
          this.$store.commit("initialPunch", false);
          this.$store.commit("locationData", data);
          this.$store.commit("latitude", latitude);
          this.$store.commit("longitude", longitude);
          this.$store.commit("currentDate", this.getFormattedDate());
        })
        .catch(({ message }) => console.log((this.locationError = message)));
    },
  },
};
</script>
<!-- <style scoped>
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
</style> -->
