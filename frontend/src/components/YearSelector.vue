<template>
  <div class="year-selector">
    <button
      v-for="year in availableYears"
      :key="year"
      class="year-btn"
      :class="{ active: selectedYear === year }"
      @click="$emit('select', year)"
    >
      {{ year }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'YearSelector',
  props: {
    availableYears: {
      type: Array,
      required: true
    },
    selectedYear: {
      type: Number,
      required: true
    }
  }
};
</script>