<template>
  <div class="subject-card">
    <div class="card-content">
      <div class="subject-icon">{{ subject.icon || '📚' }}</div>
      <h3>{{ subject.name }}</h3>
      <div class="flame-decoration"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubjectCard',
  props: {
    subject: {
      type: Object,
      required: true
    }
  }
};
</script>