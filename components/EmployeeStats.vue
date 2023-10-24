<template>
    <div v-if="data.length" id="element"></div>
    <NoRecordFound v-else :data="data" />
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: [],
        chartOptions: {
          title: {
            align: "s",
            margin: 0,
          },
          colors: ["#4caf50","#fb8c00","#fb8c00","#fb8c00","#3f51b5","#9e9e9e","#F44336","#F44336","#9e9e9e"],
  
          series: [],
          chart: {
            width: 175, //200 //275
            type: "donut",
          },
          labels: [],
          dataLabels: {
            enabled: false,
            style: {
              fontSize: "10px",
            },
          },
          legend: {
            show: false,
            fontSize: "10px",
          },
          responsive: [
            {
              breakpoint: 100,
              options: {
                chart: {},
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      };
    },
    mounted() {
      this.loading = false;
      // let options = {
      //   company_id: this.$auth.user.company_id,
      //   employee_id: this.$auth.user.employee.system_user_id,
      // };
      let options = {
        company_id: this.$auth.user.company_id,
        employee_id: this.$auth.user.employee.system_user_id,
        department_id: this.$auth.user.employee.department_id,
        shift_type_id: this.$auth.user.employee.schedule.shift_type_id,
      };
      this.$axios
        .get(`employee-statistics`, { params: options })
        .then(async ({ data }) => {
          this.data = data;
          this.chartOptions.labels = await data.map((e) => e.title);
          this.chartOptions.series = await data.map((e) => e.value);
          new ApexCharts(
            document.querySelector("#element"),
            this.chartOptions
          ).render();
        });
  
      this.loading = false;
    },
    methods: {},
  };
  </script>
  