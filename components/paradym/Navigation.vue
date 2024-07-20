<template>
  <v-navigation-drawer v-if="!hidden" :value="this.isMobile ? this.drawer : true" @input="(e) => { if (this.isMobile) drawer = e }" :mini-variant="isMobile ? ($vuetify.breakpoint.width > breakpoint) ? true : false : drawer" mini-variant-width="76" floating clipped fixed :app="app" width="225" :mobile-breakpoint="breakpoint" class="pt-1">
    <slot name="header" :isMobile="isMobile" :drawer="drawer" :breakpoint="breakpoint"></slot>
    <v-list shaped>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact @click="onNavClick" :color="color">
        <v-tooltip right :disabled="isMobile ? true : !drawer" nudge-right="8" color="#555555">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-action class="pl-2 mr-4" v-bind="attrs" v-on="on">
              <v-icon>{{ $nuxt.$route.path != item.to ? item.icon : item.iconSelected }}</v-icon>
            </v-list-item-action>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'navigation',
  props: {
    items: {
      type: Array,
      default: () => { return [] },
    },
    value: Boolean,
    hidden: Boolean,
    breakpoint: {
      type: Number,
      default: 640,
    },
    color: {
      type: String,
      default: 'undefined',
    },
    app: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      drawer: this.value,
    }
  },
  watch: {
    value(newValue) {
      this.drawer = newValue
    },
    drawer(newValue) {
      this.$emit('input', newValue)
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xs
    },
  },
  methods: {
    onNavClick() {
      if (this.isMobile)
        this.drawer = false
    },
  }
}
</script>

<style lang="scss">
</style>
