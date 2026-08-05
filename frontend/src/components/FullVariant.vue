<template>
  <FlameBackground>
    <div class="full-variant">
      <div class="view-header">
        <button class="btn-back" @click="$router.back()">← 戻る (Назад)</button>
        <ThemeToggle />
      </div>

      <h2 class="variant-title">{{ topic?.name || 'Вариант' }}</h2>
      <p class="variant-desc">{{ topic?.description || '' }}</p>

      <div v-if="loading" class="loading">🔥 Загрузка...</div>

      <div v-else-if="topic && topic.questions" class="questions-list">
        <div
          v-for="(q, index) in topic.questions"
          :key="q.id"
          class="question-card"
        >
          <div class="question-header">
            <span class="question-number">Задание №{{ q.number || index + 1 }}</span>
            <span v-if="q.type" class="question-type">{{ q.type }}</span>
            <span
              v-if="q.difficulty"
              class="question-difficulty"
              :class="q.difficulty"
            >
              {{ q.difficulty === 'easy' ? '🟢' : q.difficulty === 'medium' ? '🟡' : '🔴' }}
            </span>
          </div>

          <!-- Изображение -->
          <div v-if="q.media && q.media.type === 'image'" class="media-container">
            <img :src="q.media.url" :alt="q.media.description || 'Схема'" />
            <p v-if="q.media.description" class="media-caption">
              {{ q.media.description }}
            </p>
          </div>

          <p class="question-text">{{ q.text }}</p>

          <!-- Файл -->
          <div v-if="q.media && q.media.type === 'file'" class="media-file">
            <a :href="q.media.url" target="_blank" class="btn-download">
              📥 Скачать файл
            </a>
          </div>

          <div class="question-answer">
            <span class="answer-label">✅ Правильный ответ: </span>
            <span class="answer-value">{{ q.correctAnswer }}</span>
          </div>

          <div v-if="q.hint" class="hint">
            💡 Подсказка: {{ q.hint }}
          </div>
        </div>
      </div>

      <div v-else-if="!loading && !topic" class="empty">
        <p>📭 Вариант не найден</p>
      </div>
    </div>
  </FlameBackground>
</template>

<script>
import { fetchSubject } from '@/api/subject';
import FlameBackground from '@/components/FlameBackground.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

export default {
  name: 'FullVariant',
  components: { FlameBackground, ThemeToggle },
  data() {
    return {
      topic: null,
      loading: true
    };
  },
  async created() {
    const slug = this.$route.params.slug;
    const topicId = this.$route.params.topicId;
    try {
      const data = await fetchSubject(slug);
      this.topic = data.topics.find(t => t.id === topicId) || null;
    } catch (error) {
      console.error('Ошибка загрузки варианта:', error);
      this.topic = null;
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.full-variant {
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
}

.variant-title {
  font-size: 2.4rem;
  margin: 20px 0 5px;
  background: linear-gradient(135deg, #ff6a33, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.variant-desc {
  color: var(--text-secondary, #d4a088);
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.8;
}

.loading, .empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary, #d4a088);
  font-size: 1.2rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.question-card {
  background: var(--bg-card, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.1));
  border-radius: 16px;
  padding: 25px;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.question-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.question-number {
  font-weight: 700;
  color: #ff8c5a;
  font-size: 1.1rem;
}

.question-type {
  background: rgba(255, 69, 0, 0.12);
  color: #ff8c5a;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.question-difficulty {
  font-size: 1.1rem;
}

.question-text {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--text-primary, #f0e0d0);
  margin: 10px 0;
}

.media-container {
  margin: 10px 0;
  text-align: center;
}

.media-container img {
  max-width: 100%;
  border-radius: 8px;
}

.media-caption {
  color: var(--text-muted, #888);
  font-size: 0.9rem;
  margin-top: 5px;
}

.media-file {
  margin: 10px 0;
}

.btn-download {
  display: inline-block;
  padding: 8px 18px;
  background: var(--button-bg, rgba(255, 69, 0, 0.1));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.2));
  border-radius: 8px;
  color: var(--text-secondary, #ffa07a);
  text-decoration: none;
  transition: 0.3s;
  font-weight: 600;
}

.btn-download:hover {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
}

.question-answer {
  margin: 15px 0 5px;
  padding: 10px 14px;
  background: rgba(0, 204, 102, 0.06);
  border-radius: 8px;
  border-left: 3px solid #66ff99;
}

.answer-label {
  color: var(--text-secondary, #aaa);
  font-weight: 600;
}

.answer-value {
  color: #66ff99;
  font-weight: 700;
  font-size: 1.05rem;
}

.hint {
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(255, 69, 0, 0.05);
  border-radius: 8px;
  color: #ffb08a;
  font-style: italic;
  border-left: 3px solid #ff4500;
}

@media (max-width: 768px) {
  .variant-title {
    font-size: 1.8rem;
  }
  .question-card {
    padding: 18px;
  }
  .question-text {
    font-size: 1rem;
  }
}
</style>