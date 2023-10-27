<template>
  <div>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" top="top" color="secondary" elevation="24">
        {{ response }}
      </v-snackbar>
    </div>

    <v-row>
      <v-col md="12">
        <v-card class="mb-5 rounded-md" elevation="0">
          <v-toolbar class="rounded-md" color="popup_background" dense flat>
            <v-col cols="6"
              ><v-toolbar-title><span>Holidays</span></v-toolbar-title></v-col
            >

            <v-col cols="6" class="mt-6">
              <v-select
                @change="getDataFromApi()"
                outlined
                dense
                x-small
                v-model="filterYear"
                :items="dataYears"
                placeholder="Year"
                solo
                flat
              ></v-select>
            </v-col>
          </v-toolbar>

          <v-data-table
            v-model="ids"
            item-key="id"
            :headers="headers"
            :items="data"
            :loading="loading"
            :footer-props="{
              itemsPerPageOptions: [10, 50, 100, 500, 1000],
            }"
            class="elevation-1"
            :options.sync="options"
            :server-items-length="totalRowsCount"
          >
            <template v-slot:item.name="{ item }">
              {{ item.name }}
            </template>
            <template v-slot:item.start_date="{ item }">
              {{ item.start_date }}
            </template>
            <template v-slot:item.end_date="{ item }">
              {{ item.end_date }}
            </template>
            <template v-slot:item.total_days="{ item }">
              {{ item.total_days }}
            </template>

            <template v-slot:no-data>
              <!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    dialogFilter: false,
    options: {},
    totalRowsCount: 0,
    formTitle: "New Holiday Information",
    dialogEmployees: false,
    idsEmployeeList: [],
    //editor
    datatable_search_textbox: "",
    filter_employeeid: "",
    snack: false,
    snackColor: "",
    snackText: "",

    // starting editor's content
    content: `
        <h1>Yay Headlines!</h1>
        <p>All these <strong>cool tags</strong> are working now.</p>
          `,

    //end editor
    scrollInvoked: 0,
    start_menu: false,
    end_menu: false,
    title: "",
    des: "",
    desDate: "",
    dept: "",
    options: {},
    Model: "Holidays",
    endpoint: "holidays",
    search: "",
    snackbar: false,
    dialog: false,
    ids: [],
    departments: [],
    loading: false,
    total: 0,
    headers_Dialog: [
      {
        text: "Title",
        align: "left",
        sortable: true,
        value: "first_name",
      },
      {
        text: "Employee Id",
        align: "left",
        sortable: true,
        value: "employee_id",
      },
      // {
      //   text: "Department ",
      //   align: "left",
      //   sortable: true,
      //   value: "department.name",
      // },
      // {
      //   text: "Designation",
      //   align: "left",
      //   sortable: true,
      //   value: "designation.name",
      // },
    ],
    headers: [
      {
        text: "Title",
        align: "left",
        sortable: false,
        key: "name",
        value: "name",
      },
      {
        text: "Start Date",
        align: "left",
        sortable: false,
        value: "start_date",
      },
      {
        text: "End Date",
        align: "left",
        sortable: false,
        value: "end_date",
      },
      {
        text: "Total Days",
        align: "left",
        sortable: false,
        value: "total_days",
      },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      total_days: "0",
      start_date: null,
      end_date: null,
      year: null,
    },
    defaultItem: {
      name: "",
      total_days: "",
      start_date: null,
      end_date: null,
      year: null,
    },
    response: "",
    data: [],
    errors: [],
    options_dialog: {},
    employees_dialog: [],
    selectAllDepartment: false,
    selectAllEmployee: false,
    DialogEmployeesData: {},
    dataYears: [],
    filterYear: "",
  }),

  computed: {},

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  created() {
    this.loading = true;
    let endDate = new Date();
    this.filterYear = endDate.getFullYear();

    this.getDataFromApi();
    this.lastTenYears();
  },

  methods: {
    lastTenYears() {
      const year = new Date().getFullYear();
      this.dataYears = Array.from({ length: 10 }, (_, i) => year - i);
    },
    update_EdititemStart() {
      this.$refs.from_menu.save(this.editedItem.start_date);
      this.from_menu = false;
      this.getDayscount();
    },
    update_EdititemEnd() {
      this.$refs.end_menu.save(this.editedItem.end_date);
      this.end_menu = false;

      this.getDayscount();
    },
    getDayscount() {
      if (!this.editedItem.start_date || !this.editedItem.end_date) {
        return false;
      }
      let startDate = new Date(this.editedItem.start_date);
      let endDate = new Date(this.editedItem.end_date);

      this.editedItem.year = endDate.getFullYear();

      // Calculate the time difference in milliseconds
      let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());

      // Convert the time difference to days
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      this.editedItem.total_days = diffDays + 1;
    },
    gotoDialogPage(item) {
      // console.log('item', item);
      this.DialogEmployeesData = item.employees;
      this.dialogEmployees = true;
    },
    datatable_save() {},
    datatable_cancel() {
      this.datatable_search_textbox = "";
    },
    datatable_open() {
      this.datatable_search_textbox = "";
    },
    datatable_close() {
      this.loading = false;
    },
    toggleDepartmentSelection() {
      this.selectAllDepartment = !this.selectAllDepartment;
    },
    toggleEmployeeSelection() {
      this.selectAllEmployee = !this.selectAllEmployee;
    },

    onScroll() {
      this.scrollInvoked++;
    },

    getDepartments() {
      let options = {
        params: {
          per_page: 1000,
          company_id: this.$auth.user.company_id,
        },
      };
      this.$axios.get(`departments`, options).then(({ data }) => {
        this.departments = data.data;
      });
    },

    employeesByDepartment() {
      this.loading_dialog = true;
      const { page, itemsPerPage } = this.options_dialog;

      let options = {
        params: {
          department_ids: this.editedItem.departments,
          per_page: itemsPerPage,
          page: page,
          company_id: this.$auth.user.company_id,
        },
      };

      if (!this.editedItem.departments.length) {
        this.getEmployees();
        return;
      }

      this.$axios.get("employeesByDepartment", options).then(({ data }) => {
        this.employees_dialog = data.data;
        this.loading_dialog = false;
      });
    },

    getDataFromApi(url = this.endpoint, filter_column = "", filter_value = "") {
      if (url == "") url = this.endpoint;
      this.loading = true;

      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let sortedBy = sortBy ? sortBy[0] : "";
      let sortedDesc = sortDesc ? sortDesc[0] : "";

      let options = {
        params: {
          page: page,
          sortBy: sortedBy,
          sortDesc: sortedDesc,
          per_page: itemsPerPage,
          company_id: this.$auth.user.company_id,
          year: this.filterYear,
        },
      };
      if (filter_column != "") {
        options.params[filter_column] = filter_value;
      }

      this.$axios.get(`${url}?page=${page}`, options).then(({ data }) => {
        if (filter_column != "" && data.data.length == 0) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "No Results Found";
          this.loading = false;
          return false;
        }
        this.data = data.data;
        this.total = data.total;
        this.loading = false;

        this.totalRowsCount = data.total;
        this.dialogFilter = false;
      });
    },
    searchIt(e) {
      if (e.length == 0) {
        this.getDataFromApi();
      } else if (e.length > 2) {
        this.getDataFromApi(`${this.endpoint}/search/${e}`);
      }
    },

    editItem(item) {
      this.formTitle = "Edit Holidays Information";
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    delteteSelectedRecords() {
      confirm(
        "Are you sure you wish to delete selected records , to mitigate any inconvenience in future."
      ) &&
        this.$axios
          .post(`${this.endpoint}/delete/selected`, {
            ids: this.ids.map((e) => e.id),
          })
          .then(({ data }) => {
            if (!data.status) {
              this.errors = data.errors;
            } else {
              this.snackbar = data.status;
              this.ids = [];
              this.response = "Selected records has been deleted";
            }
            this.getDataFromApi();
          })
          .catch((err) => console.log(err));
    },

    deleteItem(item) {
      confirm(
        "Are you sure you wish to delete , to mitigate any inconvenience in future."
      ) &&
        this.$axios
          .delete(this.endpoint + "/" + item.id)
          .then(({ data }) => {
            if (!data.status) {
              this.errors = data.errors;
            } else {
              this.getDataFromApi();
              this.snackbar = data.status;
              this.response = data.message;
            }
          })
          .catch((err) => console.log(err));
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    getEmployees(url = "employee") {
      this.loading = true;

      const { page, itemsPerPage } = this.options;

      let options = {
        params: {
          per_page: itemsPerPage,
          company_id: this.$auth.user.company_id,
        },
      };

      this.$axios.get(`${url}?page=${page}`, options).then(({ data }) => {
        this.employees_dialog = data.data;
      });
    },

    save() {
      this.editedItem.company_id = this.$auth.user.company_id;

      if (this.editedIndex > -1) {
        this.$axios
          .put(this.endpoint + "/" + this.editedItem.id, this.editedItem)
          .then(({ data }) => {
            if (!data.status) {
              this.errors = data.errors;
            } else {
              const index = this.data.findIndex(
                (item) => item.id == this.editedItem.id
              );
              this.data.splice(index, 1, {
                id: this.editedItem.id,
                name: this.editedItem.name,
              });
              this.getDataFromApi();
              this.snackbar = data.status;
              this.response = data.message;
              this.close();
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.$axios
          .post(this.endpoint, this.editedItem)
          .then(({ data }) => {
            if (!data.status) {
              this.errors = data.errors;
            } else {
              this.getDataFromApi();
              this.snackbar = data.status;
              this.response = data.message;
              this.close();
              this.errors = [];
              this.search = "";
            }
          })
          .catch((res) => console.log(res));
      }
    },
  },
};
</script>
