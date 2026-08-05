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

          <!-- 5. Ответ -->
          <div class="question-answer">
            <span class="answer-label">✅ Правильный ответ: </span>
            <span class="answer-value">{{ q.correctAnswer }}</span>
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