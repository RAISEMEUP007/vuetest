<template lang="html">
  <div class="wo-queue">
    <v-card hover ripple outlined rounded  v-for="(wo, index) in wos" :key="`wo-${index}`" class="mb-2" @click="$emit('select', wo)">
      <div class="d-flex">
        <v-sheet class="wo-queue-color" :color="wo.colorcode.substr(0,7)" style="min-width: 8px;">
          &nbsp;
        </v-sheet>
        <div class="flex-grow-1">
          <v-card-title class="pt-2 pb-0">
            <span class="mr-4">WO#{{ wo.WorkOrderNumber }}</span>
            <span class="text-caption font-weight-bold grey--text text--darken-3">{{ wo.Tenant }}</span>
          </v-card-title>
          <v-card-text class="pb-2 text-caption">
            {{ wo.DescriptionofWorkProblem }}
          </v-card-text>
        </div>
        <v-card-actions>
          <v-btn large icon @click="$emit('select', wo)"><v-icon large>mdi-plus</v-icon></v-btn>
        </v-card-actions>
      </div>
    </v-card>

  </div>
</template>

<script>
export default {
  name: 'WorkOrderQueue',
  props: {
    wos: Array,
  }
}
</script>

<style lang="scss">
.wo-queue-color {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.v-sheet.v-card--hover:hover, .v-sheet.v-card--hover:focus {
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
}
</style>
