<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Company Id"
          v-model="company_id"
          outlined
          hide-details
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-select
          dense
          outlined
          hide-details
          v-model="shift_type_id"
          :items="[1, 2, 3, 4, 5, 6]"
          label="Select Shift Type"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              outlined
              hide-details
              v-model="date"
              label="Date"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          label="Select Department"
          dense
          outlined
          x-small
          item-value="id"
          item-text="name"
          v-model="department_id"
          :items="departments"
          @change="getEmployeeIds"
          placeholder="Department"
        ></v-autocomplete>
        <v-autocomplete
          dense
          multiple
          outlined
          x-small
          item-value="system_user_id"
          item-text="first_name"
          v-model="employee_ids"
          :items="employees"
          placeholder="Employees"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-btn class="indigo" block dark @click="submit">Submit</v-btn>
      </v-col>
      <v-col cols="12"> {{ response }} </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedItem: null,
      employeeIds: null,
      employees: [],
      departments: [],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu2: false,
      datePicker: false,
      company_id: 1,
      shift_type_id: 2,
      department_id: 30,
      employee_ids: [],
      response: {},
    };
  },
  async created() {
    let options = {
      params: {
        per_page: 1000,
        company_id: this.company_id,
      },
    };
    const { data } = await this.$axios.get(
      `http://192.168.2.192:8000/api/departments`,
      options
    );
    this.departments = data.data;

    this.getEmployeeIds();
  },
  methods: {
    getEmployeeIds() {
      let options = {
        params: {
          department_ids: [this.department_id],
          per_page: 1000,
          company_id: this.company_id,
        },
      };

      this.$axios.get("employeesByDepartment", options).then(({ data }) => {
        this.employees = data.data;
      });
    },
    submit() {
      let payload = {
        company_id: this.company_id,
        date: this.date,
        shift_type_id: this.shift_type_id,
        UserIds: this.employee_ids,
      };
      this.$axios
        .post("https://backend.eztime.online/api/renderMultiRequest", payload)
        .then(({ data }) => {
          this.response = data;
        });
    },
  },
};
</script>
