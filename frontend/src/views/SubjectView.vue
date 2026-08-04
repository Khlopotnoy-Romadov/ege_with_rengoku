<template>
  <FlameBackground>
    <div class="subject-view">
      <div class="view-header">
        <button class="btn-back" @click="$router.push('/')">← 戻る (Назад)</button>
        <ThemeToggle />
      </div>
      
      <h2 class="subject-title">{{ subjectData.name }}</h2>
      
      <div v-if="!currentTopic" class="topics-list">
        <div 
          v-for="topic in subjectData.topics" 
          :key="topic.id"
          class="topic-card"
          @click="startTopic(topic)"
        >
          <div class="topic-info">
            <h3>🔥 {{ topic.name }}</h3>
            <p>{{ topic.description || 'Пламенная тренировка!' }}</p>
            <span class="question-count">{{ topic.questions.length }} вопросов</span>
          </div>
        </div>
      </div>

      <TestRunner 
        v-else
        :topic="currentTopic"
        @finish="finishTopic"
      />
    </div>
  </FlameBackground>
</template>

<script>
import { fetchSubject } from '@/api/subject';
import FlameBackground from '@/components/FlameBackground.vue';
import TestRunner from '@/components/TestRunner.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

export default {
  name: 'SubjectView',
  components: { FlameBackground, TestRunner, ThemeToggle },
  data() {
    return {
      subjectData: { topics: [], name: '' },
      currentTopic: null
    };
  },
  async created() {
    const slug = this.$route.params.slug;
    this.subjectData = await fetchSubject(slug);
  },
  methods: {
    startTopic(topic) {
      this.currentTopic = topic;
    },
    finishTopic() {
      this.currentTopic = null;
    }
  }
};
</script>

<style scoped>
.subject-view {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: var(--text-primary);
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-back {
  background: var(--button-bg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 10px 25px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s;
  font-weight: 600;
}

.btn-back:hover {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.3);
}

.subject-title {
  font-size: 2.8rem;
  margin: 30px 0 40px;
  text-align: center;
  text-shadow: 0 0 40px rgba(255, 69, 0, 0.2);
  background: linear-gradient(135deg, #ff6a33, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topic-card {
  background: var(--topic-bg, rgba(20, 8, 4, 0.8));
  backdrop-filter: blur(4px);
  border-left: 6px solid #ff4500;
  border-radius: 12px;
  padding: 25px 30px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 20px var(--shadow-color, rgba(0,0,0,0.3));
}

.topic-card:hover {
  background: var(--bg-card-hover, rgba(40, 16, 8, 0.9));
  transform: translateX(12px);
  box-shadow: 0 0 40px rgba(255, 69, 0, 0.15);
}

.topic-info h3 {
  font-size: 1.6rem;
  margin-bottom: 8px;
  color: #ff8c5a;
}

.topic-info p {
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.question-count {
  display: inline-block;
  background: var(--button-bg);
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #ff8c00;
}
</style>