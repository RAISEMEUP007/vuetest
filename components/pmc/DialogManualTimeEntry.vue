<template>
  <Dialog v-model="dialog" :title="dialogTitle" max-width="700" noPadding>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <!-- Date -->
          <DateInput v-model="timeEntry.tdate" autocomplete="false" label="Date" textType />
        </v-col>
        <v-col cols="12" md="6">
          <!-- WO # -->
          <v-text-field v-model="timeEntry.twonumber" label="WO#" class="mb-4" color="primary"
            outlined dense hide-details="auto" autocomplete="false" :rules="[rules.max150]" validate-on-blur />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <!-- Description -->
          <v-text-field v-model="timeEntry.tdescription" label="Description" class="mb-4" color="primary"
            outlined dense hide-details="auto" autocomplete="false" :rules="[rules.max300]" validate-on-blur />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <!-- Tenant -->
          <v-text-field v-model="timeEntry.ttenant" label="Tenant" class="mb-4" color="primary"
            outlined dense hide-details="auto" autocomplete="false"  :rules="[rules.max50]" validate-on-blur />
        </v-col>
        <v-col cols="12" md="4">
          <!-- Building -->
          <v-text-field v-model="timeEntry.tbuilding" label="Building #" class="mb-4" color="primary"
            outlined dense hide-details="auto" autocomplete="false" :rules="[rules.max50]" validate-on-blur />
        </v-col>
        <v-col cols="12" md="4">
          <!-- Hours -->
          <v-text-field :value="calculatedHours" label="Hours" class="mb-4" color="primary" disabled
            outlined dense hide-details="auto" autocomplete="false" :rules="[rules.max5]" validate-on-blur />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <!-- Start Time -->
          <TimeInput v-model="startTime" label="Start Time" />
        </v-col>
        <v-col cols="12" md="6">
          <!-- End Time -->
          <TimeInput v-model="endTime" label="End Time" />
        </v-col>
      </v-row>
    </v-container>

    <template v-slot:actions>
      <v-btn text @click="cancel">Cancel</v-btn>
      <v-btn text color="primary" @click="addTimeEntry">{{ buttonText }}</v-btn>
    </template>

  </Dialog>
</template>

<script>
import moment from 'moment'
import Dialog from '../paradym/Dialog'
import TimeInput from '../paradym/TimeInput'
import DateInput from '../paradym/DateInput'

export default {
  name: 'DialogManualTimeEntry',
  components: {
    Dialog,
    TimeInput,
    DateInput
  },
  props: {
    value: Boolean,
    entry: Object,
  },
  created() {
    if (this.entry) {
      this.editing = true
      Object.assign(this.timeEntry, this.entry)
      this.startTime = moment(this.entry.starttime).format('HH:mm')
      this.endTime = moment(this.entry.endtime).format('HH:mm')
      console.log("DATE VALUE",moment(this.entry.tdate).format('YYYY-MM-DD'));
      // this.date = moment(this.entry.tdate).format('YYYY-MM-DD')
      this.date = moment(this.entry.tdate)
    } else
      this.resetTimeEntry()
  },
  data() {
    return {
      dialog: false,
      timeEntry: {},
      date: null,
      startTime: null,
      endTime: null,
      editing: false,
      rules: {
        required: value => !!value || 'Required.',
        max5: v => v == null || v.length <= 5 || 'Max 5 characters.',
        max50: v => v == null || v.length <= 50 || 'Max 50 characters.',
        max150: v => v == null || v.length <= 150 || 'Max 150 characters.',
        max300: v => v == null || v.length <= 300 || 'Max 150 characters.',
      },
    }
  },
  computed: {
    dialogTitle() {
      if (this.editing)
        return 'Edit Time Entry'
      else
        return 'Manual Time Entry'
    },
    buttonText() {
      if (this.editing)
        return 'Update Time Entry'
      else
        return 'Add New Time Entry'
    },
    calculatedHours() {
      if (this.startTime && this.endTime) {
        let date = moment(this.timeEntry.tdate).format('YYYY-MM-DD')
        let startTime = moment(date + ' ' + this.startTime, 'YYYY-MM-DD H:mm')
        let endTime = moment(date + ' ' + this.endTime, 'YYYY-MM-DD  H:mm')
        console.log('((((((*****************))))))!');
        console.log(startTime);
        console.log(startTime.format())
        console.log(endTime.format())
        let diffInMinutes = endTime.diff(startTime, 'minutes')
        console.log(diffInMinutes)
        if (diffInMinutes >= 5) {
          let total15MinIncrements = parseInt(diffInMinutes / 15)
          let extraMinutes = diffInMinutes % 15
          let totalMinutes = total15MinIncrements * 15
          if (extraMinutes >= 5)
            totalMinutes += 15
          console.log(totalMinutes / 60)
          return totalMinutes / 60
        } else
          return 0
      } else
        return 0
    }
  },
  watch: {
    value(newValue) {
      this.dialog = newValue
      if (newValue == false)
        this.resetTimeEntry()
    },
    dialog(newValue) {
      this.$emit('input', newValue)
      if (newValue == false)
        this.cancel()
    },
    entry(newValue) {
      if (newValue) {
        console.log('new entry', { newValue })
        this.editing = true
        this.resetTimeEntry()
        Object.assign(this.timeEntry, newValue)
        this.startTime = moment(newValue.starttime).format('HH:mm')
        this.endTime = moment(newValue.endtime).format('HH:mm')
        this.date = moment(newValue.date).format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    resetTimeEntry() {
      this.timeEntry = {
        tdate: '',
        tdescription: '',
        twonumber: '',
        ttenant: '',
        tbuilding: '',
        thours: '',
        starttime: null,
        endtime: null,
      }
    },
    addTimeEntry() {
      if (this.calculatedHours > 0 && this.timeEntry.tdate) {
        console.log("In Add Time Entry");
        let timeEntryToSubmit = {}
        Object.assign(timeEntryToSubmit, this.timeEntry)
        // timeEntryToSubmit.tdate = moment(this.date).format('YYYY-MM-DD')
        timeEntryToSubmit.thours = this.calculatedHours
        timeEntryToSubmit.starttime = moment(timeEntryToSubmit.tdate + ' ' + this.startTime).format()
        timeEntryToSubmit.endtime = moment(timeEntryToSubmit.tdate + ' ' + this.endTime).format()
        console.log('submitting time entry', { timeEntryToSubmit })
        this.$emit('submit', timeEntryToSubmit)
      }
    },
    cancel() {
      this.resetTimeEntry()
      this.startTime = null
      this.endTime = null
      this.dialog = false
    }
  }
}
</script>
