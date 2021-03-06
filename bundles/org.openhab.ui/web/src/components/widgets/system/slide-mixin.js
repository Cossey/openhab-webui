export default {
  data () {
    return {
      pendingCommand: null
    }
  },
  mounted () {
    delete this.config.value

    this.updateInterval = this.config.updateInterval ? this.config.updateInterval : 200
    this.delayStateDisplay = this.config.delayStateDisplay ? this.config.delayStateDisplay : 2000
  },
  computed: {
    value () {
      if (this.config.variable) return this.context.vars[this.config.variable]
      if (this.pendingCommand) return this.pendingCommand // to keep the control reactive when operating
      const value = this.context.store[this.config.item].state
      // use as a brightness control for HSB values
      if (value.split && value.split(',').length === 3) return parseFloat(value.split(',')[2])
      return parseFloat(value)
    }
  },
  methods: {
    sendCommandDebounced (value, stop = false) {
      if ((value === this.value && !stop) || value === this.lastValueSent) return

      if (this.config.variable) {
        this.$set(this.context.vars, this.config.variable, value)
        return
      }

      if (!this.config.item) return

      this.pendingCommand = value
      let diff = this.lastDateSent ? Date.now() - this.lastDateSent : this.updateInterval
      let delay = diff < this.updateInterval ? this.updateInterval - diff : stop ? 0 : this.updateInterval

      if (this.sendCommandTimer && stop) {
        clearTimeout(this.sendCommandTimer)
        this.sendCommandTimer = null
      }
      if (!this.sendCommandTimer) {
        if (this.displayLockTimer) clearTimeout(this.displayLockTimer)
        this.sendCommandTimer = setTimeout(() => {
          this.$store.dispatch('sendCommand', { itemName: this.config.item, cmd: this.pendingCommand.toString() })
          this.lastValueSent = this.pendingCommand
          this.lastDateSent = Date.now()
          this.sendCommandTimer = null

          // keep displaying `pendingCommand` as value for `delayStateDisplay` time to give sse state some time to update
          this.displayLockTimer = setTimeout(() => { this.pendingCommand = null }, this.delayStateDisplay)
        }, delay)
      }
    }
  }
}
