<template>
  <div class="data-item" :class="className">
    <p class="data-item-title">{{className}}:</p>
    <p
      class="data-warning"
      v-if="isNewIsinSelected"
    >Warning! new organization has been selected, please hit 'Subscribe' to update.</p>
    <span :class="isHigher ? 'up' : 'down'">
      <span class="caret"></span>
      {{value}}
    </span>
    <div>
      <strong>Change:</strong>
      {{difference}}
    </div>
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
      this.difference = newVal - oldVal;
      if (newVal > oldVal) {
        this.isHigher = true;
        return;
      }
      this.isHigher = false;
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
      min-width: 220px
      font-weight: 600
      display: inline-block
      padding: 5px 10px
      border-radius: 5px
      margin-bottom: 10px
      &.up
        background-color: lightgreen
        .caret
          border-bottom-color: black
      &.down
        background-color: lightcoral
        .caret
          border-top-color: black
          top: 7px
    &-title
      text-transform: capitalize
    &.price
      flex-basis: 100%

  &-warning
    color: red

.caret
  position: relative
  display: inline-block
  margin-right: 5px
  width: 0
  height: 0
  border: 7px solid transparent
</style>
