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
                <SnippetsCard>
                  <template #body>
                    <DashboardAttendance />
                  </template>
                </SnippetsCard>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-10">
              <v-col >
                <SnippetsCard>
                  <template #body>
                    <DashboardLogs />
                  </template>
                </SnippetsCard>
              </v-col>
            </v-row>
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <SnippetsCard>
                      <template #body>
                        <DashboardAVGClockIn />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <DashboardAttendanceStatus />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <VerticalProgress />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <DashboardBestAndLeastEmployee />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-7">
                    <SnippetsCard>
                      <template #body>
                        <DashboardLeaveQuotta />
                      </template>
                    </SnippetsCard>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <SnippetsCard>
                      <template #body>
                        <DashboardCurrentMonthAttendance />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-7">
                    <SnippetsCard>
                      <template #body>
                        <DashboardUpcomingHoliday />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-7">
                    <SnippetsCard>
                      <template #body>
                        <DashboardRemaingHours />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <DashboardAnnouncement />
                      </template>
                    </SnippetsCard>
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
