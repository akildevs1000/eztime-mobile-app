<template>
  <v-row>
    <v-col>
      <v-card elevation="5" class="accent">
        <v-row justify="space-between" align="center">
          <v-col cols="12" class="px-10">
            <div class="text-h5">OverAll Attendance</div>
          </v-col>
          <v-col cols="4" class="text-center">
            <div class="caption mt-1">
              <v-icon size="20" color="success">mdi-check</v-icon> Present
            </div>
            <div class="text-h6 font-weight-bold">
              <v-progress-circular
                :size="20"
                :value="80"
                color="success"
              ></v-progress-circular>
              13
            </div>
          </v-col>
          <v-col cols="4" class="text-center">
            <div class="caption mt-1">
              <v-icon size="20" color="orange">mdi-calendar</v-icon> Leave
            </div>
            <div class="text-h6 font-weight-bold">
              <v-progress-circular
                :size="20"
                :value="80"
                color="orange"
              ></v-progress-circular>
              10
            </div>
          </v-col>
          <v-col cols="4" class="text-center">
            <div class="caption mt-1">
              <v-icon size="20" color="red">mdi-close</v-icon>
              Absent
            </div>
            <div class="text-h6 font-weight-bold">
              <v-progress-circular
                :size="20"
                :value="80"
                color="red"
              ></v-progress-circular>
              72.6
            </div>
          </v-col>
        </v-row>

        <v-container fluid class="pa-5">
          <apexchart
            type="bar"
            height="350"
            :options="barChartOptions"
            :series="barChartSeries"
            style="width: 100%"
          />
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const barChartOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      columnWidth: "15%",
      borderRadius: 0,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    labels: {
      style: {
        colors: "#ffffff", // White x-axis labels
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#ffffff", // White y-axis labels
        fontSize: "12px",
      },
    },
  },
  colors: ["#6946dd"],
};

const barChartSeries = [
  { name: "Users", data: [10, 15, 20, 22, 25, 28, 30, 33, 20] },
];
</script>
