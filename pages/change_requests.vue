<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="changeRequestDialog" max-width="700px">
        <v-card>
          <v-card-title dark class="popup_background">
            <span dense> {{ Model }}s </span>
            <v-spacer></v-spacer>
            <v-icon @click="changeRequestDialog = false" outlined>
              mdi mdi-close-circle
            </v-icon>
          </v-card-title>
          <v-card-text>
            <ChangeRequest
              @reload="getChangeRequests()"
              @close-change-request-form="() => (changeRequestDialog = false)"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0" class="mt-2">
          <v-toolbar class="mb-2 white--text" color="white" dense flat>
            <v-toolbar-title>
              <span style="color: black">
                Change Requests</span
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
              @click="getChangeRequests"
              text
            >
              <v-icon class="ml-2" dark>mdi mdi-reload</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              title="Change Request"
              x-small
              :ripple="false"
              text
              @click="changeRequestDialog = true"
            >
              <v-icon class="">mdi mdi-plus-circle</v-icon>
            </v-btn>
          </v-toolbar>

          <v-alert
            v-for="(item, index) in data"
            :key="index"
            border="left"
            colored-border
            :color="getRelatedColor(item)"
            elevation="2"
          >
            <div>
              Request Type:
              <b>{{ item.request_type }} </b>
            </div>
            <div>
              <b
                >{{ item.from_date }} to
                {{ item.to_date }}
              </b>
            </div>
            <div>Remarks: {{ item.remarks }}</div>
            <div>Requested At: {{ item.requested_at }}</div>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    branchesList: [],
    changeRequestDialog: false,
    Model: "Change Request",
    endpoint: "change_request",

    headers: [
      {
        text: "Request type",
        align: "center",
        sortable: false,
        value: "request_type",
      },
      {
        text: "From",
        align: "center",
        sortable: false,
        value: "from_date",
      },
      {
        text: "To",
        align: "center",
        sortable: false,
        value: "to_date",
      },
      {
        text: "Remarks",
        align: "center",
        sortable: false,
        value: "remarks",
      },
      {
        text: "Status",
        align: "center",
        sortable: false,
        value: "status",
      },
    ],

    data: [],
  }),
  created() {
    this.getChangeRequests();
  },
  methods: {
    getRelatedColor(item) {
      let colors = {
        P: "purple",
        R: "red",
        A: "green",
      };
      return colors[item.status];
    },
    getChangeRequests() {
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
