<template>
  <div style="width: 100%">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-row style="width: 100%">
      <v-col lg="9" md="9" sm="12" xs="12">
        <v-row>
          <v-col md="12">
            <v-card class="pa-2" style="height: 354px; overflow: hidden">
              <v-row background fill>
                <v-col
                  lg="12"
                  md="12"
                  sm="12"
                  xs="12"
                  class="d-xs-flex"
                  style="flex: auto"
                >
                  <DashboardAttendanceChart
                    :branch_id="branch_id"
                    :name="'AttendanceChart1'"
                    :height="'300'"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="12" md="12" sm="12" xs="12">
            <v-card class="py-2" style="height: 772px; overflow: hidden">
              <DashboardRealTimeLogTableview :branch_id="branch_id" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col lg="3" md="3" sm="12" xs="12">
        <v-row>
          <v-col lg="12" md="12" sm="12" xs="12">
            <v-card class="py-2 mt-2" style="height: 423px; overflow: hidden">
              <DashboardAnnouncment :branch_id="branch_id" />
            </v-card>
          </v-col>

          <v-col lg="12" md="12" sm="12" xs="12">
            <v-card class="py-2 mt-2" style="height: 312px; overflow: hidden">
              <DashboardLoginActivities :branch_id="branch_id" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DashboardAttendanceChart from "../components/Dashboard/EmpDashboardAttendanceChartV1.vue";
import DashboardRealTimeLogTableview from "../components/Dashboard/EmpDashboardRealTimeLogV1.vue";
import DashboardAnnouncment from "../components/Dashboard/EmpDashbaordAnnouncementsV1.vue";
import DashboardLoginActivities from "../components/Dashboard/EmpDashboardLoginActivitiesV1.vue";
export default {
  components: {
    DashboardAttendanceChart,
    DashboardRealTimeLogTableview,
    DashboardAnnouncment,
    DashboardLoginActivities,
  },
  data() {
    return {
      branchesList: [],
      selectedBranchName: "All Branches",
      seelctedBranchId: "",
      branch_id: "",
      overlay: false,
    };
  },
  // watch: {
  //   branch_id(branch_id) {
  //     return branch_id > 0 ? branch_id : null;
  //   },
  // },
  mounted() {
    //console.log("Dashbaord page 1");
    if (window.innerWidth >= 600) {
      this.$store.commit("isDesktop", true);
    } else {
      this.$store.commit("isDesktop", false);
    }
  },
  created() {
    //console.log("Dashbaord page 2");
    // if (this.$auth.user.user_type == "employee") {
    //   this.$router.push(`/dashboard/employee`);
    // }
    this.getBranches();
    //this.$root.$on("openalert", this.openalert);

    if (!this.$store.state.isDesktop) {
      this.$router.push(`/`);
    }
  },
  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 3000);
    },
  },
  methods: {
    openalert(data) {
      alert("");
    },
    filterBranch(branch) {
      this.$emit("openalert", "");

      // if (branch) {
      //   this.selectedBranchName = branch.branch_name;
      //   this.seelctedBranchId = branch.id;
      //   this.branch_id = branch.id;
      // } else {
      //   this.selectedBranchName = "All Branches";
      //   this.seelctedBranchId = "";
      //   this.branch_id = "";
      // }
    },
    getBranches() {
      this.$axios
        .get(`branches_list`, {
          params: {
            per_page: 1000,
            company_id: this.$auth.user.company_id,
          },
        })
        .then(({ data }) => {
          this.branchesList = data;
        });
    },
  },
};
</script>
