<!-- Paradym Component
  Name:     TimeInput
  Version:  0.12
-->

<template>
  <v-menu v-model="menuTime" offset-y min-width="auto"
    :close-on-content-click="false" transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field v-model="time" :label="label"  v-bind="attrs" v-on="on"
        type="time" :disabled="disabled" clearable outlined :dense="!large"
        :hide-details="hideDetails ? true : 'auto'"  :prepend-inner-icon="icon ? 'mdi-clock' : undefined"
        :rules="required ? [rules.required] : []" validate-on-blur
      />
    </template>
    <v-time-picker v-model="time" scrollable ampm-in-title
      @change="menuTime = false" @update:period="menuTime = false" />
  </v-menu>
</template>

<script>
export default {
  name: 'TimeInput',
  props: {
    value: String,
    label: String,
    disabled: Boolean,
    required: Boolean,
    large: Boolean,
    icon: Boolean,
    hideDetails: Boolean,
  },
  data() {
    return {
      time: this.value,
      menuTime: false,
      rules: {
        required: value => !!value || 'Required.',
      }
    }
  },
  watch: {
    value(newValue) {
      this.time = newValue
    },
    time(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style type="scss">
input::-webkit-calendar-picker-indicator {
    display: none;
}
input[type="time"]::-webkit-input-placeholder{
  visibility: hidden !important;
}
</style>
