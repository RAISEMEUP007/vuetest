<template lang="html">
  <div class="time-entries">
    <h2 class="text-h6 font-weight-bold text-uppercase primary--text mb-1">Time Entries</h2>
    <client-only>
    <v-simple-table dense v-if="entries.length">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left pr-2">User</th>
            <th class="text-left pr-2">Date</th>
            <th class="text-left pr-2">Start</th>
            <th class="text-left pr-2">Stop</th>
            <th class="text-left pr-2">Hours</th>
            <th class="text-left pr-2">Description</th>
            <th class="text-left pr-2">&nbsp;</th>
            <th class="text-left pr-2" style="width: 100%;">&nbsp;</th>
          </tr>
        </thead>
        <tbody style="white-space: nowrap;">
          <tr v-for="(item, index) in entries" :key="`te-${index}`">
            <td class="pr-4">{{ item.User.user }}</td>
            <td class="pr-4">{{ formattedDate(item.tdate) }}</td>
            <td class="pr-4">{{ formattedTime(item.starttime) }}</td>
            <td class="pr-4">{{ formattedTime(item.endtime) }}</td>
            <td class="pr-4">{{ hoursToTimePassed(item.thours) }}</td>
            <td class="pr-4">{{ item.tdescription.substr(0,15) }}</td>
            <td  class="pr-4" style="width: 100%;">
              <div v-if="canDeleteEntry(item)" class="d-flex justify-end">
                <v-btn small icon @click="$emit('edit', item)" class="mr-1"><v-icon small>mdi-pencil</v-icon></v-btn>
                <v-btn small icon @click="$emit('delete', item)"><v-icon small>mdi-close</v-icon></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <p class="text-body-2" v-else>No time entries currently exist.</p>
  </client-only>

  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TimeEntries',
  props: {
    entries: Array
  },
  methods: {
    formattedDate(date) {
      return moment(date).format('M/D')
    },
    formattedTime(date) {
      return moment(date).format('HH:mm')
    },
    hoursToTimePassed(hours) {
      hours = parseFloat(hours)
      let m = hours * 60
      let h = parseInt(m / 60)
      m = m % 60
      if (h)
        return h + 'h ' + m.toFixed(0) + 'm'
      else
        return m.toFixed(0) + 'm'
    },
    canDeleteEntry(te) {
      const WEDNESDAY = 3
      // Only users who made the time entry can delete
      if (te.userid != this.$auth.user.uniqueID)
        return false
      let teDate = moment(te.tdate)
      let teDayOfWeek = teDate.day()  // gets the time entry day of the week (sunday = 0, saturday = 6)
      let expirationDay
      if (teDayOfWeek <= WEDNESDAY)
        expirationDay = moment(te.tdate).isoWeekday(WEDNESDAY)
      else
        expirationDay = moment(te.tdate).add(1, 'weeks').isoWeekday(WEDNESDAY);
      let today = moment()
      if (today.isBefore(expirationDay))
        expirationDay = today
      if (teDate.isSameOrBefore(expirationDay))
        return true
      else
        return false
    }
  }
}
</script>

<style lang="scss">
.time-entries {
  margin: 16px;
  border-radius: 8px;
  background-color: rgba(0,0,0,0.06);
  min-height: 100%;
  padding: 12px 16px;
  table {
    th, td {
      padding: 0 2px !important;
      &:first-of-type {
        padding-left: 16px !important;
      }
      &:last-of-type {
        max-width: 24px;
        padding-right: 0px !important;
      }
    }
  }
}
</style>
