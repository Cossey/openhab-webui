<template>
  <f7-card>
    <f7-card-content v-if="item.metadata && Object.keys(item.metadata).filter((n) => n !== 'semantics').length > 0">
      <f7-list>
        <ul>
          <f7-list-item
            v-for="namespace in metadataNamespaces.filter((n) => item.metadata[n.name])" :key="namespace.name"
            :link="'/settings/items/' + item.name + '/metadata/' + namespace.name"
            :title="namespace.label"
            :after="(item.metadata[namespace.name]) ? item.metadata[namespace.name].value : 'Not Set'" />
        </ul>
      </f7-list>
    </f7-card-content>
    <f7-card-footer>
      <f7-button color="blue" @click="addMetadata">
        Add Metadata
      </f7-button>
    </f7-card-footer>
  </f7-card>
</template>

<script>
import MetadataNamespaces from '@/assets/definitions/metadata/namespaces.js'

export default {
  props: ['item'],
  data () {
    return {
      metadataNamespaces: MetadataNamespaces
    }
  },
  methods: {
    editCustomMetadata () {
      this.$f7.dialog.prompt('Please type in the namespace you would like to edit:',
        'Edit Custom Metadata',
        (namespace) => {
          if (namespace) this.$f7.views.main.router.navigate('/settings/items/' + this.item.name + '/metadata/' + namespace)
        })
    },
    addMetadata () {
      this.$f7.actions.create({
        buttons: [
          [
            { label: true, text: 'Well-known namespaces' },
            ...MetadataNamespaces.map((n) => {
              return {
                text: n.label,
                color: 'blue',
                onClick: () => {
                  this.$f7router.navigate('/settings/items/' + this.item.name + '/metadata/' + n.name)
                }
              }
            })
          ],
          [
            { label: true, text: 'Custom namespaces' },
            { color: 'blue', text: 'Enter Custom Namespace...', onClick: this.editCustomMetadata }
          ],
          [
            { color: 'red', text: 'Cancel', close: true }
          ]
        ]
      }).open()
    }
  }
}
</script>
