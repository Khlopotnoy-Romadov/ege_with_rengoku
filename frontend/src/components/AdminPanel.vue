<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>🔥 Панель управления</h1>
      <router-link to="/" class="btn-exit">🏠 На главную</router-link>
    </div>

    <div class="admin-nav">
      <button @click="switchTab('subjects')" :class="{ active: activeTab === 'subjects' }">
        📚 Предметы
      </button>
      <button @click="switchTab('topics')" :class="{ active: activeTab === 'topics' }">
        📝 Темы
      </button>
      <button @click="switchTab('questions')" :class="{ active: activeTab === 'questions' }">
        ❓ Вопросы
      </button>
    </div>

    <div class="admin-content">
      <!-- ==================== ПРЕДМЕТЫ ==================== -->
      <div v-if="activeTab === 'subjects'">
        <div class="section-header">
          <h2>📚 Предметы</h2>
          <button @click="openAddSubject" class="btn-add">➕ Добавить предмет</button>
        </div>

        <div v-if="showAddSubject" class="add-form">
          <h3>{{ editingSubject ? '✏️ Редактировать предмет' : '➕ Добавить предмет' }}</h3>
          <input v-model="newSubject.name" placeholder="Название предмета">
          <input v-model="newSubject.slug" placeholder="Slug (на английском)">
          <input v-model="newSubject.icon" placeholder="Иконка (эмодзи)">
          <div class="form-actions">
            <button @click="saveSubject" class="btn-save">💾 Сохранить</button>
            <button @click="showAddSubject = false" class="btn-cancel">❌ Отмена</button>
          </div>
        </div>

        <div v-for="subject in subjects" :key="subject.id" class="admin-item">
          <span>{{ subject.icon }} {{ subject.name }} ({{ subject.slug }})</span>
          <div class="admin-actions">
            <button @click="startEditSubject(subject)" class="btn-edit">✏️</button>
            <button @click="deleteSubject(subject.id)" class="btn-delete">🗑️</button>
          </div>
        </div>
      </div>

      <!-- ==================== ТЕМЫ ==================== -->
      <div v-if="activeTab === 'topics'">
        <div class="section-header">
          <h2>📝 Темы</h2>
          <button @click="openAddTopic" class="btn-add">➕ Добавить тему</button>
        </div>

        <div v-if="showAddTopic" class="add-form">
          <h3>{{ editingTopic ? '✏️ Редактировать тему' : '➕ Добавить тему' }}</h3>
          <select v-model="newTopic.subject_id">
            <option value="">Выберите предмет</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.icon }} {{ subject.name }}
            </option>
          </select>
          <input v-model="newTopic.name" placeholder="Название темы">
          <input v-model="newTopic.description" placeholder="Описание (необязательно)">
          <div class="form-actions">
            <button @click="saveTopic" class="btn-save">💾 Сохранить</button>
            <button @click="showAddTopic = false" class="btn-cancel">❌ Отмена</button>
          </div>
        </div>

        <div v-for="topic in topics" :key="topic.id" class="admin-item">
          <span>
            {{ getSubjectName(topic.subject_id) }} → {{ topic.name }}
            <span v-if="topic.description" class="topic-desc">({{ topic.description }})</span>
          </span>
          <div class="admin-actions">
            <button @click="startEditTopic(topic)" class="btn-edit">✏️</button>
            <button @click="deleteTopic(topic.id)" class="btn-delete">🗑️</button>
          </div>
        </div>
      </div>

      <!-- ==================== ВОПРОСЫ ==================== -->
      <div v-if="activeTab === 'questions'">
        <div class="section-header">
          <h2>❓ Вопросы</h2>
          <button @click="openAddQuestion" class="btn-add">➕ Добавить вопрос</button>
        </div>

        <div v-if="showAddQuestion" class="add-form">
          <h3>{{ editingQuestion ? '✏️ Редактировать вопрос' : '➕ Добавить вопрос' }}</h3>

          <select v-model="newQuestion.topic_id">
            <option value="">Выберите тему</option>
            <option v-for="topic in topics" :key="topic.id" :value="topic.id">
              {{ getSubjectName(topic.subject_id) }} → {{ topic.name }}
            </option>
          </select>

          <textarea v-model="newQuestion.question_text" placeholder="Текст вопроса" rows="3"></textarea>

          <!-- Тип вопроса -->
          <div class="question-type">
            <label>
              <input type="radio" v-model="newQuestion.question_type" value="input" @change="updateQuestionType">
              ✍️ С вводом ответа
            </label>
            <label>
              <input type="radio" v-model="newQuestion.question_type" value="choice" @change="updateQuestionType">
              📝 С выбором ответа
            </label>
          </div>

          <!-- Варианты ответов (для типа choice) -->
          <div v-if="newQuestion.question_type === 'choice'" class="options-group">
            <h4>Варианты ответов:</h4>
            <div v-for="(option, index) in newQuestion.options" :key="index" class="option-input">
              <span>{{ String.fromCharCode(65 + index) }}.</span>
              <input v-model="newQuestion.options[index]" :placeholder="`Вариант ${String.fromCharCode(65 + index)}`">
              <button v-if="newQuestion.options.length > 2" @click="removeOption(index)"
                class="btn-remove-option">✕</button>
            </div>
            <button @click="addOption" class="btn-add-option">➕ Добавить вариант</button>

            <select v-model="newQuestion.correct_answer" class="correct-select">
              <option value="">Правильный ответ</option>
              <option v-for="(_, index) in newQuestion.options" :key="index" :value="String.fromCharCode(65 + index)">
                {{ String.fromCharCode(65 + index) }}
              </option>
            </select>
          </div>

          <!-- Правильный ответ (для типа input) -->
          <div v-if="newQuestion.question_type === 'input'" class="input-answer-group">
            <h4>Правильный ответ:</h4>
            <input v-model="newQuestion.correct_answer" placeholder="Введите правильный ответ">
          </div>

          <input v-model="newQuestion.hint" placeholder="Подсказка (необязательно)">
          <input v-model.number="newQuestion.points" placeholder="Баллы (по умолчанию 1)" type="number" min="1">

          <div class="form-actions">
            <button @click="saveQuestion" class="btn-save">💾 Сохранить</button>
            <button @click="showAddQuestion = false" class="btn-cancel">❌ Отмена</button>
          </div>
        </div>

        <!-- Список вопросов -->
        <div v-for="question in questions" :key="question.id" class="admin-item question-item">
          <div class="question-info">
            <span class="question-type-badge">{{ question.question_type === 'input' ? '✍️ Ввод' : '📝 Выбор' }}</span>
            <strong>{{ getTopicName(question.topic_id) }}</strong>
            <span class="question-text">{{ question.question_text }}</span>
            <span v-if="question.question_type === 'choice'" class="question-options">
              Варианты: {{ Array.isArray(question.options) ? question.options.join(', ') : question.options }}
            </span>
            <span class="question-correct">✅ Ответ: {{ question.correct_answer }}</span>
          </div>
          <div class="admin-actions">
            <button @click="startEditQuestion(question)" class="btn-edit">✏️</button>
            <button @click="deleteQuestion(question.id)" class="btn-delete">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/admin';

export default {
  name: 'AdminPanel',
  data() {
    return {
      activeTab: 'subjects',

      // Данные
      subjects: [],
      topics: [],
      questions: [],

      // Форма предмета
      showAddSubject: false,
      newSubject: { name: '', slug: '', icon: '' },
      editingSubject: null,

      // Форма темы
      showAddTopic: false,
      newTopic: { subject_id: '', name: '', description: '' },
      editingTopic: null,

      // Форма вопроса
      showAddQuestion: false,
      newQuestion: {
        topic_id: '',
        question_text: '',
        question_type: 'input',
        options: [],
        correct_answer: '',
        hint: '',
        points: 1
      },
      editingQuestion: null
    };
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    // === ЗАГРУЗКА ДАННЫХ ===
    async loadAll() {
      await Promise.all([
        this.loadSubjects(),
        this.loadTopics(),
        this.loadQuestions()
      ]);
    },

    async loadSubjects() {
      try {
        const response = await axios.get(`${API_BASE}/subjects`, {
          headers: { 'X-Admin-Token': 'rengoku2026' }
        });
        this.subjects = response.data;
      } catch (error) {
        console.error('Ошибка загрузки предметов:', error);
      }
    },

    async loadTopics() {
      try {
        const response = await axios.get(`${API_BASE}/topics`, {
          headers: { 'X-Admin-Token': 'rengoku2026' }
        });
        this.topics = response.data;
      } catch (error) {
        console.error('Ошибка загрузки тем:', error);
      }
    },

    async loadQuestions() {
      try {
        const response = await axios.get(`${API_BASE}/questions`, {
          headers: { 'X-Admin-Token': 'rengoku2026' }
        });
        this.questions = response.data;
      } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
      }
    },

    // === ВСПОМОГАТЕЛЬНЫЕ ===
    getSubjectName(id) {
      const subject = this.subjects.find(s => s.id === id);
      return subject ? subject.name : 'Неизвестный предмет';
    },

    getTopicName(id) {
      const topic = this.topics.find(t => t.id === id);
      return topic ? topic.name : 'Неизвестная тема';
    },

    switchTab(tab) {
      this.activeTab = tab;
      this.showAddSubject = false;
      this.showAddTopic = false;
      this.showAddQuestion = false;
    },

    // === ПРЕДМЕТЫ ===
    openAddSubject() {
      this.showAddSubject = true;
      this.editingSubject = null;
      this.newSubject = { name: '', slug: '', icon: '' };
    },

    startEditSubject(subject) {
      this.editingSubject = subject;
      this.newSubject = {
        name: subject.name,
        slug: subject.slug,
        icon: subject.icon || ''
      };
      this.showAddSubject = true;
    },

    async saveSubject() {
      try {
        if (this.editingSubject) {
          await axios.put(
            `${API_BASE}/subjects/${this.editingSubject.id}`,
            this.newSubject,
            { headers: { 'X-Admin-Token': 'rengoku2026' } }
          );
          alert('✅ Предмет обновлён!');
        } else {
          await axios.post(
            `${API_BASE}/subjects`,
            this.newSubject,
            { headers: { 'X-Admin-Token': 'rengoku2026' } }
          );
          alert('✅ Предмет добавлен!');
        }
        this.showAddSubject = false;
        this.editingSubject = null;
        this.newSubject = { name: '', slug: '', icon: '' };
        this.loadSubjects();
      } catch (error) {
        alert('Ошибка: ' + (error.response?.data?.message || error.message));
      }
    },

    async deleteSubject(id) {
      if (confirm('Удалить предмет? Все темы и вопросы будут удалены!')) {
        try {
          await axios.delete(`${API_BASE}/subjects/${id}`, {
            headers: { 'X-Admin-Token': 'rengoku2026' }
          });
          alert('✅ Предмет удалён');
          this.loadAll();
        } catch (error) {
          alert('Ошибка при удалении');
        }
      }
    },

    // === ТЕМЫ ===
    openAddTopic() {
      this.showAddTopic = true;
      this.editingTopic = null;
      this.newTopic = { subject_id: '', name: '', description: '' };
    },

    startEditTopic(topic) {
      this.editingTopic = topic;
      this.newTopic = {
        subject_id: topic.subject_id,
        name: topic.name,
        description: topic.description || ''
      };
      this.showAddTopic = true;
    },

    async saveTopic() {
      try {
        if (this.editingTopic) {
          await axios.put(
            `${API_BASE}/topics/${this.editingTopic.id}`,
            this.newTopic,
            { headers: { 'X-Admin-Token': 'rengoku2026' } }
          );
          alert('✅ Тема обновлена!');
        } else {
          await axios.post(
            `${API_BASE}/topics`,
            this.newTopic,
            { headers: { 'X-Admin-Token': 'rengoku2026' } }
          );
          alert('✅ Тема добавлена!');
        }
        this.showAddTopic = false;
        this.editingTopic = null;
        this.newTopic = { subject_id: '', name: '', description: '' };
        this.loadTopics();
      } catch (error) {
        alert('Ошибка: ' + (error.response?.data?.message || error.message));
      }
    },

    async deleteTopic(id) {
      if (confirm('Удалить тему? Все вопросы будут удалены!')) {
        try {
          await axios.delete(`${API_BASE}/topics/${id}`, {
            headers: { 'X-Admin-Token': 'rengoku2026' }
          });
          alert('✅ Тема удалена');
          this.loadAll();
        } catch (error) {
          alert('Ошибка при удалении');
        }
      }
    },

    // === ВОПРОСЫ ===
    openAddQuestion() {
      this.showAddQuestion = true;
      this.editingQuestion = null;
      this.newQuestion = {
        topic_id: '',
        question_text: '',
        question_type: 'input',
        options: ['', '', '', ''],
        correct_answer: '',
        hint: '',
        points: 1
      };
    },

    updateQuestionType() {
      this.newQuestion.correct_answer = '';
      if (this.newQuestion.question_type === 'input') {
        this.newQuestion.options = [];
      } else {
        this.newQuestion.options = ['', '', '', ''];
      }
    },

    addOption() {
      this.newQuestion.options.push('');
    },

    removeOption(index) {
      this.newQuestion.options.splice(index, 1);
      // Если удалили вариант, который был правильным ответом
      if (this.newQuestion.correct_answer === String.fromCharCode(65 + index)) {
        this.newQuestion.correct_answer = '';
      }
    },

    startEditQuestion(question) {
      this.editingQuestion = question;
      const isChoice = question.question_type === 'choice' || !question.question_type;
      this.newQuestion = {
        topic_id: question.topic_id,
        question_text: question.question_text,
        question_type: isChoice ? 'choice' : 'input',
        options: isChoice ? (Array.isArray(question.options) ? question.options : ['', '', '', '']) : [],
        correct_answer: question.correct_answer || '',
        hint: question.hint || '',
        points: question.points || 1
      };
      this.showAddQuestion = true;
    },

    async saveQuestion() {
      try {
        const data = {
          topic_id: this.newQuestion.topic_id,
          question_text: this.newQuestion.question_text,
          question_type: this.newQuestion.question_type,
          correct_answer: this.newQuestion.correct_answer,
          hint: this.newQuestion.hint,
          points: this.newQuestion.points || 1
        };

        if (this.newQuestion.question_type === 'choice') {
          const options = this.newQuestion.options.filter(o => o.trim() !== '');
          if (options.length < 2) {
            alert('Добавьте минимум 2 варианта ответа!');
            return;
          }
          data.options = options;
        } else {
          data.options = [];
          if (!data.correct_answer || data.correct_answer.trim() === '') {
            alert('Введите правильный ответ!');
            return;
          }
        }

        if (this.editingQuestion) {
          await axios.put(
            `${API_BASE}/questions/${this.editingQuestion.id}`,
            data,
            { headers: { 'X-Admin-Token': 'rengoku2026' } }
          );
          alert('✅ Вопрос обновлён!');
        } else {
          await axios.post(
            `${API_BASE}/questions`,
            data,
            { headers: { 'X-Admin-Token': 'rengoku2026' } }
          );
          alert('✅ Вопрос добавлен!');
        }

        this.showAddQuestion = false;
        this.editingQuestion = null;
        this.newQuestion = {
          topic_id: '',
          question_text: '',
          question_type: 'choice',
          options: ['', '', '', ''],
          correct_answer: '',
          hint: '',
          points: 1
        };
        this.loadQuestions();
      } catch (error) {
        alert('Ошибка: ' + (error.response?.data?.message || error.message));
      }
    },

    async deleteQuestion(id) {
      if (confirm('Удалить вопрос?')) {
        try {
          await axios.delete(`${API_BASE}/questions/${id}`, {
            headers: { 'X-Admin-Token': 'rengoku2026' }
          });
          alert('✅ Вопрос удалён');
          this.loadQuestions();
        } catch (error) {
          alert('Ошибка при удалении');
        }
      }
    }
  }
};
</script>

<style scoped>
/* ... остальные стили ... */

.question-type {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  padding: 10px;
  background: rgba(255, 69, 0, 0.05);
  border-radius: 8px;
}

.question-type label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ddd;
  cursor: pointer;
}

.question-type input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #ff4500;
}

.btn-add-option {
  background: rgba(255, 69, 0, 0.2);
  border: 1px dashed #ff4500;
  color: #ff8c5a;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.3s;
}

.btn-add-option:hover {
  background: rgba(255, 69, 0, 0.3);
}

.btn-remove-option {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 5px;
}

.btn-remove-option:hover {
  color: #ff0000;
}

.correct-select {
  margin-top: 10px;
}

.input-answer-group {
  margin: 10px 0;
}

.input-answer-group h4 {
  color: #ffa07a;
  margin-bottom: 8px;
}

.question-type-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 69, 0, 0.2);
  color: #ff8c5a;
  margin-right: 10px;
}

/* Остальные стили из предыдущей версии */
.admin-panel {
  background: rgba(10, 5, 3, 0.95);
  border-radius: 16px;
  padding: 30px;
  color: #fff;
  max-width: 900px;
  margin: 40px auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.admin-header h1 {
  font-size: 2rem;
  background: linear-gradient(45deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-exit {
  padding: 10px 20px;
  background: rgba(255, 69, 0, 0.2);
  border: 1px solid #ff4500;
  border-radius: 8px;
  color: #ffa07a;
  text-decoration: none;
  transition: 0.3s;
  font-weight: 600;
}

.btn-exit:hover {
  background: #ff4500;
  color: #fff;
}

.admin-nav {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.admin-nav button {
  padding: 10px 20px;
  border: 1px solid #ff4500;
  background: transparent;
  color: #ffa07a;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.admin-nav button:hover {
  background: #ff4500;
  color: #fff;
}

.admin-nav button.active {
  background: #ff4500;
  color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 15px;
}

.section-header h2 {
  color: #ff8c5a;
}

.btn-add {
  padding: 8px 16px;
  background: rgba(255, 69, 0, 0.3);
  border: 1px solid #ff8c00;
  color: #ff8c00;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
}

.btn-add:hover {
  background: #ff8c00;
  color: #fff;
}

.admin-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 69, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 8px;
}

.question-item {
  flex-direction: column;
  align-items: stretch;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.question-text {
  color: #f0e0d0;
  font-size: 1.05rem;
}

.question-options {
  color: #888;
  font-size: 0.9rem;
}

.question-correct {
  color: #66ff99;
  font-size: 0.9rem;
}

.topic-desc {
  color: #888;
  font-size: 0.85rem;
  margin-left: 8px;
}

.admin-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: 0.3s;
}

.btn-edit:hover {
  background: rgba(255, 140, 0, 0.3);
}

.btn-delete:hover {
  background: rgba(255, 51, 51, 0.3);
}

.add-form {
  background: rgba(255, 69, 0, 0.05);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 69, 0, 0.2);
  margin-bottom: 20px;
}

.add-form h3 {
  margin-bottom: 15px;
  color: #ff8c5a;
}

.add-form input,
.add-form select,
.add-form textarea {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 69, 0, 0.3);
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
}

.add-form input:focus,
.add-form select:focus,
.add-form textarea:focus {
  outline: none;
  border-color: #ff4500;
  background: rgba(255, 69, 0, 0.1);
}

.add-form select option {
  background: #1b0e0b;
}

.options-group {
  margin: 10px 0;
}

.options-group h4 {
  color: #ffa07a;
  margin-bottom: 8px;
}

.option-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.option-input span {
  color: #ff8c5a;
  font-weight: 700;
  min-width: 25px;
}

.option-input input {
  margin-bottom: 0;
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-save {
  background: #ff4500;
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.btn-save:hover {
  background: #cc3700;
  transform: scale(1.02);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid #666;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>