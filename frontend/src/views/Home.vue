<template>
  <FlameBackground>
    <div class="home-container">
      <header class="anime-header">
        <h1>🔥 煉獄さんと EГЭ</h1>
        <p class="subtitle">「心を燃やせ！」 — Сожги своё сердце для экзамена</p>
      </header>

      <div class="subject-grid">
        <SubjectCard
          v-for="subject in subjects"
          :key="subject.id"
          :subject="subject"
          @click="navigateToSubject(subject.slug)"
        />
      </div>
    </div>
  </FlameBackground>
</template>

<script>
import { mapSubjects } from '@/api/subject';
import FlameBackground from '@/components/FlameBackground.vue';
import SubjectCard from '@/components/SubjectCard.vue';

export default {
  name: 'Home',
  components: { FlameBackground, SubjectCard },
  data() {
    return {
      subjects: []
    };
  },
  async created() {
    this.subjects = await mapSubjects();
  },
  methods: {
    navigateToSubject(slug) {
      this.$router.push(`/subject/${slug}`);
    }
  }
};
</script>

<style scoped>
.home-container {
  position: relative;
  z-index: 1;
  color: #fff;
}

.anime-header {
  text-align: center;
  padding: 40px 0 30px;
  border-bottom: 2px solid rgba(255, 69, 0, 0.3);
}

.anime-header h1 {
  font-size: 3.2rem;
  font-weight: 700;
  text-shadow: 0 0 30px rgba(255, 69, 0, 0.5);
  background: linear-gradient(45deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
}

.subtitle {
  color: #ffa07a;
  font-size: 1.2rem;
  font-style: italic;
  margin-top: 10px;
  opacity: 0.8;
}

.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
}
</style>