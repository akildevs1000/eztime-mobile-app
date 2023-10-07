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
          <!-- <img :src="profile_pictrue" alt="Avatar" /> -->
          <img
            v-if="disableCheckOutButton"
            src="C-IN.png"
            alt="Avatar"
            @click="generateLog(`in`)"
          />
          <img
            v-if="disableCheckInButton"
            src="C-OUT.png"
            alt="Avatar"
            @click="generateLog(`out`)"
          />
        </v-avatar>

        <div class="text-center mt-5">
          <v-icon>mdi-map-marker-radius</v-icon
          ><span class="mx-1 pt-2">{{
            (locationData && locationData.name) || "Getting location..."
          }}</span>
        </div>
      </v-card>
    </v-container>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent>
        <v-card>
          <v-card-title>
            <!-- {{ message }} -->
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false" color="black">
              mdi-close-circle-outline
            </v-icon>
          </v-card-title>

          <div class="text-center">
            <v-avatar size="100">
              <img
                style="text-align: center; margin: 0 auto"
                v-if="isSuccess"
                src="sucess.png"
                alt="Avatar"
                @click="generateLog(`in`)"
              />
              <img
                v-else
                style="text-align: center; margin: 0 auto"
                src="fail.png"
                alt="Avatar"
                @click="generateLog(`out`)"
              />
            </v-avatar>
          </div>
          <v-card-text>
            <!-- {{ (locationData && locationData.name) || "Getting location..." }} -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import Fingerprint2 from "fingerprintjs2";

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
    isSuccess: false,
  }),
  computed: {
    locationData() {
      return this.$store.state.locationData;
    },

    brands() {
      let navigator = this.$store.state.navigator;
      return navigator.userAgentData && navigator.userAgentData.brands;
    },
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },
  async created() {
    let employee = this.$auth.user.employee;

    this.UserID = employee.system_user_id;
    this.profile_pictrue = employee.profile_picture;
    this.shift_type_id = employee.schedule.shift_type_id;

    this.getLogs();

    // try {
    //   await this.$axios.head(this.$auth.user.employee.profile_picture);
    // } catch (error) {
    //   this.profile_pictrue = "no-profile-image.jpg";
    // }

    this.device_id = `Mobile-${this.UserID}`;
  },
  methods: {
    generateLog(type) {
      let payload = {
        UserID: this.UserID,
        LogTime: this.getFormattedDateTime(),
        log_type: type,
        DeviceID: this.device_id,
        company_id: this.$auth.user.company_id,
        gps_location: this.locationData.name,
      };

      //   return;

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

          this.ifExist();
          this.getLogs();
        })
        .catch(({ message }) => {
          this.message = message;
          this.isSuccess = false;
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
        status_id: 1,
        device_type: "auto",
        ip: "0.0.0.0",
        port: "0000",
      };

      this.$axios
        .post(`/device`, payload)
        .then(({ data }) => console.log(`This device registered successfully`))
        .catch(({ message }) => console.log(message));
    },

    getLogs() {
      this.$axios
        .get(
          `/attendance_single_list?per_page=1&UserID=${
            this.UserID
          }&LogTime=${this.getFormattedDate()}&company_id=${
            this.$auth.user.company_id
          }`
        )
        .then(({ data }) => {
          this.logsCount = data.total;
          if (data && data.total % 2 != 0) {
            this.disableCheckInButton = true;
            this.disableCheckOutButton = false;
            return;
          }

          this.disableCheckInButton = false;
          this.disableCheckOutButton = true;
        })
        .catch(({ message }) => console.log(message));
    },
    lockLogButtons(type) {
      setTimeout(() => (this.dialog = false), 10000);

      if (type == "in") {
        this.disableCheckInButton = true;

        setTimeout(() => {
          this.disableCheckOutButton = false;
        }, 60000);

        return;
      }

      this.disableCheckOutButton = true;

      setTimeout(() => {
        this.disableCheckInButton = false;
        this.$store.commit("disableCheckInButton", false);
      }, 60000);
    },
    getFormattedDateTime() {
      const now = new Date();
      // Format the date and time as "YYYY-MM-DD HH:mm"
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    },

    getFormattedDate() {
      const now = new Date();
      // Format the date and time as "YYYY-MM-DD HH:mm"
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
