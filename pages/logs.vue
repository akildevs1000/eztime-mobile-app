<template>
  <v-row>
      <v-col>
        <v-card>
          <v-toolbar class="rounded-md" color="popup_background" dense flat>
            <v-toolbar-title>
              <span style="color: black">
                Attendances Logs</span
              ></v-toolbar-title
            >

            <v-spacer></v-spacer>
            <Calender
              @filter-attr="filterAttr"
              :defaultFilterType="1"
              :height="'28px '"
            />
          </v-toolbar>

          <v-data-table
            :mobile-breakpoint="$store.state.isDesktop ? 0 : 2000"
            dense
            :headers="headers_table"
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
            <template v-slot:item.sno="{ item, index }">
             {{index + 1}}
            </template>
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
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
</template>

<script>
// import DateRangePicker from "../components/Snippets/Filters/DateRangePicker.vue";
import Calender from "../components/Calender.vue";
export default {
  components: {
    Calender,
  },
  data: () => ({
    perPage: 10,
    currentPage: 1,
    options: {
      current: 1,
      total: 0,
      itemsPerPage: 10,
    },

    tableHeight: 750,
    id: "",
    from_menu_filter: "",
    from_date_filter: "",

    showFilters: false,
    filters: {},
    isFilter: false,
    generateLogsDialog: false,
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
    endpoint: "attendance_logs",

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
    headers: [
      {
        text: "#",
        align: "left",
        sortable: false,
        key: "LogTime", //sorting
        value: "sno", //edit purpose
      },
      {
        text: "UserID",
        align: "center",
        sortable: false,
        value: "UserID",
      },
      { text: "DeviceID", align: "center", sortable: false, value: "DeviceID" },
      // {
      //   text: "Device Name",
      //   align: "center",
      //   sortable: false,
      //   value: "device.name",
      // },
      { text: "LogTime", align: "center", sortable: false, value: "LogTime" },
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

    errors: [],
    response: "",
    snackbar: false,
    headers_table: [
      {
        text: "#",
        align: "left",
        sortable: false,
        key: "LogTime", //sorting
        value: "sno", //edit purpose
      },
      {
        text: "DateTime",
        align: "left",
        sortable: false,
        key: "date_range",
        value: "LogTime",
        fieldType: "date_range_picker",
      },

      {
        text: "Device Name",
        align: "left",
        sortable: true,
        key: "device",
        value: "device.name",
        filterable: true,
        filterSpecial: true,
      },
      {
        text: "Gps Location",
        align: "left",
        sortable: true,
        key: "gps_location",
        value: "gps_location",
        filterable: true,
        filterSpecial: true,
      },
    ],
    payload: {},
  }),

  mounted() {
    this.tableHeight = window.innerHeight - 270;
    window.addEventListener("resize", () => {
      this.tableHeight = window.innerHeight - 270;
    });
  },
  created() {
    this.loading = true;
    this.getLogs();
  },
  watch: {
    options: {
      handler() {
        this.getLogs();
      },
      deep: true,
    },
  },
  methods: {
    filterAttr(data) {
      this.payload.from_date = data.from;
      this.payload.to_date = data.to;
      this.payload.from_date_txt = data.from;
      this.payload.to_date_txt = data.to;

      this.getLogs();
    },
    handleDatesFilter(dates) {
      if (dates.length > 1) {
        this.getLogs(this.endpoint, "dates", dates);
      }
    },

    applyFilters() {
      this.getLogs();
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
      this.getLogs();
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
      this.getLogs(this.endpoint, filter_column, filter_value);
    },
    getLogs(url = this.endpoint, filter_column = "", filter_value = "") {
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

        this.currentPage = page;
        this.perPage = itemsPerPage;
      });
    },
  },
};
</script>
