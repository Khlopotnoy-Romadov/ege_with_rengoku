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