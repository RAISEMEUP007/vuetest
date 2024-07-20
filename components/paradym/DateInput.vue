<!-- Paradym Component
  Name:     DateInput
  Version:  0.14 (added textType prop)
-->

<template>
  <v-menu v-model="menuDate" offset-y min-width="auto"
    :close-on-content-click="false" transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field ref="dateInput" v-model="date" :label="label" v-bind="attrs" v-on="on"
        :type="textType ? 'text' : 'date'" :disabled="disabled" clearable outlined :dense="!large"
        :hide-details="hideDetails ? true : 'auto'" :prepend-inner-icon="icon ? 'mdi-calendar' : undefined"
        :rules="required ? [rules.required] : []" validate-on-blur autocomplete="false"
      />
    </template>
    <v-date-picker v-model="date" no-title scrollable autocomplete="false"
      @change="onPickerDateChange" />
  </v-menu>
</template>

<script>
export default {
  name: 'DateInput',
  props: {
    value: String,
    label: String,
    disabled: Boolean,
    required: Boolean,
    large: Boolean,
    icon: Boolean,
    hideDetails: Boolean,
    textType: Boolean,
  },
  data() {
    return {
      date: this.value,
      menuDate: false,
      rules: {
        required: value => !!value || 'Required.',
      }
    }
  },
  watch: {
    value(newValue) {
      this.date = newValue
    },
    date(newValue) {
      this.$emit('input', newValue)
    }
  },
  methods: {
    onPickerDateChange(e) {
      this.menuDate = false
      if (this.required)
        this.$nextTick(() => { this.$refs.dateInput.validate() })
    }
  }
}
</script>

<style type="scss">
input::-webkit-calendar-picker-indicator {
    display: none;
}
input[type="date"]::-webkit-input-placeholder{
  visibility: hidden !important;
}
</style>
