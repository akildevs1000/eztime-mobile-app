<template>
  <v-container>
    <style scoped>
      .v-card {
        border-radius: 16px;
      }
    </style>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col>
            <DashboardAttendance />
          </v-col>
          <v-col cols="12">
            <div style="display: flex; gap: 20px">
              <div style="width:50%;">
                <v-card elevation="5" :color="dark.color">
                  <v-row class="px-5">
                    <v-col cols="12">
                      <div>Activity</div>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="2">
                          <v-avatar color="accent darken-1" size="40">
                            <v-icon color="blue">mdi-package-variant</v-icon>
                          </v-avatar>
                        </v-col>
                        <v-col>
                          <div
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <div>$38,566</div>
                            <div class="text-caption" style="color: #a0aec0">
                              Conversion
                            </div>
                          </div>
                          <div>
                            <v-progress-linear
                              background-color="blue lighten-3"
                              color="blue lighten-1"
                              value="15"
                              rounded
                            ></v-progress-linear>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2">
                          <v-avatar color="accent darken-1" size="40">
                            <span class="green--text">$</span>
                          </v-avatar>
                        </v-col>
                        <v-col>
                          <div
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <div>$38,566</div>
                            <div class="text-caption" style="color: #a0aec0">
                              Conversion
                            </div>
                          </div>
                          <div>
                            <v-progress-linear
                              background-color="green lighten-3"
                              color="green lighten-1"
                              value="15"
                              rounded
                            ></v-progress-linear>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2">
                          <v-avatar color="accent darken-1" size="40">
                            <v-icon color="orange">mdi-trending-up</v-icon>
                          </v-avatar>
                        </v-col>
                        <v-col>
                          <div
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <div>$38,566</div>
                            <div class="text-caption" style="color: #a0aec0">
                              Conversion
                            </div>
                          </div>
                          <div>
                            <v-progress-linear
                              background-color="orange lighten-3"
                              color="orange lighten-1"
                              value="15"
                              rounded
                            ></v-progress-linear>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2">
                          <v-avatar color="accent darken-1" size="40">
                            <v-icon color="pink">mdi-check</v-icon>
                          </v-avatar>
                        </v-col>
                        <v-col>
                          <div
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <div>$38,566</div>
                            <div class="text-caption" style="color: #a0aec0">
                              Conversion
                            </div>
                          </div>
                          <div>
                            <v-progress-linear
                              background-color="pink lighten-3"
                              color="pink lighten-1"
                              value="15"
                              rounded
                            ></v-progress-linear>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
              <div style="width:50%;">
                <v-card elevation="5" :color="dark.color">
                  <v-row class="px-5">
                    <v-col cols="12">
                      <div>Activity</div>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="6">
                          <div style="display: flex">
                            <v-progress-circular
                              :size="40"
                              :value="80"
                              color="deep-orange lighten-2"
                            ></v-progress-circular>
                            <div class="ml-5">
                              <div class="text-h6 font-weight-bold">61K</div>
                              <div class="text-caption" style="color: #a0aec0">
                                Conversion
                              </div>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div style="display: flex">
                            <v-progress-circular
                              :size="40"
                              :value="80"
                              color="pink lighten-2"
                            ></v-progress-circular>
                            <div class="ml-5">
                              <div class="text-h6 font-weight-bold">61K</div>
                              <div class="text-caption" style="color: #a0aec0">
                                Conversion
                              </div>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="mt-5" elevation="5" :color="dark.color">
                  <v-container fluid class="pa-2">
                    <div>Registration</div>
                    <apexchart
                      type="bar"
                      height="120"
                      :options="registrationChartOptions"
                      :series="barChartSeries"
                      style="width: 100%"
                    />
                  </v-container>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <div style="display: flex; gap: 20px">
          <div style="width: 50%">
            <v-card elevation="5" :color="dark.color">
              <v-row class="px-5">
                <v-col cols="12" class="text-center">
                  <div class="text-h5">34,678</div>
                  <div class="">Referral 40%</div>
                </v-col>
                <v-col>
                  <v-sheet color="transparent" class="px-5">
                    <v-sparkline
                      :value="valueSparkline"
                      height="165"
                      :smooth="16"
                      :line-width="5"
                      auto-draw
                    >
                    </v-sparkline>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <div style="width: 50%">
            <v-card elevation="5" :color="dark.color" style="height: 270px">
              <v-row justify="space-between" class="py-2" align="center">
                <v-col cols="12">
                  <div
                    class="d-flex justify-space-between align-center mb-2 px-5"
                  >
                    <div>
                      <div class="text-white text-h5">Conversion</div>
                      <div class="text-grey text-left text-caption">
                        60%
                        <v-icon size="14" color="green">mdi-arrow-up</v-icon>
                      </div>
                    </div>
                    <div class="text-h5 font-weight-bold text-white">89k</div>
                  </div>
                  <div>
                    <v-sheet color="transparent" class="px-15">
                      <apexchart
                        type="bar"
                        height="100"
                        :options="doubleBarChartOptions"
                        :series="series"
                      />
                    </v-sheet>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>
        <div style="display: flex; gap: 20px" class="mt-5">
          <div style="width: 50%">
            <v-card elevation="5" :color="dark.color">
              <v-row class="px-5">
                <v-col>
                  <v-sheet color="transparent" class="px-5">
                    <apexchart
                      type="donut"
                      height="200"
                      :options="donutChartOptions"
                      :series="[40, 30, 30]"
                    />
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <div style="width: 50%" class="pt-1">
            <v-card
              :color="dark.color"
              class="elevation-5"
              style="height: 90px"
            >
              <v-row class="px-5">
                <v-col cols="2">
                  <v-avatar color="background" size="40">
                    <v-icon class="">mdi-account</v-icon>
                  </v-avatar>
                </v-col>
                <v-col cols="5">
                  <div>
                    <div
                      class="text-h6 font-weight-bold"
                      style="color: #ffffff"
                    >
                      $38,566
                    </div>
                    <div class="text-caption" style="color: #a0aec0">
                      Conversion
                    </div>
                  </div>
                </v-col>
                <v-col cols="5">
                  <v-sheet color="transparent" class="px-5">
                    <v-sparkline
                      :value="valueSparkline"
                      height="100"
                      width="150"
                      :smooth="50"
                      :line-width="10"
                      auto-draw
                    >
                    </v-sparkline>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              :color="dark.color"
              class="elevation-5 mt-5"
              style="height: 90px"
            >
              <v-row class="px-5">
                <v-col cols="2">
                  <v-avatar color="background" size="40">
                    <v-icon class="">mdi-account</v-icon>
                  </v-avatar>
                </v-col>
                <v-col cols="5">
                  <div>
                    <div
                      class="text-h6 font-weight-bold"
                      style="color: #ffffff"
                    >
                      $38,566
                    </div>
                    <div class="text-caption" style="color: #a0aec0">
                      Conversion
                    </div>
                  </div>
                </v-col>
                <v-col cols="5">
                  <v-sheet color="transparent" class="px-5">
                    <v-sparkline
                      :value="valueSparkline"
                      height="100"
                      width="150"
                      :smooth="50"
                      :line-width="10"
                      auto-draw
                    >
                    </v-sparkline>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>

        <div style="display: flex; gap: 20px" class="mt-5">
          <div style="width: 50%" class="pt-1">
            <v-card :color="dark.color" class="elevation-5">

              <v-row class="px-5">
                <v-col cols="12">
                  <VerticalProgress />
                </v-col>
                <v-col cols="1">
                  <v-icon color="primary">mdi-arrow-up</v-icon>
                </v-col>
                <v-col cols="5">
                  <div>
                    <div
                      class="text-h6 font-weight-bold"
                      style="color: #ffffff"
                    >
                      Best Selling
                    </div>
                    <div class="text-caption" style="color: #a0aec0">
                      Sarturday
                    </div>
                  </div>
                </v-col>
                <v-col cols="5" class="text-right"> 26.5K </v-col>
              </v-row>
              <v-row class="px-5">
                <v-col cols="1">
                  <v-icon color="red">mdi-arrow-down</v-icon>
                </v-col>
                <v-col cols="5">
                  <div>
                    <div
                      class="text-h6 font-weight-bold"
                      style="color: #ffffff"
                    >
                      Best Selling
                    </div>
                    <div class="text-caption" style="color: #a0aec0">
                      Thursday
                    </div>
                  </div>
                </v-col>
                <v-col cols="5" class="text-right"> 2K </v-col>
              </v-row>
            </v-card>
          </div>
          <div style="width: 50%" class="pt-1">
            <v-card
              :color="dark.color"
              class="elevation-5"
              style="height: 355px"
            >
              <v-row class="px-5">
                <v-col cols="12">
                  <div
                    class="text-center"
                    style="max-width: 100px; margin: 0 auto"
                  >
                    <v-select
                      value="2025"
                      dense
                      outlined
                      :items="[`2025`, `2022`]"
                      hide-details
                    ></v-select>
                  </div>
                  <apexchart
                    type="radialBar"
                    :options="gaugeOptions"
                    :series="gaugeSeries"
                  ></apexchart>
                  <div class="text-center mt-2">62% Growth in 2025</div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9"> 
        <v-card elevation="5" :color="dark.color">
          <Logs />
        </v-card>
      </v-col>
      <v-col >
        <v-card elevation="5" :color="dark.color">
          <v-row class="px-5">
            <v-col cols="12">Activity Timeline</v-col>
            <v-col>
              <Timeline />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const gaugeSeries = [78];

const gaugeOptions = {
  chart: {
    height: 350,
    type: "radialBar",
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        show: false, // Remove percentage from the bar itself.  We'll display it below.
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  colors: ["#9c27b0"], // purple

  stroke: {
    dashArray: 4,
  },
};

const series = [
  {
    name: "Positive",
    data: [10, 14, 12, 15, 20, 18, 22, 25, 21, 19, 20, 18],
  },
  {
    name: "Negative",
    data: [-5, -3, -4, -2, -6, -5, -3, -4, -6, -2, -3, -5],
  },
];

const doubleBarChartOptions = {
  chart: {
    type: "bar",
    stacked: true, // Align bars
    sparkline: { enabled: true },
  },
  plotOptions: {
    bar: {
      columnWidth: "30%", // Set column width to 10%
      borderRadius: 2,
      // Optional: if you need horizontal bars, you can change 'horizontal' to true
      horizontal: false, // Stacked bars are vertical
      // Adjusting for a gap by setting offsets
      offsetX: 2, // This will give a slight separation between bars
    },
  },
  colors: ["#3b82f6", "#f59e0b"], // blue and orange
  tooltip: { enabled: false },
  xaxis: { show: false },
  yaxis: { show: false },
  grid: { show: false },
};

const valueSparkline = [423, 446, 675, 510, 590, 610, 760];
const dark = {
  color: "#272f42",
};
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

const registrationChartOptions = {
  chart: {
    type: "bar",
    stacked: true, // Align bars
    sparkline: { enabled: true },
  },
  plotOptions: {
    bar: {
      columnWidth: "30%", // Set column width to 10%
      borderRadius: 2,
      // Optional: if you need horizontal bars, you can change 'horizontal' to true
      horizontal: false, // Stacked bars are vertical
      // Adjusting for a gap by setting offsets
    },
  },
  colors: ["#3b82f6"], // blue and orange
  tooltip: { enabled: false },
  xaxis: { show: false },
  yaxis: { show: false },
  grid: { show: false },
};

const barChartSeries = [
  { name: "Users", data: [10, 15, 20, 22, 25, 28, 30, 33, 20] },
];

const lineChartOptions = {
  chart: { type: "line", toolbar: { show: false } },
  stroke: { curve: "smooth" },
  colors: ["#00E396"],
  grid: { show: false },
};
const lineChartSeries = [{ name: "Referral", data: [10, 20, 15, 30, 50] }];

const conversionChartOptions = {
  chart: { type: "bar", toolbar: { show: false } },
  colors: ["#FFA500"],
  grid: { show: false },
};
const conversionChartSeries = [
  { name: "Conversions", data: [5, 10, 15, 12, 20, 18, 25] },
];

const donutChartOptions = {
  legend: {
    position: "bottom",
    labels: {
      colors: "#FFFFFF", // Set legend text color to white
    },
  },
  colors: ["#008FFB", "#00E396", "#FEB019"],
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "90%", // Adjusted to 90% for thickness
      },
    },
  },
  stroke: {
    show: false, // Removes the white border
  },
};
</script>
