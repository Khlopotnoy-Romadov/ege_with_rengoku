<template>
  <div class="test-runner">
    <div class="test-header">
      <h3>🔥 {{ topic.name }}</h3>
      <span class="progress">
        {{ currentIndex + 1 }} / {{ topic.questions.length }}
      </span>
    </div>

    <div class="question-block" v-if="currentQuestion">
      <p class="question-text">{{ currentQuestion.text }}</p>
      
      <!-- Тип вопроса: С выбором ответа -->
      <div v-if="currentQuestion.question_type === 'choice' || !currentQuestion.question_type" class="options">
        <div 
          v-for="(option, idx) in currentQuestion.options" 
          :key="idx"
          class="option-item"
          :class="{
            selected: selectedOption === String.fromCharCode(65 + idx),
            correct: showResult && String.fromCharCode(65 + idx) === currentQuestion.correct,
            wrong: showResult && selectedOption === String.fromCharCode(65 + idx) && selectedOption !== currentQuestion.correct
          }"
          @click="selectOption(String.fromCharCode(65 + idx))"
        >
          <span class="option-label">{{ String.fromCharCode(65 + idx) }}.</span>
          <span class="option-text">{{ option }}</span>
        </div>
      </div>

      <!-- Тип вопроса: С вводом ответа -->
      <div v-else class="input-answer">
        <label for="userAnswer" class="input-label">✍️ Введите ваш ответ:</label>
        <input 
          id="userAnswer"
          type="text" 
          v-model="userInputAnswer" 
          :disabled="showResult"
          placeholder="Введите ответ..."
          class="answer-input"
          @keyup.enter="checkAnswer"
        />
      </div>

      <!-- Результат -->
      <div v-if="showResult" class="result-feedback">
        <div v-if="isAnswerCorrect" class="correct-feedback">
          ✅ 正解！ 「上手い！」 — Ренгоку хвалит тебя!
        </div>
        <div v-else class="wrong-feedback">
          ❌ 残念！ (Жаль!) Попробуй ещё раз.
          <div class="correct-answer-display">
            Правильный ответ: <strong>{{ currentQuestion.correct }}</strong>
          </div>
          <span v-if="currentQuestion.hint" class="hint">
            💡 Подсказка Ренгоку: {{ currentQuestion.hint }}
          </span>
        </div>
        <button class="btn-next" @click="nextQuestion">
          {{ isLast ? '🔥 Показать результат' : 'Следующий вопрос →' }}
        </button>
      </div>

      <!-- Кнопка ответа -->
      <button v-else class="btn-check" @click="checkAnswer" :disabled="!canAnswer">
        ⚔️ Ответить
      </button>
    </div>

    <!-- Результаты -->
    <div v-if="isFinished" class="result-screen">
      <h2>🔥 結果 (Результат)</h2>
      <div class="score">
        <span class="score-number">{{ score }}</span>
        <span class="score-total">/ {{ topic.questions.length }}</span>
      </div>
      <p class="score-message" v-if="score === topic.questions.length">
        🌟 「完璧だ！君は本当の剣士だ！」 — Идеально! Ты истинный мечник!
      </p>
      <p class="score-message" v-else-if="score >= topic.questions.length / 2">
        💪 「よくやった！まだまだ強くなれる！」 — Хорошая работа! Ты можешь стать ещё сильнее!
      </p>
      <p class="score-message" v-else>
        🔥 「心を燃やせ！もう一度挑戦だ！」 — Сожги своё сердце! Попробуй снова!
      </p>
      <button class="btn-retry" @click="$emit('finish')">🏠 Вернуться к темам</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestRunner',
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
      if (this.currentQuestion?.question_type === 'input') {
        return this.userInputAnswer.trim() !== '';
      }
      return this.selectedOption !== null;
    },
    isAnswerCorrect() {
      if (this.currentQuestion?.question_type === 'input') {
        // Сравниваем ответ пользователя с правильным (регистронезависимо)
        return this.userInputAnswer.trim().toLowerCase() === this.currentQuestion.correct.trim().toLowerCase();
      }
      return this.selectedOption === this.currentQuestion?.correct;
    }
  },
  methods: {
    selectOption(option) {
      if (this.showResult) return;
      this.selectedOption = option;
    },
    checkAnswer() {
      if (!this.canAnswer) return;
      
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
      this.showResult = false;
    }
  }
};
</script>

<style scoped>
.test-runner {
  background: rgba(10, 5, 3, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 69, 0, 0.3);
  margin-top: 20px;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(255, 69, 0, 0.2);
  padding-bottom: 15px;
  margin-bottom: 25px;
}

.test-header h3 {
  font-size: 1.8rem;
  color: #ff8c5a;
}

.progress {
  background: rgba(255, 69, 0, 0.2);
  padding: 6px 18px;
  border-radius: 30px;
  font-weight: 600;
  color: #ffa07a;
}

.question-text {
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #f0e0d0;
  padding: 15px;
  background: rgba(255, 69, 0, 0.05);
  border-radius: 12px;
  border-left: 4px solid #ff4500;
}

/* === Стили для вариантов ответов === */
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.option-item {
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  gap: 12px;
  color: #ddd;
}

.option-item:hover:not(.correct):not(.wrong) {
  background: rgba(255, 69, 0, 0.1);
  border-color: #ff4500;
}

.option-item.selected {
  border-color: #ff8c00;
  background: rgba(255, 140, 0, 0.15);
}

.option-item.correct {
  border-color: #00cc66;
  background: rgba(0, 204, 102, 0.2);
}

.option-item.wrong {
  border-color: #ff3333;
  background: rgba(255, 51, 51, 0.2);
}

.option-label {
  font-weight: 700;
  color: #ff8c5a;
  min-width: 28px;
}

/* === Стили для ввода ответа === */
.input-answer {
  margin: 20px 0 30px;
}

.input-label {
  display: block;
  color: #ffa07a;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.answer-input {
  width: 100%;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 69, 0, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 1.2rem;
  transition: 0.3s;
}

.answer-input:focus {
  outline: none;
  border-color: #ff4500;
  background: rgba(255, 69, 0, 0.1);
}

.answer-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.answer-input::placeholder {
  color: #666;
}

/* === Кнопки === */
.btn-check, .btn-next, .btn-retry {
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
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.5);
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
  box-shadow: 0 0 30px rgba(255, 140, 0, 0.4);
}

/* === Результат === */
.result-feedback {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(0,0,0,0.3);
}

.correct-feedback {
  color: #66ff99;
  font-weight: 600;
  font-size: 1.1rem;
}

.wrong-feedback {
  color: #ff9999;
}

.correct-answer-display {
  margin-top: 8px;
  color: #ffcc66;
  font-size: 1.05rem;
}

.hint {
  display: block;
  margin-top: 10px;
  padding: 12px;
  background: rgba(255, 69, 0, 0.1);
  border-radius: 8px;
  color: #ffb08a;
  font-style: italic;
}

/* === Итоговый экран === */
.result-screen {
  text-align: center;
  padding: 40px 20px;
}

.result-screen h2 {
  font-size: 2.5rem;
  color: #ff8c5a;
  margin-bottom: 20px;
}

.score {
  font-size: 4rem;
  font-weight: 900;
}

.score-number {
  color: #ff4500;
  text-shadow: 0 0 40px rgba(255, 69, 0, 0.5);
}

.score-total {
  color: #888;
  font-size: 2.5rem;
}

.score-message {
  margin: 25px 0;
  font-size: 1.3rem;
  color: #f0d8c8;
  font-style: italic;
}

.btn-retry {
  background: rgba(255, 69, 0, 0.2);
  border: 2px solid #ff4500;
  color: #ff8c5a;
  padding: 12px 40px;
}

.btn-retry:hover {
  background: #ff4500;
  color: #fff;
}
</style>