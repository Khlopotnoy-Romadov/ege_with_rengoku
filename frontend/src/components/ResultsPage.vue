<template>
  <FlameBackground>
    <div class="results-page">
      <div class="results-header">
        <h1>📊 Результаты тестирования</h1>
        <p class="variant-name">{{ topic?.name || 'Вариант' }}</p>
      </div>

      <!-- Основная статистика -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-value">{{ correctAnswers }}</div>
          <div class="stat-label">Правильных ответов</div>
        </div>
        <div class="stat-card secondary">
          <div class="stat-value">{{ wrongAnswers }}</div>
          <div class="stat-label">Неправильных ответов</div>
        </div>
        <div class="stat-card total">
          <div class="stat-value">{{ totalQuestions }}</div>
          <div class="stat-label">Всего заданий</div>
        </div>
        <div class="stat-card percentage">
          <div class="stat-value">{{ percentage }}%</div>
          <div class="stat-label">Процент выполнения</div>
        </div>
      </div>

      <!-- Баллы -->
      <div class="scores-grid">
        <div class="score-card primary-score">
          <div class="score-value">{{ primaryScore }}</div>
          <div class="score-label">Первичные баллы</div>
        </div>
        <div class="score-card secondary-score">
          <div class="score-value">{{ secondaryScore }}</div>
          <div class="score-label">Вторичные баллы (тестовые)</div>
        </div>
      </div>

      <!-- Разбор заданий -->
      <div class="questions-review">
        <h2>📝 Разбор заданий</h2>
        <div
          v-for="(result, index) in results"
          :key="index"
          class="review-item"
          :class="result.isCorrect ? 'correct' : 'wrong'"
        >
          <div class="review-header">
            <span class="review-number">Задание №{{ result.number || index + 1 }}</span>
            <span class="review-status">
              {{ result.isCorrect ? '✅ Правильно' : '❌ Неправильно' }}
            </span>
          </div>
          <div class="review-details">
            <p class="review-question">{{ result.questionText }}</p>
            <div class="review-answers">
              <div class="review-user-answer">
                <span class="label">Ваш ответ:</span>
                <span class="value">{{ result.userAnswer || 'Не указан' }}</span>
              </div>
              <div class="review-correct-answer">
                <span class="label">✅ Правильный ответ:</span>
                <span class="value">{{ result.correctAnswer }}</span>
              </div>
            </div>
            <div v-if="result.hint && !result.isCorrect" class="review-hint">
              💡 {{ result.hint }}
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="results-actions">
        <button class="btn-other-variants" @click="goToSubject">
          📚 Решать другие варианты
        </button>
        <button class="btn-retry-variant" @click="retryVariant">
          🔄 Пройти вариант заново
        </button>
      </div>
    </div>
  </FlameBackground>
</template>

<script>
import FlameBackground from '@/components/FlameBackground.vue';

export default {
  name: 'ResultsPage',
  components: { FlameBackground },
  props: {
    topic: {
      type: Object,
      required: true
    },
    results: {
      type: Array,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      primaryToSecondary: {
        0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 23, 7: 26, 8: 29,
        9: 32, 10: 35, 11: 38, 12: 41, 13: 44, 14: 47, 15: 50, 16: 53,
        17: 56, 18: 59, 19: 62, 20: 65, 21: 68, 22: 71, 23: 74, 24: 76,
        25: 78, 26: 80, 27: 82, 28: 84, 29: 86, 30: 88, 31: 90, 32: 92,
        33: 94, 34: 96, 35: 98, 36: 100
      }
    };
  },
  computed: {
    totalQuestions() {
      return this.total || this.results.length;
    },
    correctAnswers() {
      return this.results.filter(r => r.isCorrect).length;
    },
    wrongAnswers() {
      return this.results.filter(r => !r.isCorrect).length;
    },
    percentage() {
      if (this.totalQuestions === 0) return 0;
      return Math.round((this.correctAnswers / this.totalQuestions) * 100);
    },
    primaryScore() {
      return this.score;
    },
    secondaryScore() {
      return this.primaryToSecondary[this.primaryScore] || 
             this.primaryToSecondary[Math.min(this.primaryScore, 36)] || 0;
    }
  },
  methods: {
    goToSubject() {
      this.$emit('back');
    },
    retryVariant() {
      this.$emit('retry');
    }
  }
};
</script>