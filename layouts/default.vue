<template>
  <v-app dark>
    <v-navigation-drawer
      class="indigo"
      dark
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          class=""
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="bg-color" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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
        <img title="My Time Cloud " :src="`/logo22.png`" style="width: 150px" />
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
      <v-container>
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
// import Location from "@/components/Snippets/Location.vue";

export default {
  // components: { Location },

  name: "DefaultLayout",
  data() {
    return {
      profile_picture: "",
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Home",
          to: "/",
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
        },
        {
          icon: "mdi-map-marker-radius",
          title: "GPS History",
          to: "/history",
        },
        {
          icon: "mdi-clipboard-text",
          title: "Change Requests",
          to: "/change_requests",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Logs",
          to: "/logs",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Attendance",
          to: "/attendance",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Leaves",
          to: "/leaves",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Payslips",
          to: "/payslips",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Schedules",
          to: "/schedules",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Leave Quota",
          to: "/leave_quota",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Announcements",
          to: "/announcements",
        },

        {
          icon: "mdi-clipboard-text-clock",
          title: "Holidays",
          to: "/holidays",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Profile",
          to: "/profile",
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
          this.profile_picture = this.$auth.user.employee.profile_picture;
        else this.$router.push("/login");
      }, 2000);
    } catch (e) {
      this.$router.push("/login");
    }
  },
  computed: {
    locationData() {
      return this.$store.state.locationData;
    },
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
