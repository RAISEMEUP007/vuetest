<template>
  <v-app-bar :app="app" clipped-left flat :dark="dark" :color="color">
    <v-app-bar-nav-icon v-if="hasMenuClickHandler" @click.stop="$emit('menuClick')" />
    <v-toolbar-title v-if="title || logo" class="mx-1 pl-0">
      <n-link to="/" class="d-flex align-center">
        <img v-if="logo" :src="logo" height="50px" :alt="title" class="mr-2" />
        <span v-if="title">{{ title }}</span>
      <!-- </div> -->
      </n-link>
    </v-toolbar-title>
    <v-spacer />
    <slot></slot>
  </v-app-bar>
</template>

<script>
export default {
  name: 'appBar',
  props: {
    dark: {
      type: Boolean,
      default: undefined,
    },
    color: {
      type: String,
      default: undefined,
    },
    title: String,
    logo: String,
    app: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    hasMenuClickHandler() {
      return !!(this.$listeners && this.$listeners.menuClick)
    }
  }
}
</script>

<style lang="scss">
.v-toolbar__title a {
  text-decoration: none;
  color: unset !important;
}
</style>
