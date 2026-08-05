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

<style scoped>
.table-wrapper {
  margin: 15px 0;
  overflow-x: auto;
}

.smart-table {
  border-collapse: collapse;
  margin: 0 auto;
  font-family: 'Courier New', monospace;
  background: var(--bg-card, rgba(255, 255, 255, 0.02));
  border-radius: 8px;
  overflow: hidden;
  width: auto;
  min-width: 200px;
}

.smart-table th,
.smart-table td {
  border: 1px solid var(--border-color, #444);
  padding: 8px 16px;
  text-align: center;
  min-width: 30px;
}

.smart-table th {
  background: rgba(255, 69, 0, 0.12);
  color: #ff8c5a;
  font-weight: 700;
  font-size: 0.9rem;
}

.smart-table td {
  color: var(--text-primary, #f0e0d0);
  font-size: 0.95rem;
}

.smart-table td:empty {
  opacity: 0.3;
}

/* Для светлой темы */
[data-theme="light"] .smart-table {
  background: #f8f4f0;
}

[data-theme="light"] .smart-table td {
  color: #1a0e08;
}

[data-theme="light"] .smart-table th {
  background: rgba(255, 69, 0, 0.08);
  color: #cc3700;
}

[data-theme="light"] .smart-table td,
[data-theme="light"] .smart-table th {
  border-color: #ccc;
}
</style>