<template>
  <div>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" top="top" color="secondary" elevation="24">
        {{ response }}
      </v-snackbar>
    </div>
    <v-row v-if="$store.state.isDesktop">
      <v-col md="3">
        <v-card min-height="700">
          <v-toolbar color="violet" dark style="height: 45px">
            <v-toolbar-title style="height: 50px"
              >Announcements</v-toolbar-title
            >

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <v-data-table
              v-model="ids"
              item-key="id"
              :headers="headers"
              :items="data"
              :loading="loading"
              :options.sync="options"
              :footer-props="{
                itemsPerPageOptions: [10, 50, 100, 500, 1000],
              }"
              class="elevation-0 annnouncment_table"
              :server-items-length="totalRowsCount"
              hide-default-header
            >
              <template
                v-slot:item.title="{ item, index }"
                style="
                  padding-left: 0px !important;
                  padding-right: 0px !important;
                "
              >
                <v-col
                  md="12"
                  sm="12"
                  xs="12"
                  cols="12"
                  @click="showContent(item)"
                  :class="{ table_active: active_el == item.id }"
                >
                  <div class="breakthewords11111">
                    {{ ++index }}: {{ item.title }}
                  </div>

                  <v-row class="pt-2">
                    <v-col cols="8">
                      <div style="color: grey; font-size: 12px">
                        Posted:
                        {{
                          $dateFormat && $dateFormat.format4(item.updated_at)
                        }}
                      </div>
                    </v-col>
                    <v-col cols="4" class="text-right" style="font-size: 12px">
                      <span :style="getPriorityColor(item.category)">{{
                        item.category && item.category.name
                      }}</span>
                    </v-col>
                  </v-row>
                </v-col>
              </template>
            </v-data-table>
          </v-list>
        </v-card></v-col
      >
      <v-col md="9">
        <v-card min-height="700">
          <v-toolbar dark class="popup_background" style="height: 40px">
            <v-toolbar-title style="color: black; height: 50px">{{
              selectedItem && selectedItem.title
            }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <div style="color: black; height: 50px; font-size: 12px">
              Posted:
              {{
                $dateFormat &&
                selectedItem &&
                $dateFormat.format4(selectedItem.updated_at)
              }}
            </div>
          </v-toolbar>
          <v-card-text>
            <div
              v-if="selectedItem"
              class="announ_priority"
              :style="
                ' font-size:20px;text-align:center;' +
                getPriorityColor(selectedItem.category)
              "
            >
              {{ selectedItem.category && selectedItem.category.name }}
            </div>
            <div v-if="selectedItem" v-html="selectedItem.description"></div>
            <v-divider class="pa-5"></v-divider>
            <div class="text-green bold" style="color: green">
              Start Date: {{ selectedItem && selectedItem.start_date }}
            </div>
            <div class="text-red bold" style="color: red">
              End Date: {{ selectedItem && selectedItem.end_date }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col md="12">
        <h2>Announcements</h2>
        <v-card
          v-for="(announcement, index) in data"
          class="mx-auto mb-5"
          :key="'a' + index"
        >
          <v-card-text>
            <v-row>
              <v-col cols="4">
                {{ announcement.user && announcement.user.employee }}
                <v-img
                  style="
                    border-radius: 10%;

                    width: 80px;

                    float: left;
                  "
                  :src="getUserPic(announcement)"
                >
                </v-img
              ></v-col>
              <v-col cols="8" class="text-left">
                <div style="font-weight: bold">{{ announcement.title }}</div>
              </v-col>

              <v-col md="12" sm="12" xs="12" cols="12">
                <div
                  class="breakthewords11111"
                  v-html="announcement.description.replace(/<[^>]*>/g, '')"
                ></div>
                <v-divider></v-divider>
                <v-row class="pt-2">
                  <v-col cols="8">
                    <div style="color: grey; font-size: 12px">
                      Posted: {{ $dateFormat.format4(announcement.created_at) }}
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center" style="font-size: 12px">
                    <span :style="getPriorityColor(announcement.category)">{{
                      announcement.category && announcement.category.name
                    }}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    active_el: "",
    selectedItem: null,
    totalRowsCount: 0,
    selectedItem: {},
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
    Model: "Announcement",
    endpoint: "announcement",
    search: "",
    snackbar: false,
    dialog: false,
    ids: [],
    departments: [],
    loading: false,
    total: 0,
    headers: [
      {
        text: "Title",
        align: "left",
        sortable: true,
        key: "title",
        value: "title",
        fieldType: "text",
      },
    ],
    editedIndex: -1,
    editedItem: {
      title: "",
      description: "",
      departments: [],
      employees: [],
      start_date: null,
      end_date: null,
    },
    defaultItem: {
      title: "",
      description: "",
      departments: [],
      employees: [],
      start_date: null,
      end_date: null,
    },
    response: "",
    data: [],
    errors: [],
    options_dialog: {},
    employees_dialog: [],
    selectAllDepartment: false,
    selectAllEmployee: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New" : "Edit";
    },
    getCurrentDate() {
      // Get the current date
      const date = new Date();

      // Get the year, month, and day from the date object
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    isIndeterminateDepartment() {
      return (
        this.editedItem.departments.length > 0 &&
        this.editedItem.departments.length < this.departments.length
      );
    },
    isIndeterminateEmployee() {
      return (
        this.editedItem.employees.length > 0 &&
        this.editedItem.employees.length < this.employees_dialog.length
      );
    },
  },

  watch: {
    selectAllDepartment(value) {
      if (value) {
        this.editedItem.departments = this.departments.map((e) => e.id);
      } else {
        this.editedItem.departments = [];
      }
    },

    selectAllEmployee(value) {
      if (value) {
        this.editedItem.employees = this.employees_dialog.map((e) => e.id);
      } else {
        this.editedItem.employees = [];
      }
    },

    dialog(val) {
      val || this.close();
      this.errors = [];
      this.search = "";
    },
    options: {
      handler() {
        //this.getDataFromApi();
      },
      deep: true,
    },
  },
  created() {
    this.loading = true;

    this.getDataFromApi();
    //this.getDepartments();
    //this.getEmployees();
  },

  methods: {
    showContent(el) {
      this.active_el = el.id;
      this.selectedItem = el;
    },
    getPriorityColor(category) {
      if (category == null) return "";
      else {
        if (category.name == "Urgent") {
          return "color:#F44336";
        } else if (category.name == "Informational") {
          return "color:#3F51B5";
        } else if (category.name == "Meeting") {
          return "color:#FF5722";
        } else if (category.name == "Priority") {
          return "color:#4CAF50";
        } else if (category.name == "Informational") {
          return "color:#607D8B";
        } else if (category.name == "Low Priority") {
          return "color:#000000";
        }
      }
    },
    getPriorityColor(category) {
      if (category == null) return "";
      else {
        if (category.name == "Urgent") {
          return "color:#F44336";
        } else if (category.name == "Informational") {
          return "color:#3F51B5";
        } else if (category.name == "Meeting") {
          return "color:#FF5722";
        } else if (category.name == "Priority") {
          return "color:#4CAF50";
        } else if (category.name == "Informational") {
          return "color:#607D8B";
        } else if (category.name == "Low Priority") {
          return "color:#000000";
        }
      }
    },
    getUserPic(announcement) {
      let name = "";
      if (announcement.user != null) {
        if (announcement.user && announcement.user.user_type == "company") {
          return announcement.user.company.logo;
        } else if (
          announcement.user &&
          announcement.user.user_type == "employee"
        ) {
          return (
            announcement.user.employee.profile_picture ||
            "/no-profile-image.jpg"
          );
        }
      } else {
        return "/no-profile-image.jpg";
      }
    },
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
    logout() {
      this.$axios.get(`/logout`).then(({ res }) => {
        this.$auth.logout();
        this.$router.push(`/login`);
      });
    },
    getDataFromApi(url = this.endpoint, filter_column = "", filter_value = "") {
      if (!this.$auth.user.employee) {
        this.logout();
        return false;
      }
      if (url == "") url = this.endpoint;
      this.loading = true;

      const { page, itemsPerPage } = this.options;
      const company_id = this.$auth.user.company_id;
      const per_page = 100; //itemsPerPage;

      if (filter_column != "") {
        options.params[filter_column] = filter_value;
      }

      this.$axios
        .get(
          `employee-announcements/${this.$auth.user.employee.id}?page=${
            page || 1
          }&company_id=${company_id}&per_page=${per_page || 1000}`
        )
        .then(({ data }) => {
          if (filter_column != "" && data.data.length == 0) {
            this.snack = true;
            this.snackColor = "error";
            this.snackText = "No Results Found";
            this.loading = false;
            return false;
          }
          if (data.data[0]) this.showContent(data.data[0]);
          this.data = data.data;
          this.total = data.total;
          this.loading = false;

          this.totalRowsCount = data.total;
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
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.editedItem.departments = item.departments.map((e) => e.id);
      this.editedItem.employees = item.employees.map((e) => e.id);
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
