<template>
  <div>
    <v-row>
      <v-col>
        <v-card elevation="1" class="mt-2" style="min-height: 500px">
          <v-toolbar class="mb-2 popup_background" dense flat>
            <v-toolbar-title>
              <span style="color: black" class="page-title-display">
                Visitor Requests</span
              ></v-toolbar-title
            >
            <!-- <v-tooltip top color="primary">
              <template v-slot:activator="{ on, attrs }"> -->
            <!-- <v-btn
              title="Reload"
              dense
              class="ma-0 px-0"
              x-small
              :ripple="false"
              @click="getData"
              text
            >
              <v-icon class="ml-2" dark>mdi mdi-reload</v-icon>
            </v-btn> -->
            <v-spacer></v-spacer>
            <Calender
              style="width: 100%; max-width: 180px; float: right"
              @filter-attr="filterAttr"
              :defaultFilterType="1"
              :height="'28px '"
            />
          </v-toolbar>

          <v-alert
            style="
              height: 140px;
              padding-top: 5px;
              padding-bottom: 0px;
              font-size: 14px;
            "
            v-for="(item, index) in data"
            :key="index"
            border="left"
            colored-border
            :color="getRelatedColor(item)"
            elevation="2"
          >
            <v-row class="100%" style="margin: auto">
              <v-col cols="3" style="padding: 0px">
                <v-img
                  style="
                    border-radius: 2%;
                    width: 100px;
                    max-width: 95%;
                    min-height: 100px;
                    height: auto;
                    border: 1px solid #ddd;
                  "
                  :src="item.logo ? item.logo : '/no-profile-image.jpg'"
                >
                </v-img>
              </v-col>
              <v-col cols="9" style="padding-left: 5px; padding-top: 0px">
                <span cols="8">
                  <b>{{ item.full_name }} </b></span
                >
                <span
                  cols="4"
                  style="padding-left: 0px; padding-right: 5px; float: right"
                >
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn dark-2 icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list width="120" dense>
                      <v-list-item @click="updateStatus(item.id, 1)">
                        <v-list-item-title style="cursor: pointer">
                          <v-icon color="green" small> mdi-check </v-icon>
                          Approve
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="updateStatus(item.id, 2)">
                        <v-list-item-title style="cursor: pointer">
                          <v-icon color="red" small> mdi-cancel</v-icon>
                          Reject
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>

                <div>
                  <v-icon size="20">mdi-calendar-range</v-icon>
                  {{ item.from_date_display }} to
                  {{ item.to_date_display }}
                </div>
                <!-- <div>
                  <v-icon size="20">mdi-clock</v-icon>
                  10:45 PM
                </div> -->
                <div>
                  <v-icon size="20">mdi-briefcase-account</v-icon>
                  {{ item.purpose.name }}
                </div>
                <div>
                  <v-icon size="20">mdi-cellphone</v-icon>
                  {{ item.phone_number }}
                </div>
                <div v-if="item.email">
                  <v-icon size="20">mdi-email</v-icon> {{ item.email }}
                </div>
              </v-col>
            </v-row>
          </v-alert>

          <div v-if="data.length == 0" class="pa-5">No data available</div>
        </v-card>
      </v-col>
    </v-row>
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
              <!-- <v-icon v-if="status_id == 1" color="green">mdi-check</v-icon>
              <v-icon v-else-if="status_id == 2" color="red">mdi-cancel</v-icon> -->
            </p>
            <p class="text-center">
              {{ message }}
            </p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    status_id: 0,
    response_image: "/sucess.png",
    dialog: false,
    message: "",
    branchesList: [],
    changeRequestDialog: false,
    Model: "Visitor Request",
    endpoint: "visitor",

    data: [],
    from_date: "",
    to_date: "",
  }),
  created() {},
  methods: {
    filterAttr(data) {
      this.from_date = data.from;
      this.to_date = data.to;
      this.getData();
    },
    updateStatus(id, status_id) {
      this.status_id = status_id;
      this.$axios
        .post(`visitor-status-update/${id}`, {
          status_id: status_id,
        })
        .then(({ data }) => {
          if (!data.status) {
            this.message = data.message;
            this.response_image = "/fail.png";
            setTimeout(() => (this.dialog = false), 3000);
            return;
          }
          this.message = "Your clocking has been recorded successfully";

          if (status_id == 1) {
            this.response_image = "/success.png";
          } else {
            this.response_image = "/fail.png";
          }
          this.dialog = true;
          this.message = data.message;
          this.getData();
        });
    },
    getRelatedColor(item) {
      let colors = {
        0: "purple",
        2: "red",
        1: "green",
        UNKNOWN: "purple",
      };

      return colors[item.status_id || "UNKNOWN"];
    },
    getData() {
      this.$axios
        .get(this.endpoint, {
          params: {
            per_page: 10,
            company_id: this.$auth.user.company_id,
            UserID: this.$auth.user.employee.system_user_id,
            from_date: this.from_date,
            to_date: this.to_date,
          },
        })
        .then(({ data }) => {
          this.data = data.data;
        });
    },
  },
};
</script>
