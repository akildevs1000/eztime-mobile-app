<template>
  <span>
    <!-- Show only on mobile devices -->
    <v-responsive class="d-block d-md-none">
      <Mobile />
    </v-responsive>

    <!-- Hide on mobile devices -->
    <v-responsive class="d-none d-md-block">
      <v-container fluid>
        <v-row>
          <!-- Left Column -->
          <v-col cols="12" md="6">
            <v-row no-gutters>
              <v-col cols="12">
                <v-card :class="$isDark() ? 'accent' : 'light-background'">
                  <DashboardAttendance />
                </v-card>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="mt-7">
                <v-card
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <Logs />
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-card
                      class="fill-height"
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <DashboardAVGClockIn />
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-2">
                    <v-card
                      class="fill-height"
                      :class="$isDark() ? 'accent' : 'light-background'"
                    >
                      <DashboardAttendanceStatus />
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-2">
                    <v-card
                      class="mb-5 fill-height"
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <VerticalProgress />
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-2">
                    <v-card
                      class="mb-5 fill-height"
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <DashboardBestAndLeastEmployee />
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-5">
                    <v-card
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <DashboardLeaveQuotta />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-card
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <DashboardCurrentMonthAttendance />
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-5">
                    <v-card
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <DashboardUpcomingHoliday />
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-5">
                    <v-card
                      class="fill-height"
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <DashboardRemaingHours />
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="mt-5">
                    <v-card
                      :class="
                        $isDark()
                          ? 'accent white--text'
                          : 'light-background black--text'
                      "
                    >
                      <DashboardAnnouncement />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </span>
</template>
