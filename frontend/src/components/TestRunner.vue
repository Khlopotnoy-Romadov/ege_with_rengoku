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
      <!-- 1. Текст вопроса -->
      <p class="question-text">{{ currentQuestion.text }}</p>

      <!-- 2. Таблица -->
      <TableRenderer v-if="currentQuestion.table" :tableData="currentQuestion.table" />

      <!-- 3. Изображения -->
      <div v-if="getImagesList(currentQuestion).length > 0" class="media-container">
        <div v-for="(item, idx) in getImagesList(currentQuestion)" :key="idx" class="media-item">
          <div class="media-image">
            <img :src="item.url" :alt="item.description || 'Схема к заданию'" />
            <p v-if="item.description" class="media-caption">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 4. Файлы -->
      <div v-if="getFilesList(currentQuestion).length > 0" class="files-container">
        <div v-for="(item, idx) in getFilesList(currentQuestion)" :key="idx" class="file-item">
          <a :href="item.url" download class="btn-download" @click.prevent="downloadFile(item.url)">
            📥 {{ item.description || 'Скачать файл' }}
          </a>
        </div>
      </div>

      <!-- 5. Варианты ответов -->
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

      <!-- 6. Ввод ответа -->
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

      <!-- 7. Кнопка ответа -->
      <button v-if="!showResult" class="btn-check" @click="checkAnswer" :disabled="!canAnswer">
        ⚔️ Ответить
      </button>

      <!-- 8. Результат -->
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
            ✅ Правильный ответ: <strong>{{ currentQuestion.correctAnswer}}</strong>
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

    <!-- 9. Результаты -->
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
    <p>📭 В этом варианте пока нет вопросов</p>
  </div>
</template>

<script>
import { defaultMentor, mentors } from '@/data/mentors';
import TableRenderer from '@/components/TableRenderer.vue';

export default {
  name: 'TestRunner',
  inject: ['mentor'],
  components: { TableRenderer },
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
      return this.topic?.questions?.[this.currentIndex] || null;
    },
    isLast() {
      return this.currentIndex === (this.topic?.questions?.length || 0) - 1;
    },
    canAnswer() {
      if (!this.currentQuestion) return false;
      if (this.currentQuestion.question_type === 'choice') {
        return this.selectedOption !== null;
      }
      if (this.currentQuestion.answer_type === 'number') {
        return this.userNumberAnswer !== null && this.userNumberAnswer !== '';
      }
      // Для текстового ввода — проверяем, что не пусто
      return this.userInputAnswer && this.userInputAnswer.trim() !== '';
    },
    isAnswerCorrect() {
      if (!this.currentQuestion) return false;
      
      const correct = this.currentQuestion.correctAnswer
      if (correct === undefined || correct === null) return false;
      
      // Тип "choice"
      if (this.currentQuestion.question_type === 'choice') {
        return this.selectedOption === correct;
      }
      
      // Тип "number"
      if (this.currentQuestion.answer_type === 'number') {
        return this.userNumberAnswer == correct;
      }
      
      // Тип "input" (текстовый ввод)
      const userAnswer = this.userInputAnswer || '';
      return userAnswer.trim().toLowerCase() === String(correct).trim().toLowerCase();
    },
    currentMentor() {
      if (this.mentor && this.mentor.current) {
        return this.mentor.current;
      }
      const saved = localStorage.getItem('ege_mentor');
      if (saved) {
        const found = mentors.find(m => m.id === saved);
        if (found) return found;
      }
      return defaultMentor;
    }
  },
  watch: {
    topic: {
      immediate: true,
      handler() {
        this.resetTest();
      }
    }
  },
  methods: {
    getMediaList(question) {
      if (!question?.media) return [];
      if (Array.isArray(question.media)) return question.media;
      return [question.media];
    },
    getImagesList(question) {
      return this.getMediaList(question).filter(item => item.type === 'image');
    },
    getFilesList(question) {
      return this.getMediaList(question).filter(item => item.type === 'file');
    },
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
      const mentor = this.currentMentor;
      if (mentor && mentor.hints && mentor.hints[type]) {
        const messages = mentor.hints[type];
        if (Array.isArray(messages)) {
          return messages[Math.floor(Math.random() * messages.length)];
        }
        return messages;
      }
      const fallback = {
        correct: ['✅ Отлично!', '🌟 Правильно!', '🎉 Верно!'],
        wrong: ['❌ Неправильно', '😅 Попробуй ещё раз', '💪 Не сдавайся!']
      };
      const fallbackMessages = fallback[type] || ['✅ Отлично!'];
      return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
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