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

          <!-- 1. Текст вопроса -->
          <p class="question-text">{{ q.text }}</p>

          <!-- 2. Таблица -->
          <TableRenderer v-if="q.table" :tableData="q.table" />

          <!-- 3. Изображения (только image) -->
          <div v-if="getImagesList(q).length > 0" class="media-container">
            <div
              v-for="(item, idx) in getImagesList(q)"
              :key="idx"
              class="media-item"
            >
              <div class="media-image">
                <img :src="item.url" :alt="item.description || 'Схема к заданию'" />
                <p v-if="item.description" class="media-caption">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- 4. Файлы для скачивания (только file) -->
          <div v-if="getFilesList(q).length > 0" class="files-container">
            <div
              v-for="(item, idx) in getFilesList(q)"
              :key="idx"
              class="file-item"
            >
              <a
                :href="item.url"
                download
                class="btn-download"
                @click.prevent="downloadFile(item.url)"
              >
                📥 {{ item.description || 'Скачать файл' }}
              </a>
            </div>
          </div>

          <!-- 5. Ответ (скрыт, раскрывается по клику) -->
          <div class="question-answer">
            <button class="btn-reveal-answer" @click="revealed[q.id] = !revealed[q.id]">
              <span class="reveal-icon">{{ revealed[q.id] ? '🙈' : '🔒' }}</span>
              <span class="reveal-text">{{ revealed[q.id] ? 'Скрыть ответ' : 'Показать ответ' }}</span>
            </button>
            <div v-if="revealed[q.id]" class="answer-value">
              ✅ Правильный ответ: <strong>{{ q.correctAnswer }}</strong>
            </div>
          </div>

          <!-- 6. Подсказка -->
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
import TableRenderer from '@/components/TableRenderer.vue';

export default {
  name: 'FullVariant',
  components: { FlameBackground, ThemeToggle, TableRenderer },
  data() {
    return {
      topic: null,
      loading: true,
      revealed: {} // id вопроса → булево значение раскрытия ответа
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
  },
  methods: {
    /**
     * Получить список всех медиа (для обратной совместимости)
     */
    getMediaList(question) {
      if (!question?.media) return [];
      if (Array.isArray(question.media)) return question.media;
      return [question.media];
    },

    /**
     * Получить только изображения
     */
    getImagesList(question) {
      return this.getMediaList(question).filter(item => item.type === 'image');
    },

    /**
     * Получить только файлы
     */
    getFilesList(question) {
      return this.getMediaList(question).filter(item => item.type === 'file');
    },

    downloadFile(url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = true;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.btn-reveal-answer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reveal-answer:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.5);
  transform: scale(1.03);
}

.reveal-icon {
  font-size: 16px;
}

.answer-value {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 14px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  color: #16a34a;
  font-size: 15px;
  line-height: 1.5;
}
</style>