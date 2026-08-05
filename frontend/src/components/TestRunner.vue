<template>
   <div class="test-runner" v-if="topic && topic.questions && topic.questions.length > 0">
    <div class="test-header">
      <div class="header-left">
        <h3>🔥 {{ topic.name }}</h3>
        <div class="mentor-info">
          <span class="mentor-badge">
            <img v-if="currentMentor.avatar" :src="currentMentor.avatar" :alt="currentMentor.name"
              class="mentor-badge-avatar" />
            <span v-else class="mentor-badge-emoji">{{ currentMentor.emoji }}</span>
            {{ currentMentor.name }}
          </span>
        </div>
      </div>
      <span class="progress">
        {{ currentIndex + 1 }} / {{ topic.questions.length }}
      </span>
    </div>

    <div class="question-block" v-if="currentQuestion">
      <!-- Медиа-контент -->
      <div v-if="currentQuestion.media_type && currentQuestion.media_type !== 'none'" class="media-container">
        <div v-if="currentQuestion.media_type === 'image' || currentQuestion.media_type === 'both'" class="media-image">
          <img :src="currentQuestion.media_url" :alt="currentQuestion.media_description || 'Схема к заданию'" />
          <p v-if="currentQuestion.media_description" class="media-caption">
            {{ currentQuestion.media_description }}
          </p>
        </div>
        <div v-if="currentQuestion.media_type === 'file' || currentQuestion.media_type === 'both'" class="media-file">
          <a :href="currentQuestion.media_url" target="_blank" class="btn-download">
            📥 Скачать файл
          </a>
        </div>
      </div>

      <p class="question-text">{{ currentQuestion.text }}</p>

      <!-- Тип вопроса: С выбором ответа -->
      <div v-if="currentQuestion.question_type === 'choice'" class="options">
        <div v-for="(option, idx) in currentQuestion.options" :key="idx" class="option-item" :class="{
          selected: selectedOption === String.fromCharCode(65 + idx),
          correct: showResult && String.fromCharCode(65 + idx) === currentQuestion.correct,
          wrong: showResult && selectedOption === String.fromCharCode(65 + idx) && selectedOption !== currentQuestion.correct
        }" @click="selectOption(String.fromCharCode(65 + idx))">
          <span class="option-label">{{ String.fromCharCode(65 + idx) }}.</span>
          <span class="option-text">{{ option }}</span>
        </div>
      </div>

      <!-- Тип вопроса: С вводом ответа -->
      <div v-else class="input-answer">
        <label class="input-label">
          <span v-if="currentQuestion.answer_type === 'number'">🔢 Введите число:</span>
          <span v-else>✍️ Введите ваш ответ:</span>
        </label>
        <input v-if="currentQuestion.answer_type === 'number'" type="number" v-model.number="userNumberAnswer"
          :disabled="showResult" placeholder="Введите число..." class="answer-input" @keyup.enter="checkAnswer" />
        <input v-else type="text" v-model="userInputAnswer" :disabled="showResult" placeholder="Введите ответ..."
          class="answer-input" @keyup.enter="checkAnswer" />
      </div>

      <!-- Кнопка ответа -->
      <button v-if="!showResult" class="btn-check" @click="checkAnswer" :disabled="!canAnswer">
        ⚔️ Ответить
      </button>

      <!-- Результат с сообщением от наставника -->
      <div v-if="showResult" class="result-feedback">
        <div v-if="isAnswerCorrect" class="correct-feedback">
          <div class="mentor-message correct-message">
            <span class="mentor-emoji">{{ currentMentor.emoji }}</span>
            <div class="mentor-text">
              <span class="mentor-name-label">{{ currentMentor.name }}:</span>
              <span>{{ getRandomMentorMessage('correct') }}</span>
            </div>
          </div>
        </div>
        <div v-else class="wrong-feedback">
          <div class="mentor-message wrong-message">
            <span class="mentor-emoji">{{ currentMentor.emoji }}</span>
            <div class="mentor-text">
              <span class="mentor-name-label">{{ currentMentor.name }}:</span>
              <span>{{ getRandomMentorMessage('wrong') }}</span>
            </div>
          </div>
          <div class="correct-answer-display">
            ✅ Правильный ответ: <strong>{{ currentQuestion.correct }}</strong>
          </div>
          <span v-if="currentQuestion.hint" class="hint">
            💡 Подсказка: {{ currentQuestion.hint }}
          </span>
        </div>
        <button class="btn-next" @click="nextQuestion">
          {{ isLast ? '🔥 Показать результат' : 'Следующий вопрос →' }}
        </button>
      </div>
    </div>

    <!-- Экран результатов -->
    <div v-if="isFinished" class="result-screen">
      <h2>🔥 結果 (Результат)</h2>

      <div class="mentor-result">
        <span class="mentor-result-emoji">{{ currentMentor.emoji }}</span>
        <div class="mentor-result-info">
          <span class="mentor-result-name">{{ currentMentor.name }}</span>
          <span class="mentor-result-quote">«{{ currentMentor.quote }}»</span>
        </div>
      </div>

      <div class="score">
        <span class="score-number">{{ score }}</span>
        <span class="score-total">/ {{ topic.questions.length }}</span>
      </div>

      <p class="score-message" v-if="score === topic.questions.length">
        {{ currentMentor.hints.perfect }}
      </p>
      <p class="score-message" v-else-if="score >= topic.questions.length / 2">
        {{ currentMentor.hints.good }}
      </p>
      <p class="score-message" v-else>
        {{ currentMentor.hints.bad }}
      </p>

      <div class="result-actions">
        <button class="btn-retry" @click="$emit('finish')">🏠 Вернуться к темам</button>
        <button class="btn-retry" @click="restartTest">🔄 Пройти заново</button>
      </div>
    </div>
  </div>
  <div v-else class="test-runner-empty">
    <p>📭 В этой теме пока нет вопросов</p>
  </div>
</template>

<script>
import { defaultMentor, mentors } from '@/data/mentors';

export default {
  name: 'TestRunner',
  inject: ['mentor'],
  props: {
    topic: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      selectedOption: null,
      userInputAnswer: '',
      userNumberAnswer: null,
      showResult: false,
      score: 0,
      isFinished: false
    };
  },
  computed: {
    currentQuestion() {
      return this.topic.questions[this.currentIndex] || null;
    },
    isLast() {
      return this.currentIndex === this.topic.questions.length - 1;
    },
    canAnswer() {
      if (this.currentQuestion?.question_type === 'choice') {
        return this.selectedOption !== null;
      }
      if (this.currentQuestion?.answer_type === 'number') {
        return this.userNumberAnswer !== null && this.userNumberAnswer !== '';
      }
      return this.userInputAnswer.trim() !== '';
    },
    isAnswerCorrect() {
      if (this.currentQuestion?.question_type === 'choice') {
        return this.selectedOption === this.currentQuestion.correct;
      }
      if (this.currentQuestion?.answer_type === 'number') {
        return this.userNumberAnswer == this.currentQuestion.correct;
      }
      return this.userInputAnswer.trim().toLowerCase() === this.currentQuestion.correct.trim().toLowerCase();
    },
    currentMentor() {
      return this.mentor.current;
    }
  },
  watch: {
    // Сбрасываем состояние при смене темы
    topic() {
      this.resetTest();
    }
  },
  methods: {
    selectOption(option) {
      if (this.showResult) return;
      this.selectedOption = option;
    },
    checkAnswer() {
      if (!this.canAnswer || this.showResult) return;

      this.showResult = true;

      if (this.isAnswerCorrect) {
        this.score += this.currentQuestion.points || 1;
      }
    },
    nextQuestion() {
      if (this.isLast) {
        this.isFinished = true;
        this.$emit('finish');
        return;
      }
      this.currentIndex++;
      this.selectedOption = null;
      this.userInputAnswer = '';
      this.userNumberAnswer = null;
      this.showResult = false;
    },
    restartTest() {
      this.resetTest();
      this.$emit('finish');
      // Эмитим событие, чтобы родитель мог перезапустить тест
      this.$emit('restart');
    },
    resetTest() {
      this.currentIndex = 0;
      this.selectedOption = null;
      this.userInputAnswer = '';
      this.userNumberAnswer = null;
      this.showResult = false;
      this.score = 0;
      this.isFinished = false;
    },
    getRandomMentorMessage(type) {
      const messages = this.mentor.current.hints[type];
      if (Array.isArray(messages)) {
        return messages[Math.floor(Math.random() * messages.length)];
      }
      return messages;
    }
  }
};
</script>

<style scoped>

.test-runner-empty {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary, #d4a088);
  font-size: 1.2rem;
}
.test-runner {
  background: var(--test-bg, rgba(10, 5, 3, 0.9));
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.15));
  margin-top: 20px;
  transition: background 0.3s ease, border-color 0.3s ease;
}

/* ===== ШАПКА ===== */
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border-color, rgba(255, 69, 0, 0.15));
  padding-bottom: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.test-header h3 {
  font-size: 1.8rem;
  color: #ff8c5a;
  margin: 0;
}

.mentor-info {
  display: flex;
  align-items: center;
}

.mentor-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px 4px 10px;
  background: var(--button-bg, rgba(255, 69, 0, 0.1));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.12));
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary, #ffa07a);
  font-weight: 600;
}

.mentor-badge-emoji {
  font-size: 1.1rem;
}

.progress {
  background: var(--button-bg, rgba(255, 69, 0, 0.12));
  padding: 6px 18px;
  border-radius: 30px;
  font-weight: 600;
  color: #ffa07a;
  font-size: 0.95rem;
}

/* ===== ВОПРОС ===== */
.question-text {
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: var(--text-primary, #f0e0d0);
  padding: 15px 20px;
  background: var(--bg-card, rgba(255, 69, 0, 0.03));
  border-radius: 12px;
  border-left: 4px solid #ff4500;
  transition: background 0.3s ease, color 0.3s ease;
}

/* ===== МЕДИА ===== */
.media-container {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 200, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(0, 200, 255, 0.08);
}

.media-image img {
  max-width: 100%;
  border-radius: 8px;
}

.media-caption {
  color: var(--text-secondary, #88ccdd);
  font-size: 0.95rem;
  margin-top: 8px;
  text-align: center;
}

.media-file {
  display: flex;
  justify-content: center;
}

.btn-download {
  display: inline-block;
  padding: 10px 24px;
  background: var(--button-bg, rgba(255, 69, 0, 0.12));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.15));
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

/* ===== ВАРИАНТЫ ОТВЕТОВ ===== */
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.option-item {
  padding: 14px 20px;
  background: var(--bg-input, rgba(255, 255, 255, 0.03));
  border: 2px solid var(--border-color, rgba(255, 255, 255, 0.06));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  gap: 12px;
  color: var(--text-primary, #ddd);
}

.option-item:hover:not(.correct):not(.wrong) {
  background: rgba(255, 69, 0, 0.06);
  border-color: #ff4500;
}

.option-item.selected {
  border-color: #ff8c00;
  background: rgba(255, 140, 0, 0.1);
}

.option-item.correct {
  border-color: #00cc66;
  background: rgba(0, 204, 102, 0.12);
}

.option-item.wrong {
  border-color: #ff3333;
  background: rgba(255, 51, 51, 0.1);
}

.option-label {
  font-weight: 700;
  color: #ff8c5a;
  min-width: 28px;
}

.option-text {
  flex: 1;
}

/* ===== ВВОД ОТВЕТА ===== */
.input-answer {
  margin: 20px 0 30px;
}

.input-label {
  display: block;
  color: var(--text-secondary, #ffa07a);
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 500;
}

.answer-input {
  width: 100%;
  padding: 14px 20px;
  background: var(--bg-input, rgba(255, 255, 255, 0.03));
  border: 2px solid var(--border-color, rgba(255, 69, 0, 0.15));
  border-radius: 12px;
  color: var(--text-primary, #fff);
  font-size: 1.2rem;
  transition: 0.3s;
}

.answer-input:focus {
  outline: none;
  border-color: #ff4500;
  background: rgba(255, 69, 0, 0.04);
}

.answer-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.answer-input::placeholder {
  color: var(--text-muted, #666);
}

/* ===== КНОПКИ ===== */
.btn-check,
.btn-next {
  padding: 14px 40px;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-check {
  background: linear-gradient(135deg, #ff4500, #cc3700);
  color: #fff;
  width: 100%;
}

.btn-check:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.25);
}

.btn-check:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-next {
  background: linear-gradient(135deg, #ff8c00, #ff4500);
  color: #fff;
  margin-top: 15px;
  width: 100%;
}

.btn-next:hover {
  transform: scale(1.02);
  box-shadow: 0 0 30px rgba(255, 140, 0, 0.25);
}

/* ===== РЕЗУЛЬТАТ ОТВЕТА ===== */
.result-feedback {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  background: var(--bg-card, rgba(0, 0, 0, 0.15));
  transition: background 0.3s ease;
}

.correct-feedback {
  color: #66ff99;
}

.wrong-feedback {
  color: #ff9999;
}

.mentor-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
}

.mentor-emoji {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.mentor-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 1.05rem;
  line-height: 1.5;
}

.mentor-name-label {
  font-weight: 700;
  color: #ff8c5a;
  font-size: 0.9rem;
}

.correct-message .mentor-text {
  color: #66ff99;
}

.wrong-message .mentor-text {
  color: #ff9999;
}

.correct-answer-display {
  margin-top: 10px;
  padding: 10px 14px;
  background: rgba(255, 204, 102, 0.08);
  border-radius: 8px;
  color: #ffcc66;
  font-size: 1.05rem;
}

.correct-answer-display strong {
  color: #ffdd88;
}

.hint {
  display: block;
  margin-top: 10px;
  padding: 12px 16px;
  background: rgba(255, 69, 0, 0.06);
  border-radius: 8px;
  color: #ffb08a;
  font-style: italic;
  border-left: 3px solid #ff4500;
}

/* ===== ЭКРАН РЕЗУЛЬТАТОВ ===== */
.result-screen {
  text-align: center;
  padding: 30px 20px;
}

.result-screen h2 {
  font-size: 2.5rem;
  color: #ff8c5a;
  margin-bottom: 20px;
}

.mentor-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: var(--bg-card, rgba(255, 69, 0, 0.04));
  border-radius: 16px;
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.06));
}

.mentor-result-emoji {
  font-size: 2.8rem;
}

.mentor-result-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.mentor-result-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary, #f0e0d0);
}

.mentor-result-quote {
  font-size: 0.9rem;
  color: var(--text-muted, #888);
  font-style: italic;
}

.score {
  font-size: 4rem;
  font-weight: 900;
  margin: 20px 0;
}

.score-number {
  color: #ff4500;
  text-shadow: 0 0 40px rgba(255, 69, 0, 0.15);
}

.score-total {
  color: var(--text-muted, #888);
  font-size: 2.5rem;
}

.score-message {
  margin: 15px 0 25px;
  font-size: 1.3rem;
  color: var(--text-secondary, #f0d8c8);
  font-style: italic;
  padding: 12px 20px;
  background: var(--bg-card, rgba(255, 69, 0, 0.03));
  border-radius: 12px;
  border-left: 4px solid #ff4500;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-retry {
  padding: 12px 30px;
  background: var(--button-bg, rgba(255, 69, 0, 0.12));
  border: 2px solid var(--border-color, rgba(255, 69, 0, 0.15));
  border-radius: 30px;
  color: var(--text-secondary, #ff8c5a);
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
  font-size: 1rem;
}

.btn-retry:hover {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
  transform: scale(1.03);
}

/* ===== АДАПТИВ ===== */
@media (max-width: 768px) {
  .test-runner {
    padding: 20px 16px;
  }

  .test-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .header-left {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .test-header h3 {
    font-size: 1.4rem;
  }

  .progress {
    align-self: flex-start;
  }

  .question-text {
    font-size: 1.15rem;
    padding: 12px 16px;
  }

  .score {
    font-size: 3rem;
  }

  .score-total {
    font-size: 2rem;
  }

  .score-message {
    font-size: 1.1rem;
  }

  .mentor-message {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .mentor-result {
    flex-direction: column;
    text-align: center;
  }

  .mentor-result-info {
    align-items: center;
    text-align: center;
  }

  .result-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-retry {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .option-item {
    padding: 10px 14px;
    font-size: 0.95rem;
  }

  .answer-input {
    font-size: 1rem;
    padding: 12px 16px;
  }

  .btn-check,
  .btn-next {
    font-size: 0.95rem;
    padding: 12px 20px;
  }
}

.mentor-badge-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.mentor-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px 4px 8px;
  background: var(--button-bg, rgba(255, 69, 0, 0.1));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.12));
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary, #ffa07a);
  font-weight: 600;
}
</style>