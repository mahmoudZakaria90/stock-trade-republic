<template>
  <div class="data-item" :class="['className', isHigher ? 'up' : 'down']">
    <p class="data-item-title">{{className}}:</p>
    <p
      class="data-warning"
      v-if="isNewIsinSelected"
    >Warning! new organization has been selected, please hit 'Subscribe' to update.</p>
    <span>{{value}}</span>
    <div>{{difference}}</div>
  </div>
</template>

<script>
export default {
  name: "DataItem",
  data() {
    return {
      isHigher: null,
      difference: null
    };
  },
  props: {
    value: Number,
    className: String,
    isNewIsinSelected: Boolean
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal > oldVal) {
        this.isHigher = true;
        return;
      }
      this.isHigher = false;
      this.difference = newVal - oldVal;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.data
  &-item
    flex: 1 0
    margin-bottom: 30px
    & > span
      font-weight: 600
    &-title
      text-transform: capitalize
    &.price
      flex-basis: 100%
    &.up
      background-color: green
    &.down
      background-color: lightcoral
  &-warning
    color: red
</style>
