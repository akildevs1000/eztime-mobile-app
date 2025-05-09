<template>
  <Dashboard v-if="!loading" :item="dashboardItem" :employee="employeeData" />
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      from_date: "2025-01-01", // Default testing date
      item: {
        employee: {
          leave_group_id: 1,
          title: "Mr.",
          full_name: "John Doe",
          profile_picture:
            "https://backend.mytime2cloud.com/media/employee/profile_picture/1735386653.jpg",
          employee_id: 1002,
          designation: { name: "Software Engineer" },
          branch: { branch_name: "Main Branch" },
          company: { name: "Test Company" },
          local_email: "john.doe@example.com",
          whatsapp_number: "+1234567890",
          home_country: "USA",
          reporting_manager: { first_name: "Jane" },
          show_joining_date: "2022-01-15",
          employee_id_for_payroll: 1002,
          employee_id_for_leave: 1002,
        },
        employee_id: 1002,
        p_count: 20,
        a_count: 2,
        o_count: 1,
        // other data required for getOtherCount
      },
    };
  },
  computed: {
    dashboardItem() {
      return {
        leave_group_id: this.item?.employee?.leave_group_id,
        company_id: this.$auth?.user?.company_id || 1001,
        p_count: this.getPresentCount(this.item),
        a_count: this.getAbsentCount(this.item),
        o_count: this.item?.o_count || 0,
        other_count: this.getOtherCount(this.item),
        rating: this.$util.getRating(
          this.item.p_count,
          this.from_date,
          new Date()
        ),
      };
    },
    employeeData() {
      const emp = this.item?.employee || {};
      return {
        name: `${emp?.title || ""} ${emp?.full_name || ""}`,
        profile_picture: emp?.profile_picture || "",
        employee_id: this.item?.employee_id || "",
        employee_id_for_payroll: emp?.employee_id || "",
        employee_id_for_leave: emp?.employee_id || "",
        designation: emp?.designation?.name || "",
        branch: emp?.branch?.branch_name || "",
        company: this.$auth?.user?.company?.name || "Test Company",
        email: emp?.local_email || "",
        whatsapp_number: emp?.whatsapp_number || "",
        home_country: emp?.home_country || "",
        reporting_manager: emp?.reporting_manager?.first_name || "",
        joining_date: emp?.show_joining_date || "",
      };
    },
  },
  async mounted() {
    await this.getDataFromApi();
  },
  methods: {
    getPresentCount(item) {
      return item?.p_count || 0;
    },
    getAbsentCount(item) {
      return item?.a_count || 0;
    },
    getOtherCount(item) {
      return (item?.o_count || 0) + 1; // Adjust logic based on real use case
    },

    async getDataFromApi() {
      const now = new Date();

      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      this.$axios
        .post(`performance-report`, {
          employee_id: [this.$auth.user.employee.system_user_id],
          department_ids: [],
          branch_id: null,
          from_date: this.formatDate(firstDay),
          to_date: this.formatDate(lastDay),
          page: 1,
          per_page: 10,
          company_id: this.$auth.user.company_id,
          report_type: "monthly",
        })
        .then(({ data }) => {
          this.item = data.data[0];

          this.loading = false;
        });
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>
