<template>
  <div>
    <v-row>
      <v-col>
        <v-card elevation="0" class="mt-2">
          <v-toolbar class="mb-2 white--text" color="white" dense flat>
            <v-toolbar-title>
              <span style="color: black">
                Visitor Requests</span
              ></v-toolbar-title
            >
            <!-- <v-tooltip top color="primary">
              <template v-slot:activator="{ on, attrs }"> -->
            <v-btn
              title="Reload"
              dense
              class="ma-0 px-0"
              x-small
              :ripple="false"
              @click="getData"
              text
            >
              <v-icon class="ml-2" dark>mdi mdi-reload</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-alert
            v-for="(item, index) in data"
            :key="index"
            border="left"
            colored-border
            :color="getRelatedColor(item)"
            elevation="2"
          >
            <v-toolbar dense flat>
              <b>{{ item.full_name }} </b>
              <v-spacer></v-spacer>

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
            </v-toolbar>
            <div class="mx-5">
              <div>
                {{ item.from_date_display }} to
                {{ item.to_date_display }}
              </div>
              <div>Purpose: {{ item.purpose.name }}</div>
              <div>Phone: {{ item.phone_number }}</div>
              <div>Email: {{ item.email }}</div>
            </div>
          </v-alert>
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
  }),
  created() {
    this.getData();
  },
  methods: {
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
          },
        })
        .then(({ data }) => {
          this.data = data.data;
        });
    },
  },
};
</script>
