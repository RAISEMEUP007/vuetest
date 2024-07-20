<!-- <template>
hi
</template> -->


<template>
  <v-app v-if="$auth.loggedIn">

    <!-- App Bar -->
    <AppBar logo="/logo2.png"  :color="$vuetify.theme.dark ? '' : 'white'">
      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-badge :content="generalQueue.length || '0'" overlap color="grey" bordered class="mr-4"><v-avatar size="30" color="grey" class="font-weight-bold text-body"><v-icon small color="white">mdi-folder</v-icon></v-avatar></v-badge>
        <v-badge :content="pausedInQueue.length || '0'" overlap color="error" bordered class="mr-4"><v-avatar color="error" size="30" class="font-weight-bold text-body"><v-icon small color="white">mdi-pause</v-icon></v-avatar></v-badge>
        <v-badge :content="activeInQueue.length || '0'" overlap color="success" bordered class="mr-4"><v-avatar color="success" size="30" class="font-weight-bold text-body"><v-icon small color="white">mdi-play</v-icon></v-avatar></v-badge>
      </template>
      <IconButton @click="showManualTimeEntry = true" icon="mdi-bell-plus" tooltip="Manual Time Entry" />
      <IconButton @click="settings = true" icon="mdi-cog-outline" tooltip="Settings" />
      <IconButtonMenu :items="userItems" :icon="$nuxt.$route.path === '/account' ? 'mdi-account' : 'mdi-account-outline'" />
    </AppBar>

    <!-- Navigation
    <Navigation v-model="drawer" :hidden="hideNav" :items="items" color="primary" />
    -->

    <!-- Main Content Container -->
    <v-main>
      <nuxt />
      <!-- <nuxt keep-alive :keep-alive-props="{ max: 10, exclude: ['pageAccount'] }" /> -->
    </v-main>

    <!-- Sidebar: Settings -->
    <Sidebar v-model="settings" title="Settings">
      <ThemeSettings />
    </Sidebar>

    <!-- Snackbar -->
    <Snackbar :busy="snackbar.busy" :timeout="snackbar.timeout"
      :color="snackbar.color" :message="snackbar.message"
      :canClose="snackbar.canClose" @close="setBusy(false)" />

    <DialogManualTimeEntry v-model="showManualTimeEntry" @submit="addTimeEntry" />

  </v-app>
  <v-app v-else>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import AppBar from '../components/paradym/AppBar'
import IconButton from '../components/paradym/IconButton'
import IconButtonMenu from '../components/paradym/IconButtonMenu'
import Sidebar from '../components/paradym/Sidebar'
import Snackbar from '../components/paradym/Snackbar'
import DialogManualTimeEntry from '../components/pmc/DialogManualTimeEntry'
import vuetify from '~/plugins/vuetify'

export default {
  name: 'LayoutDefault',
  components: {
    AppBar,
    IconButton,
    IconButtonMenu,
    Sidebar,
    Snackbar,
    DialogManualTimeEntry,
    vuetify
},
  async created() {
    // Restore logged in user data from local storage if need be
    if (process.client && !this.$auth.user.hasOwnProperty('id')) {
      let user = this.$auth.$storage.getLocalStorage('user')
      if (user)
        this.$auth.setUser(user)
    }
  },
  mounted() {
    this.userItems[0].title = this.$auth.$state.user.fullname
  },
  data() {
    return {
      drawer: false,
      settings: false,
      showManualTimeEntry: false,
      items: [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard-outline',
          iconSelected: 'mdi-view-dashboard',
          to: '/'
        },
        {
          title: 'Work Orders',
          icon: 'mdi-animation-outline',
          iconSelected: 'mdi-animation',
          to: '/workorders'
        },
      ],
      userItems: [

        {
          // title: this.$auth.$state.user?.fullname,
          //to: '/account',
          icon: 'mdi-account-circle'
        },
        {
          title: 'Time Entries',
          to: '/timeEntries',
          icon: 'mdi-bell'
        },
        {
          title: 'Sign Out',
          to: '/logout',
          icon: 'mdi-logout'
        }
      ]
    }
  },
  computed: {
    ...mapState(['hideNav']),
    ...mapState({ snackbar: state => state.snackbar }),
    ...mapState('workOrders', ['personalQueue', 'generalQueue', 'routineQueue']),
    activeInQueue() {
      let result = []
      this.personalQueue.forEach(wo => {
        if (wo.JobStatus == 'Active')
          result.push(wo)
      })
      return result
    },
    pausedInQueue() {
      let result = []
      this.personalQueue.forEach(wo => {
        if (wo.JobStatus != 'Active')
          result.push(wo)
      })
      return result
    },
  },
  methods: {
    ...mapMutations('snackbar', ['setBusy']),
    ...mapActions('workOrders', ['loadData']),
    ...mapActions('snackbar', { showSuccess: 'success', showError: 'error', showBusy: 'busy' }),
    async addTimeEntry(timeEntry) {
      console.log('adding time entry')
      console.log(timeEntry)
      if (!timeEntry.twonumber) {
        try {
          let te = JSON.parse(JSON.stringify(timeEntry))
          console.log('date is ' + te.tedate)
          //te.tdate = moment(te.tdate).format('YYYY-MM-DD')
          console.log('date is now' + te.tedate)

          te.userid = this.$auth.user.uniqueID
          let addedEntry = await this.$axios.$post('/api/timeEntries', te)
          if (addedEntry) {
            this.showSuccess(`Time Entry Added.`)
            this.loadData(this.$auth.user.user)
            this.showManualTimeEntry = false
          }
        } catch (err) {
          this.showError('Error adding time entry.')
        }
      } else {
        try {
          // Check that work order exists
          let woNum = parseInt(timeEntry.twonumber)
          if (woNum != NaN) {
            let result = await this.$axios.$get(`/api/workOrders/${woNum}`)
            if (result && result.WOID) {
              let te = JSON.parse(JSON.stringify(timeEntry))
              te.woid = result.WOID
              te.userid = this.$auth.user.uniqueID
              let addedEntry = await this.$axios.$post('/api/timeEntries', te)
              if (addedEntry) {
                this.showSuccess(`Time Entry Added.`)
                this.loadData(this.$auth.user.user)
                this.showManualTimeEntry = false
              }
            }
          }
        } catch (err) {
          this.showError('Error adding time entry.')
        }
      }
    }
  }
}
</script>
