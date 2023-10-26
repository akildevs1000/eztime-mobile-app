<template>
  <div>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" top="top" color="secondary" elevation="24">
        {{ response }}
      </v-snackbar>
    </div>
    <v-row justify="center">
      <v-dialog v-model="changeRequestDialog" max-width="700px">
        <v-card>
          <v-card-title dark class="popup_background">
            <span dense> Change Request </span>
            <v-spacer></v-spacer>
            <v-icon @click="changeRequestDialog = false" outlined>
              mdi mdi-close-circle
            </v-icon>
          </v-card-title>
          <v-card-text>
            <ChangeRequest
              @reload="getRecords()"
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
              @click="getRecords"
              text
            >
              <v-icon class="ml-2" dark>mdi mdi-reload</v-icon>
            </v-btn>
            <!-- </template>
              <span>Reload</span>
            </v-tooltip> -->

            <!-- <v-tooltip top color="primary">
              <template v-slot:activator="{ on, attrs }"> -->
            <!-- <v-btn
              title="Filter"
              x-small
              :ripple="false"
              text
              @click="toggleFilter"
            >
              <v-icon dark white>mdi-filter</v-icon>
            </v-btn> -->
            <!-- </template>
              <span>Filter</span>
            </v-tooltip> -->

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

          <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}

            <template v-slot:action="{ attrs }">
              <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
            </template>
          </v-snackbar>

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

          <!-- <v-data-table
            dense
            :headers="headers"
            :items="data"
            model-value="data.id"
            :loading="loading"
            :options.sync="options"
            :footer-props="{
              itemsPerPageOptions: [10, 50, 100, 500, 1000],
            }"
            class="elevation-1"
            :server-items-length="totalRowsCount"
            fixed-header
            :height="tableHeight"
            :disable-sort="true"
          >
            <template v-slot:item.UserID="{ item }">
              <strong> {{ item.UserID ? item.UserID : "---" }}</strong>
              <br />
              {{
                item.employee && item.employee.employee_id
                  ? item.employee.employee_id
                  : "---"
              }}
            </template>
            <template v-slot:item.employee.first_name="{ item, index }">
              <v-row no-gutters>
                <v-col
                  style="
                    padding: 5px;
                    padding-left: 0px;
                    width: 50px;
                    max-width: 50px;
                  "
                >
                  <v-img
                    style="
                      border-radius: 50%;
                      height: auto;
                      width: 50px;
                      max-width: 50px;
                    "
                    :src="
                      item.employee && item.employee.profile_picture
                        ? item.employee.profile_picture
                        : '/no-profile-image.jpg'
                    "
                  >
                  </v-img>
                </v-col>
                <v-col style="padding: 10px">
                  <strong>
                    {{ item.employee ? item.employee.first_name : "---" }}
                    {{
                      item.employee ? item.employee.last_name : "---"
                    }}</strong
                  >
                  <div>
                    {{
                      item.employee && item.employee.designation
                        ? caps(item.employee.designation.name)
                        : "---"
                    }}
                  </div>
                </v-col>
              </v-row>
            </template>
            <template v-slot:item.department.name.id="{ item }">
              <strong>{{
                item.employee && item.employee.department
                  ? caps(item.employee.department.name)
                  : "---"
              }}</strong>
              <div>
                {{
                  item.employee && item.employee.sub_department
                    ? caps(item.employee.sub_department.name)
                    : "---"
                }}
              </div>
            </template>
            <template v-slot:item.LogTime="{ item }">
              {{ item.LogTime }}
            </template>
            <template v-slot:item.device.name="{ item }">
              {{ item.device ? caps(item.device.name) : "---" }}
            </template>
            <template v-slot:item.gps_location="{ item }">
              {{ item.gps_location || "---" }}
            </template>
          </v-data-table> -->
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row class="mt-5">
      <v-col cols="12">
        <v-data-table v-model="ids" item-key="id" :headers="headers" :items="data" :server-items-length="total"
          :loading="loading" :options.sync="options" :footer-props="{
            itemsPerPageOptions: [50, 100, 500, 1000],
          }"></v-data-table>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
// import DateRangePicker from "../components/Snippets/Filters/DateRangePicker.vue";

export default {
  components: {
    // DateRangePicker,
  },
  data: () => ({
    branchesList: [],
    tableHeight: 750,
    id: "",
    from_menu_filter: "",
    from_date_filter: "",

    showFilters: false,
    filters: {},
    isFilter: false,
    changeRequestDialog: false,
    totalRowsCount: 0,
    //server_datatable_totalItems: 10,
    datatable_search_textbox: "",
    datatable_searchById: "",
    filter_employeeid: "",
    snack: false,
    snackColor: "",
    snackText: "",
    departments: [],
    Model: "Log",
    endpoint: "http://192.168.2.192:8000/api/change_request",

    from_date: null,
    from_menu: false,
    to_date: null,
    to_menu: false,

    payload: {},

    loading: true,

    date: null,
    menu: false,

    loading: false,
    time_menu: false,

    log_payload: {
      user_id: 41,
      device_id: "OX-8862021010100",
      date: null,
      time: null,
    },
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
    ids: [],

    data: [],
    devices: [],
    total: 0,
    pagination: {
      current: 1,
      total: 0,
      itemsPerPage: 1000,
    },
    payloadOptions: {},
    options: {
      current: 1,
      total: 0,
      itemsPerPage: 10,
    },
    errors: [],
    response: "",
    snackbar: false,
  }),
  computed: {},
  mounted() {
    this.tableHeight = window.innerHeight - 270;
    window.addEventListener("resize", () => {
      this.tableHeight = window.innerHeight - 270;
    });
  },
  created() {
    this.loading = true;
    this.getChangeRequests();
  },
  watch: {
    options: {
      handler() {
        this.getChangeRequests();
      },
      deep: true,
    },
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
    handleDatesFilter(dates) {
      if (dates.length > 1) {
        this.getChangeRequests(this.endpoint, "dates", dates);
      }
    },

    applyFilters() {
      this.getChangeRequests();
      this.from_menu_filter = false;
      this.to_menu_filter = false;
    },
    toggleFilter() {
      // this.filters = {};
      this.isFilter = !this.isFilter;
    },
    clearFilters() {
      this.filters = {};

      this.isFilter = false;
      this.getChangeRequests();
    },
    caps(str) {
      if (str == "" || str == null) {
        return "---";
      } else {
        let res = str.toString();
        return res.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    },
    getDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    can(per) {
      return this.$pagePermission.can(per, this);
    },
    can_old(per) {
      let u = this.$auth.user;
      return (
        (u && u.permissions.some((e) => e == per || per == "/")) || u.is_master
      );
    },
    getRecords(filter_column = "", filter_value = "") {
      this.filters = {};
      this.isFilter = false;
      if (filter_value != "" && filter_value.length <= 2) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Minimum 3 Characters to filter ";
        this.loading = false;
        return false;
      }
      this.getChangeRequests(this.endpoint, filter_column, filter_value);
    },
    getChangeRequests(
      url = this.endpoint,
      filter_column = "",
      filter_value = ""
    ) {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let sortedBy = sortBy ? sortBy[0] : "";
      let sortedDesc = sortDesc ? sortDesc[0] : "";

      this.payloadOptions = {
        params: {
          page: page,
          sortBy: sortedBy,
          sortDesc: sortedDesc,
          per_page: itemsPerPage,
          company_id: this.$auth.user.company_id,
          UserID: this.$auth.user.employee.system_user_id,

          ////department_ids: this.$auth.user.assignedDepartments,
          ...this.payload,
          ...this.filters,
        },
      };
      if (filter_column != "")
        this.payloadOptions.params[filter_column] = filter_value;
      this.loading = true;
      this.$axios.get(url, this.payloadOptions).then(({ data }) => {
        // if (filter_column != "" && data.data.length == 0) {
        //   this.snack = true;
        //   this.snackColor = "error";
        //   this.snackText = "No Results Found";
        //   this.loading = false;
        //   return false;
        // }
        //this.server_datatable_totalItems = data.total;
        this.data = data.data;
        this.total = data.total;
        this.loading = false;
        this.totalRowsCount = data.total;
      });
    },
  },
};
</script>
