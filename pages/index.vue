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
            {{ totalPresent }}
            <br />
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
      </v-col>

      <v-col
        cols="11"
        style="
          background-color: rgb(226, 224, 224);
          border-bottom: 1px solid rgb(199 198 198);
        "
      >
        <div class="text-h5">Last Clocking</div>
        <span class="">
          {{ lastLog && lastLog.date }} {{ lastLog && lastLog.time }}
        </span>

        <div class="">
          <b>{{ lastLog && lastLog.device && lastLog.gps_location }}</b>

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
    UserID: null,
    profile_pictrue: "no-profile-image.jpg",
    logsCount: null,
    currentTime: "",
    formattedDateTime: "",
    company_id: 0,
    totalPresent: 0,
    lastLog: null,
    employee_stats: [],
  }),
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },
  computed: {
    locationData() {
      return this.$store.state.locationData;
    },
    currentDate() {
      return this.$store.state.currentDate;
    },
  },
  async created() {
    let employee = this.$auth.user.employee;
    this.profile_pictrue = employee.profile_picture;
    this.UserID = employee.system_user_id;
    this.company_id = this.$auth.user.company_id;

    let currentDate = new Date();
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

    await this.getRealTimeLocation();
  },
  methods: {
    getLogs() {
      this.$axios
        .get(`attendance_logs`, {
          params: {
            company_id: this.company_id,
            UserID: this.UserID,
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
            company_id: this.company_id,
            employee_id: this.UserID,
          },
        })
        .then(({ data }) => {
          this.totalPresent = data.find((e) => e.Key == "P").value || 0;
          this.employee_stats = data;
        });
    },
    goToPage(page) {
      this.$router.push(page);
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

    async getRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            this.$axios
              .get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              )
              .then(({ data }) => {
                this.$store.commit("locationData", data);
                this.$store.commit("currentDate", this.getFormattedDate());
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

    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;
    },
  },
};
</script>
