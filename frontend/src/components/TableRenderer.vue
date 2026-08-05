<template>
  <div v-if="tableData" class="table-wrapper">
    <table class="smart-table">
      <thead v-if="tableData.headers">
        <tr>
          <th v-for="(header, index) in tableData.headers" :key="index">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData.rows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">
            {{ cell || ' ' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TableRenderer',
  props: {
    tableData: {
      type: Object,
      default: null,
      validator: function(value) {
        if (!value) return true;
        return value.headers && Array.isArray(value.headers) && 
               value.rows && Array.isArray(value.rows);
      }
    }
  }
};
</script>
