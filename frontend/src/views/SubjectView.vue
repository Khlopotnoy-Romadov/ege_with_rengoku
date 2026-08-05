<template>
  <FlameBackground>
    <div class="subject-view">
      <div class="view-header">
        <button class="btn-back" @click="$router.push('/')">← 戻る (Назад)</button>
        <ThemeToggle />
      </div>

      <h2 class="subject-title">{{ loading ? 'Загрузка...' : (subjectData?.name || 'Предмет не найден') }}</h2>

      <!-- Состояние загрузки -->
      <div v-if="loading" class="loading">🔥 Загрузка...</div>

      <!-- Список тем (вариантов) -->
      <div v-else-if="!currentTopic && subjectData?.topics?.length" class="topics-list">
        <div
          v-for="topic in subjectData.topics"
          :key="topic.id"
          class="topic-card"
        >
          <div class="topic-info">
            <h3>🔥 {{ topic.name }}</h3>
            <p>{{ topic.description || 'Пламенная тренировка!' }}</p>
            <span class="question-count">{{ topic.questions?.length || 0 }} заданий</span>
          </div>
          <div class="topic-actions">
            <!-- Кнопка "Пройти" -->
            <button class="btn-start" @click="startTopic(topic)">⚔️ Пройти</button>
            <!-- Кнопка "Просмотреть вариант" -->
            <router-link
              :to="`/subject/${$route.params.slug}/full/${topic.id}`"
              class="btn-view"
            >
              📄 Просмотреть вариант
            </router-link>
          </div>
        </div>
      </div>

      <!-- Компонент прохождения теста -->
      <TestRunner
        v-else-if="currentTopic"
        :topic="currentTopic"
        @finish="finishTopic"
      />

      <!-- Если предмет не найден -->
      <div v-else-if="!loading && !subjectData" class="empty">
        <p>📭 Предмет не найден</p>
      </div>

      <!-- Если нет тем -->
      <div v-else-if="!loading && subjectData?.topics?.length === 0" class="empty">
        <p>📭 В этом предмете пока нет тем</p>
      </div>
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
  inject: ['mentor'],
  data() {
    return {
      subjectData: null,      // ← теперь null, а не {}
      currentTopic: null,
      loading: true
    };
  },
  async created() {
    const slug = this.$route.params.slug;
    try {
      this.loading = true;
      const data = await fetchSubject(slug);
      this.subjectData = data;
    } catch (error) {
      console.error('Ошибка загрузки предмета:', error);
      this.subjectData = null;
    } finally {
      this.loading = false;
    }
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
  color: var(--text-primary, #f0e0d0);
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-back {
  background: var(--button-bg, rgba(255, 69, 0, 0.1));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.2));
  color: var(--text-secondary, #ffa07a);
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
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.25);
}

.subject-title {
  font-size: 2.8rem;
  margin: 30px 0 40px;
  text-align: center;
  text-shadow: 0 0 40px rgba(255, 69, 0, 0.15);
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
  padding: 20px 25px;
  box-shadow: 0 2px 20px var(--shadow-color, rgba(0, 0, 0, 0.2));
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease, transform 0.3s ease;
}

.topic-card:hover {
  background: var(--bg-card-hover, rgba(40, 16, 8, 0.9));
  transform: translateX(8px);
}

.topic-info {
  flex: 1;
  cursor: default;
}

.topic-info h3 {
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #ff8c5a;
}

.topic-info p {
  color: var(--text-secondary, #d4a088);
  margin-bottom: 5px;
}

.question-count {
  display: inline-block;
  background: var(--button-bg, rgba(255, 69, 0, 0.12));
  padding: 3px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #ff8c00;
}

.topic-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  margin-top: 10px;
}

.btn-start,
.btn-view {
  padding: 8px 18px;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-start {
  background: linear-gradient(135deg, #ff4500, #cc3700);
  color: #fff;
}

.btn-start:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.3);
}

.btn-view {
  background: var(--button-bg, rgba(255, 255, 255, 0.08));
  color: var(--text-secondary, #ffa07a);
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.2));
}

.btn-view:hover {
  background: rgba(255, 69, 0, 0.15);
  transform: scale(1.05);
}

.loading, .empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary, #d4a088);
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .subject-title {
    font-size: 2rem;
  }

  .topic-card {
    flex-direction: column;
    align-items: stretch;
  }

  .topic-actions {
    justify-content: stretch;
  }

  .btn-start,
  .btn-view {
    flex: 1;
    justify-content: center;
  }
}
</style>