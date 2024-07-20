<template>
  <Page :title="title">
    <ServerDataTable ref="serverDataTable" :endpoint="endpoint" :name="name"
      :dataTypes="{ createdAt: Date, updatedAt: Date }" @edit="editItem" />
    <FloatingButton @click="itemToEdit = null; dialog = true" color="secondary" />
    <Dialog v-model="dialog" :title="addText" max-width="800" hideButtons>
      <FormGenerator :fields="fields" :values="itemToEdit" :buttonText="addText" @cancel="dialog = false" @submit="addUpdateItem" />
    </Dialog>
  </Page>
</template>

<script>
export default {
  name: 'pageResource',
  props: {
    title: String,
    name: String,
    endpoint: String,
    fields: [Object, Array],
  },
  data() {
    return {
      dialog: false,
      itemToEdit: null,
    }
  },
  computed: {
    addText() {
      if (typeof itemToEdit == 'object') {
        if (Object.keys(this.itemToEdit).length > 0)
          return this.name ? 'Update ' + this.name : 'Update Item'
        else
          return this.name ? 'Add ' + this.name : 'Add Item'
      }
    },
  },
  methods: {
    editItem(item) {
      this.itemToEdit = JSON.parse(JSON.stringify(item))
      this.dialog = true
    },
    async addUpdateItem(data) {
      this.dialog = false
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          delete data[key]
        }
      })
      delete data.updatedAt
      delete data.createdAt
      try {
        let response = await this.$axios.$post(this.endpoint, data)
        this.$refs.serverDataTable.$fetch()
      } catch (err) {
      }
    }
  }
}
</script>
