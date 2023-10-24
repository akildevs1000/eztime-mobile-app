<template>
  <div>
    <v-row>
      <v-col cols="5">
        <img style="width: 100%" :src="profile_pictrue" alt="Avatar" />
      </v-col>
      <v-col cols="7">
        <div class="text-left">
          <v-btn style="width: 100%" class="info" dark>
            <b>My Profile</b>
          </v-btn>
        </div>
        <div class="text-center mt-5">
          {{ formattedDateTime || "Loading..." }}
        </div>
        <v-sheet class="text-h4 text-center">
          {{ currentTime }}
        </v-sheet>
      </v-col>
      <v-col cols="12" class="text-center">
        <div>
          <span class="blue--text">Self Decipline Indicator</span> (For own
          reference only)
        </div>
      </v-col>

      <v-col
        cols="4"
        class="text-center"
        style="
          border-top: 1px solid rgb(156, 155, 155);
          border-bottom: 1px solid rgb(156, 155, 155);
        "
      >
        <v-sheet class="text-h6"> 00:00 </v-sheet>
        <div>Work Time</div>
      </v-col>
      <v-col
        cols="4"
        class="text-center"
        style="border: 1px solid rgb(156, 155, 155)"
      >
        <v-sheet class="text-h6"> 00:00 </v-sheet>
        <div>Remaing</div>
      </v-col>
      <v-col
        cols="4"
        class="text-center"
        style="
          border-top: 1px solid rgb(156, 155, 155);
          border-bottom: 1px solid rgb(156, 155, 155);
        "
      >
        <v-sheet class="text-h6"> 00:00 </v-sheet>
        <div>OverTime</div>
      </v-col>

      <v-col
        cols="12"
        class="text-center"
        style="
          background-color: rgb(226, 224, 224);
          border-bottom: 1px solid rgb(199 198 198);
        "
      >
        <div>
          My Attendance<span class="blue--text"> - Since {{ sinceDate }}</span>
        </div>
      </v-col>

      <v-col cols="5" class="text-center">
        <div class="mt-10">
          <!-- <EmployeeStats /> -->

          <v-progress-circular
            :rotate="360"
            :size="150"
            :width="10"
            :value="100"
            color="success"
          >
            10 <br />
            OnTime
          </v-progress-circular>
        </div>
      </v-col>
      <v-col cols="7">
        <div
          v-for="(item, index) in employee_stats"
          :key="index"
          class="grey lighten-1 my-1"
        >
          <span class="px-1">{{ item.title }} </span>
          <span
            :class="item.color"
            class="px-1 white--text"
            dark
            style="float: right"
            >{{ item.value }} <v-icon x-small dark>mdi-chevron-right</v-icon>
          </span>
        </div>
        <!-- <div class="grey lighten-1 my-1">
          <span class="px-1">Early Out </span>
          <span class="px-1 blue white--text" dark style="float: right"
            >1 <v-icon x-small dark>mdi-chevron-right</v-icon>
          </span>
        </div>

        <div class="grey lighten-1 my-1">
          <span class="px-1">Short Hours </span>
          <span class="px-1 red white--text" dark style="float: right"
            >1 <v-icon x-small dark>mdi-chevron-right</v-icon>
          </span>
        </div>

        <div class="grey lighten-1 my-1">
          <span class="px-1">Absent </span>
          <span class="px-1 red white--text" dark style="float: right"
            >1 <v-icon x-small dark>mdi-chevron-right</v-icon>
          </span>
        </div>

        <div class="grey lighten-1 my-1">
          <span class="px-1">On Leave </span>
          <span class="px-1 indigo white--text" dark style="float: right"
            >1 <v-icon x-small dark>mdi-chevron-right</v-icon>
          </span>
        </div> -->
      </v-col>

      <v-col
        cols="11"
        style="
          background-color: rgb(226, 224, 224);
          border-bottom: 1px solid rgb(199 198 198);
        "
      >
        <div class="text-h5">Last Clocking</div>
        <span class=""
          >{{ lastLog && lastLog.time }} {{ lastLog && lastLog.date }}
        </span>

        <div class="">
          <b>{{ lastLog && lastLog.device && lastLog.device.location }}</b>
          <v-icon style="margin-top: -2%" color="green"
            >mdi-map-marker-radius</v-icon
          >
        </div>
      </v-col>
      <v-col
        @click="goToPage(`logs`)"
        cols="1"
        class="indigo text-center white--text d-flex align-center justify-center"
      >
        <span class="white--text" dark>
          <v-icon dark>mdi-chevron-right</v-icon>
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EmployeeStats from "../components/EmployeeStats.vue";

export default {
  components: {
    EmployeeStats,
  },

  data: () => ({
    sinceDate: null,
    progress_value: 100,
    headers: [
      { text: "LogTime", value: "LogTime" },
      { text: "Device", value: "DeviceID" },
      // { text: "location", value: "location" },
    ],
    formattedDateTime: null,
    UserID: null,
    attendanceLogs: [],
    profile_pictrue: "no-profile-image.jpg",
    uniqueDeviceId: null,
    device_id: null,
    isButtonDisabled: false,
    dialog: false,
    message: "",
    response: "",
    shift_type_id: "",
    logsCount: null,

    disableCheckInButton: false,
    disableCheckOutButton: true,

    currentTime: "",
    formattedDateTime: "",
    isSuccess: null,
    locationData: {},
    coordinates: {},
    longitude: 0,
    latitude: 0,

    locationError: null,
    company_id: 0,
    intervalId: 0,
    latitude: null,
    longitude: null,
    currentDate: null,
    lastLog: null,
    employee_stats: [],
  }),
  async mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
    await this.getRealTimeLocation();
  },

  async created() {
    let employee = this.$auth.user.employee;
    this.UserID = employee.system_user_id;
    this.profile_pictrue = employee.profile_picture;
    this.shift_type_id = employee.schedule.shift_type_id;
    this.company_id = this.$auth.user.company_id;
    this.device_id = `Mobile-${this.UserID}`;

    // Create a new Date object
    let currentDate = new Date();
    // Get the current day, month, and year
    let day = 1;
    let month = currentDate.getMonth() + 1; // Months are 0-based, so we add 1 to get the correct month.
    let year = currentDate.getFullYear();

    this.sinceDate =
      (day < 10 ? "0" : "") +
      day +
      "/" +
      (month < 10 ? "0" : "") +
      month +
      "/" +
      year;

    this.getLogs();
    this.getEmployeeStats();
  },
  methods: {
    getLogs() {
      this.$axios
        .get(`attendance_logs`, {
          params: {
            company_id: this.$auth.user.company_id,
            UserID: this.$auth.user.employee.system_user_id,
          },
        })
        .then(({ data }) => {
          this.lastLog = data.data[0];
        });
    },
    getEmployeeStats() {
      this.$axios
        .get(`employee-statistics`, {
          params: {
            company_id: this.$auth.user.company_id,
            employee_id: this.$auth.user.employee.system_user_id,
          },
        })
        .then(({ data }) => {
          this.employee_stats = data;
        });
    },
    goToPage(page) {
      this.$router.push(page);
    },
    async getRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            this.$axios
              .get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              )
              .then(({ data }) => {
                this.locationData = data;
              })
              .catch(({ message }) =>
                console.log((this.locationError = message))
              );
          },
          ({ message }) => {
            this.locationError = message;
          }
        );
      } else {
        this.locationError = "Location not available";
      }
    },

    async insertRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            if (
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
                this.latitude = latitude;
                this.longitude = longitude;
                this.currentDate = this.getFormattedDate();
                console.log(`RealTimeLocation response start`);
                console.log(data);
                console.log(`RealTimeLocation response end`);
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
    generateLog(type) {
      let payload = {
        UserID: this.UserID,
        LogTime: `${this.getFormattedDate()} ${this.getFormattedTime()}`,
        log_type: type,
        DeviceID: this.device_id,
        company_id: this.$auth.user.company_id,
        gps_location: this.locationData.name || "location not found",
      };

      this.$axios
        .post(`/generate_log`, payload)
        .then(({ data }) => {
          this.dialog = true;

          if (!data.status) {
            this.message = data.message;
            this.isSuccess = false;
          }

          this.message = "Success";
          this.isSuccess = true;

          setTimeout(() => (this.isSuccess = null), 3000);

          this.ifExist();

          if (type == "in") {
            this.insertRealTimeLocation();
            this.disableCheckInButton = true;
            this.disableCheckOutButton = false;
            this.intervalId = setInterval(() => {
              this.insertRealTimeLocation();
            }, 60 * 1000);
          } else {
            this.disableCheckInButton = false;
            this.disableCheckOutButton = true;
            clearInterval(this.intervalId);
          }
        })
        .catch(({ message }) => {
          this.message = message;
          this.isSuccess = false;
          console.log(`catch`);
          console.log(message);
          console.log(`catch end`);

          setTimeout(() => (this.isSuccess = null), 1000);
        });
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
        location: this.locationData.name ?? "---",
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
