<template>
  <v-app dark>
    <!-- <v-navigation-drawer
      dark
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="theme--dark background"
      style="width: 215px"
    > -->

    <v-navigation-drawer
      :expand-on-hover="miniVariant"
      dark
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="theme--dark background"
      style="width: 215px"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menu_items"
          v-if="item.show_mobile_app != miniVariant"
          :key="i"
          :to="item.to"
          :style="'color:' + item.color"
          router
          exact
        >
          <v-list-item-action>
            <v-icon :style="'color:' + item.color">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="bg-color" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon v-if="!miniVariant" @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->

      <span class="text-overflow">
        <img title="My Time Cloud " :src="`/logo22.png`" style="width: 86px" />
      </span>
      <!-- <v-toolbar-title>{{ title }}</v-toolbar-title> -->
      <v-spacer />
      <v-menu
        class="avatar-menu"
        nudge-bottom="50"
        transition="scale-transition"
        origin="center center"
        bottom
        right
        min-width="20"
        nudge-right="0"
      >
        <template v-slot:activator="{ on, attrs }">
          <label class="px-2 text-overflow" v-bind="attrs" v-on="on">
            <!-- {{ getUser }} -->
          </label>

          <v-btn icon color="red" v-bind="attrs" v-on="on">
            <!-- {{ getUser }} -->
            <v-avatar size="35" style="border: 1px solid #6946dd">
              <v-img :src="profile_picture"></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="avatar-menu">
          <v-list-item-group color="primary">
            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text"
                  >Logout</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <!-- <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container style="background-color: #f4f5fa !important">
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <!-- {{ (locationData && locationData.name) || "Getting location..." }}
      <Location @location="(e) => (locationData = e)" /> -->
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
 

export default {
  // components: { Location },

  name: "DefaultLayout",
  data() {
    return {
      profile_picture: "",
      clipped: false,
      drawer: false,
      fixed: false,
      menu_items: [
        {
          icon: "mdi-apps",
          title: "Home",
          to: "/",
          color: "#9aa9b9",
          show_mobile_app: true,
        },

        // {
        //   icon: "mdi-chart-bubble",
        //   title: "Tracker",
        //   to: "/tracker",
        // },
        {
          icon: "mdi-clock-outline",
          title: "Clocking",
          to: "/clocking",
          color: "#9aa9b9",
          show_mobile_app: true,
        },
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/dashboard",
          color: "#9aa9b9",
          show_mobile_app: false,
        },
        {
          icon: "mdi-map-marker-radius",
          title: "GPS History",
          to: "/history",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-clipboard-text",
          title: "Change Requests",
          to: "/change_requests",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-transit-transfer",
          title: "Visitor Requests",
          to: "/visitor_requests",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Logs",
          to: "/logs",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-calendar-account",
          title: "Attendance",
          to: "/attendance",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-calendar-minus",
          title: "Leaves",
          to: "/leaves",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-cash",
          title: "Payslips",
          to: "/payslips",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-timetable",
          title: "Schedules",
          to: "/schedules",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-account-tie",
          title: "Access Devices",
          to: "/access_control",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-calendar-badge-outline",
          title: "Leave Quota",
          to: "/leave_quota",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-bell-badge",
          title: "Announcements",
          to: "/announcements",
          color: "#9aa9b9",
        },

        {
          icon: "mdi-calendar-star",
          title: "Holidays",
          to: "/holidays",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-account-tie",
          title: "Profile",
          to: "/profile",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-transit-transfer",
          title: "Visitors",
          to: "/visitors",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-logout",
          title: "Logout",
          to: "/logout",
          color: "#f36c6c",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Mytime",
    };
  },
  created() {
    try {
      setTimeout(() => {
        if (this.$auth.user.employee)
          this.profile_picture =
            this.$auth.user.employee.profile_picture || "/no-profile-image.jpg";
        else if (
          this.$auth.user.employee == "undefined" ||
          !this.$auth.user.employee
        ) {
          // console.log("login-verification", this.$auth.user.employee);
          this.logout();
        }
      }, 500);
    } catch (e) {
      // this.logout();
    }

    // if (this.$store.state.isDesktop) {
    //   this.$router.push(`/dashboard`);
    // }
  },
  mounted() {
    if (window.innerWidth >= 600) {
      this.drawer = true;
      this.miniVariant = true;
    } else {
      this.miniVariant = false;
    }
    this.$store.commit("isDesktop", this.miniVariant);

    console.log("isDesktop", this.miniVariant);
  },
  computed: {
    locationData() {
      return this.$store.state.locationData;
    },

    // miniVariant() {
    //   switch (this.$vuetify.breakpoint.name) {
    //     case "xs":
    //       return true;
    //     case "sm":
    //       return true;
    //     case "md":
    //       return true;
    //     case "lg":
    //       return false;
    //     case "xl":
    //       return false;
    //   }
    // },
  },
  methods: {
    // getPhoto() {
    //   setTimeout(() => {
    //     console.log(this);
    //     if (this.$auth) {
    //       this.profile_picture = this.$auth.user.employee.profile_picture;
    //     }
    //   }, 2000);
    // },
    logout() {
      this.$axios.get(`/logout`).then(({ res }) => {
        this.$auth.logout();
        this.$router.push(`/login`);
      });
    },
  },
};
</script>
<style scoped>
.bg-color {
  background-color: rgb(236, 240, 244) !important;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
<style src="@/assets/common.css"></style>
<style src="@/assets/mobile.css"></style>
<style src="@/assets/desktop.css"></style>
