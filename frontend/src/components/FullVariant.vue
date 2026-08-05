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

.loading,
.empty {
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
  line-height: 1.8;
  color: var(--text-primary, #f0e0d0);
  margin: 10px 0;
  white-space: pre-line;
}

/* ===== МЕДИА-КОНТЕЙНЕР (изображения) ===== */
.media-container {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.media-item {
  background: var(--bg-card, rgba(255, 255, 255, 0.02));
  border-radius: 12px;
  padding: 12px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
}

.media-image {
  text-align: center;
}

.media-image img {
  max-width: 100%;
  border-radius: 8px;
  max-height: 500px;
  object-fit: contain;
}

.media-caption {
  color: var(--text-secondary, #d4a088);
  font-size: 0.9rem;
  margin-top: 6px;
  text-align: center;
}

/* ===== ФАЙЛЫ ДЛЯ СКАЧИВАНИЯ ===== */
.files-container {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  display: flex;
  justify-content: center;
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
  font-size: 0.9rem;
}

.btn-download:hover {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
}

/* ===== ОТВЕТ И ПОДСКАЗКА ===== */
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
  .media-image img {
    max-height: 300px;
  }
}
</style>