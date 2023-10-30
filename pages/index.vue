<template>
  <v-row>
    <v-col cols="5">
      <img style="width: 100%" :src="profile_pictrue" alt="Avatar" />
    </v-col>
    <v-col cols="7">
      <div class="text-left">
        <v-btn
          @click="goToPage('/profile')"
          style="width: 100%"
          class="info"
          dark
        >
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
      <v-sheet class="text-h6">
        {{ todayAttendance && todayAttendance.total_hrs }}
      </v-sheet>
      <div>Work Time</div>
    </v-col>
    <v-col
      cols="4"
      class="text-center"
      style="border: 1px solid rgb(156, 155, 155)"
    >
      <v-sheet class="text-h6">
        {{ remainingTime }}
      </v-sheet>
      <div>Remaing Hours</div>
    </v-col>
    <v-col
      cols="4"
      class="text-center"
      style="
        border-top: 1px solid rgb(156, 155, 155);
        border-bottom: 1px solid rgb(156, 155, 155);
      "
    >
      <v-sheet class="text-h6">
        {{ todayAttendance && todayAttendance.ot }}
      </v-sheet>
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
      <div class="text-center mt-5">
        <v-avatar size="150" class="">
          <img :src="puching_image" alt="loading..." @click="generateLog" />
        </v-avatar>
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
      </div>
    </v-col>

    <v-col cols="7">
      <div
        v-for="(item, index) in employee_stats"
        :key="index"
        class="grey lighten-1 my-1"
      >
        <span class="px-1">{{ item.title }} </span>

        <span :class="item.color" style="float: right">
          <v-icon right x-small dark>mdi-chevron-right</v-icon></span
        >
        <span
          :class="item.color"
          class="px-1 white--text"
          dark
          style="float: right; width: 10px"
          >{{ item.value }}
        </span>
      </div>
    </v-col>
    <v-col cols="12">
      <div class="error--text" v-if="locationError">{{ locationError }}</div>
      <!-- <div v-else>
        <b>Current Location:</b>
        <div>
          {{ locationData && locationData.display_name }}
        </div>
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
</template>

<script>
export default {
  data: () => ({
    sinceDate: null,
    progress_value: 100,
    UserID: null,
    profile_pictrue: "no-profile-image.jpg",
    logsCount: null,
    currentTime: "",
    formattedDateTime: "",
    company_id: 0,
    lastLog: null,
    employee_stats: [],
    todayAttendance: null,
    remainingTime: "00:00",

    headers: [
      { text: "LogTime", value: "LogTime" },
      { text: "Device", value: "DeviceID" },
    ],
    formattedDateTime: null,
    UserID: null,
    lastLog: null,
    attendanceLogs: [],
    profile_pictrue: "no-profile-image.jpg",
    log_type: "",
    puching_image: "",
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
    locationData: null,
    initialPunch: true,
  }),

  mounted() {
    this.updateDateTime();
    this.getSinceDate();
    setInterval(this.updateDateTime, 1000);
  },

  computed: {
    latitude() {
      return this.$store.state.latitude;
    },
    longitude() {
      return this.$store.state.longitude;
    },
    currentDate() {
      return this.$store.state.currentDate;
    },
  },

  async created() {
    try {
      let employee = this.$auth.user.employee;

      if (!employee) {
        this.$router.push("/login");
        return;
      }

      this.profile_pictrue = employee.profile_picture;
      this.UserID = employee.system_user_id;
      this.shift_type_id = employee.schedule.shift_type_id;
      this.company_id = this.$auth.user.company_id;
      this.device_id = `Mobile-${this.UserID}`;

      await this.getEmployeeStats();
      await this.getLastLog();
      this.getRealTimeLocation();
      // setInterval(this.getRealTimeLocation, 60 * 1000);
      this.getTodayAttendance();
    } catch (e) {
      this.$router.push("/login");
    }
  },
  methods: {
    async getLastLog() {
      this.$axios
        .get(`attendance_logs`, {
          params: {
            company_id: this.company_id,
            UserID: this.UserID,
          },
        })
        .then(({ data }) => {
          if (data.data && data.data.length && data.data[0].log_type == "in") {
            this.log_type = "out";
            this.puching_image = "/C-OUT.PNG";
            this.initialPunch = false;
          } else {
            this.log_type = "in";
            this.puching_image = "/C-IN.png";
          }
          this.lastLog = data.data[0];
        });
    },
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

          setInterval(this.getTodayAttendance, 60 * 1000);

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
            this.disableCheckOutButton = true;
            clearInterval(this.intervalId);
          }
          this.getLastLog();
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
              .then(async ({ data }) => {
                await this.setRealTimeLocation(latitude, longitude);
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
          if (!data) this.registerDevice();
        })
        .catch(({ message }) => console.log(message));
    },
    registerDevice() {
      let payload = {
        device_id: this.device_id,
        name: this.device_id,
        short_name: this.device_id,
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

    getSinceDate() {
      const currentDate = new Date();
      const day = `1`.padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      this.sinceDate = `${day}/${month}/${year}`;
    },

    getFormattedTime() {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    },

    async setRealTimeLocation(latitude, longitude) {
      this.$axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
        .then(({ data }) => {
          this.initialPunch = false;
          this.locationData = data;
          this.$store.commit("latitude", latitude);
          this.$store.commit("longitude", longitude);
          this.$store.commit("currentDate", this.getFormattedDate());
        })
        .catch(({ message }) => console.log((this.locationError = message)));
    },
    getRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            this.$axios
              .get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              )
              .then(({ data }) => {
                this.locationData = data;
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
    getTodayAttendance() {
      this.$axios
        .get(`report`, {
          params: {
            company_id: this.company_id,
            employee_id: this.UserID,
            from_date: this.getFormattedDate(),
            to_date: this.getFormattedDate(),
          },
        })
        .then(({ data }) => {
          this.todayAttendance = data.data[0];

          this.getRemainingTime(
            data.data[0].total_hrs,
            data.data[0].shift.working_hours || "00:00"
          );
        });
    },
    async getEmployeeStats() {
      this.$axios
        .get(`employee-statistics`, {
          params: {
            company_id: this.company_id,
            employee_id: this.UserID,
          },
        })
        .then(({ data }) => {
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
    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;
    },
    getRemainingTime(totalHours, performedHours) {
      const [totalHoursStr, totalMinutesStr] = totalHours
        .split(":")
        .map(Number);
      const [performedHoursStr, performedMinutesStr] = performedHours
        .split(":")
        .map(Number);

      const totalMinutes = totalHoursStr * 60 + totalMinutesStr;
      const performedMinutes = performedHoursStr * 60 + performedMinutesStr;

      const remainingMinutes = totalMinutes - performedMinutes;

      if (remainingMinutes < 0) {
        const remainingHours = Math.abs(Math.ceil(remainingMinutes / 60));
        const remainingMinutesPart = Math.abs(remainingMinutes % 60);
        this.remainingTime = `${String(remainingHours).padStart(
          2,
          "0"
        )}:${String(remainingMinutesPart).padStart(2, "0")}`;
      }
    },
  },
};
</script>
