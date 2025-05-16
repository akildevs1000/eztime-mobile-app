<template>
   <SnippetsCard class="px-5">
    <template #body>
      <div>
    <v-row justify="center">
      <v-dialog v-model="changeRequestDialog" max-width="500px">
        <v-card>
          <v-card-title dark class="popup_background">
            <span dense> {{ Model }}s </span>
            <v-spacer></v-spacer>
            <v-icon @click="changeRequestDialog = false" outlined>
              mdi mdi-close-circle
            </v-icon>
          </v-card-title>
          <v-card-text>
            <ChangeRequest
              @reload="getChangeRequests()"
              @close-change-request-form="() => (changeRequestDialog = false)"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col cols="6">
        Change Requests
        <v-btn
          title="Reload"
          dense
          class="ma-0 px-0"
          x-small
          :ripple="false"
          @click="getChangeRequests"
          text
        >
          <v-icon class="ml-2" dark>mdi mdi-reload</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn
          small
          class="primary"
          title="Change Request"
          @click="changeRequestDialog = true"
        >
          + New
        </v-btn>
      </v-col>
      <v-col>
        <v-data-table
          :class="
            $isDark()
              ? 'accent custom-dark-header-for-datatable'
              : 'light-background custom-light-header-for-datatable'
          "
          v-if="$store.state.isDesktop"
          :mobile-breakpoint="$store.state.isDesktop ? 0 : 2000"
          item-key="id"
          :headers="headers"
          :items="data"
          :loading="loading"
          :footer-props="{
            itemsPerPageOptions: [10, 50, 100, 500, 1000],
          }"
          :options.sync="options"
          :server-items-length="totalRowsCount"
        >
          <template v-slot:item.sno="{ item, index }">
            {{
              currentPage
                ? (currentPage - 1) * perPage +
                  (cumulativeIndex + data.indexOf(item))
                : ""
            }}
          </template>
          <template v-slot:item.from_date="{ item }">
            {{ item.from_date }} to {{ item.to_date }}
          </template>

          <template v-slot:item.remarks="{ item }">
            {{ item.remarks }}
          </template>
          <template v-slot:item.status="{ item }">
            <div :style="'color:' + getRelatedColor(item)">
              {{ item.status == "P" ? "Pending" : "Approved" }}
            </div>
          </template>
        </v-data-table>
        <v-alert
          v-else="$store.state.isDesktop"
          v-for="(item, index) in data"
          :key="index"
          border="left"
          colored-border
          :color="getRelatedColor(item)"
          elevation="2"
        >
          <div>
            Request Type:
            <b>{{ item.request_type }} </b>
          </div>
          <div>
            <b
              >{{ item.from_date }} to
              {{ item.to_date }}
            </b>
          </div>
          <div>Remarks: {{ item.remarks }}</div>
          <div>Requested At: {{ item.requested_at }}</div>
        </v-alert>
      </v-col>
    </v-row>
  </div>
    </template>
    </SnippetsCard>
  
</template>

<script>
export default {
  data: () => ({
    totalRowsCount: 0,
    loading: false,
    branchesList: [],
    changeRequestDialog: false,
    Model: "Change Request",
    endpoint: "change_request",
    perPage: 10,
    cumulativeIndex: 1,
    currentPage: 1,
    options: {},
    pagination: {
      current: 1,
      total: 0,
      itemsPerPage: 1000,
    },
    headers: [
      {
        text: "#",
        align: "left",
        sortable: false,
        value: "sno",
      },
      {
        text: "Request type",
        align: "center",
        sortable: false,
        value: "request_type",
      },
      {
        text: "Date",
        align: "center",
        sortable: false,
        value: "from_date",
      },

      {
        text: "Remarks",
        align: "center",
        sortable: false,
        value: "remarks",
      },
      {
        text: "Status",
        align: "center",
        sortable: false,
        value: "status",
      },
    ],

    data: [],
  }),
  created() {
    this.getChangeRequests();
  },
  watch: {
    options: {
      handler() {
        this.getChangeRequests();
      },
      deep: true,
    },
  },
  methods: {
    getRelatedColor(item) {
      let colors = {
        P: "purple",
        R: "red",
        A: "green",
      };
      return colors[item.status];
    },
    getChangeRequests() {
      this.loading = true;
      let { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let sortedBy = sortBy ? sortBy[0] : "";
      let sortedDesc = sortDesc ? sortDesc[0] : "";

      this.currentPage = page ? page : 1;
      this.perPage = itemsPerPage ? itemsPerPage : 10;
      this.$axios
        .get(this.endpoint, {
          params: {
            per_page: 10,
            company_id: this.$auth.user.company_id,
            employee_device_id: this.$auth.user.employee.system_user_id,
            page: page,
            sortBy: sortedBy,
            sortDesc: sortedDesc,
            per_page: itemsPerPage,
          },
        })
        .then(({ data }) => {
          this.data = data.data;
          this.totalRowsCount = data.total;
          this.loading = false;
        });
    },
  },
};
</script>
