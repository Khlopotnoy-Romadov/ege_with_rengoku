<template>
  <FlameBackground>
    <div class="home-container">
      <header class="anime-header">
        <div class="header-content">
          <div class="header-left">
            <h1>🔥 煉獄さんと EГЭ</h1>
            <p class="subtitle">「心を燃やせ！」 — Сожги своё сердце для экзамена</p>
          </div>
          <div class="header-right">
            <ThemeToggle />
            <router-link to="/admin" class="admin-link">⚙️ Панель управления</router-link>
          </div>
        </div>
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
import ThemeToggle from '@/components/ThemeToggle.vue';

export default {
  name: 'Home',
  components: { FlameBackground, SubjectCard, ThemeToggle },
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
}

.anime-header {
  text-align: center;
  padding: 40px 0 30px;
  border-bottom: 2px solid var(--border-color);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.header-left {
  text-align: left;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.anime-header h1 {
  font-size: 2.8rem;
  font-weight: 700;
  text-shadow: 0 0 30px rgba(255, 69, 0, 0.3);
  background: linear-gradient(45deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-style: italic;
  margin-top: 5px;
  opacity: 0.8;
}

.admin-link {
  padding: 8px 16px;
  background: var(--button-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: 0.3s;
  font-weight: 600;
}

.admin-link:hover {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
}

.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .anime-header h1 {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .header-left {
    text-align: center;
  }
  
  .header-right {
    justify-content: center;
  }
}
</style>