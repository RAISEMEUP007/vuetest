<template>
  <v-tooltip left color="#333333">
    <template v-slot:activator="{ on, attrs }">
      <v-fab-transition appear>
        <v-btn :color="color" fixed bottom right fab class="mr-4 mb-4" @click="$emit('click')" v-bind="attrs" v-on="on">
          <v-icon large>{{ icon }}</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'FloatingButton',
  props: {
    text: {
      type: String,
      default: 'Add'
    },
    icon: {
      type: String,
      default: 'mdi-plus'
    },
    color: String,
  },
}
</script>
