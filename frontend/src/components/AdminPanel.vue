<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>🔥 Панель управления</h1>
      <div class="header-actions">
        <ThemeToggle />
        <router-link to="/" class="btn-exit">🏠 На главную</router-link>
      </div>
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

          <!-- Тип ответа пользователя -->
          <div class="answer-type-group">
            <h4>✍️ Формат ответа пользователя:</h4>
            <select v-model="newQuestion.answer_type">
              <option value="text">Текстовый ввод</option>
              <option value="number">Число</option>
              <option value="choice">Выбор из вариантов</option>
            </select>
          </div>

          <!-- Варианты ответов (для типа choice) -->
          <div v-if="newQuestion.question_type === 'choice'" class="options-group">
            <h4>Варианты ответов:</h4>
            <div v-for="(option, index) in newQuestion.options" :key="index" class="option-input">
              <span>{{ String.fromCharCode(65 + index) }}.</span>
              <input v-model="newQuestion.options[index]" :placeholder="`Вариант ${String.fromCharCode(65 + index)}`">
              <button v-if="newQuestion.options.length > 2" @click="removeOption(index)" class="btn-remove-option">✕</button>
            </div>
            <button @click="addOption" class="btn-add-option">➕ Добавить вариант</button>
            
            <select v-model="newQuestion.correct_answer" class="correct-select">
              <option value="">Правильный ответ</option>
              <option v-for="(_, index) in newQuestion.options" :key="index" :value="String.fromCharCode(65 + index)">
                {{ String.fromCharCode(65 + index) }}
              </option>
            </select>
          </div>

          <!-- Правильный ответ для ввода -->
          <div v-if="newQuestion.question_type === 'input'" class="input-answer-group">
            <h4>Правильный ответ:</h4>
            <input v-model="newQuestion.correct_answer" placeholder="Введите правильный ответ">
          </div>

          <!-- Подсказка -->
          <input v-model="newQuestion.hint" placeholder="Подсказка (необязательно)">
          <input v-model.number="newQuestion.points" placeholder="Баллы (по умолчанию 1)" type="number" min="1">

          <!-- Медиа-контент -->
          <div class="media-group">
            <h4>📎 Прикреплённые файлы/изображения:</h4>
            <div class="media-type-select">
              <label>
                <input type="radio" v-model="newQuestion.media_type" value="none">
                Без медиа
              </label>
              <label>
                <input type="radio" v-model="newQuestion.media_type" value="image">
                🖼️ Изображение
              </label>
              <label>
                <input type="radio" v-model="newQuestion.media_type" value="file">
                📄 Файл
              </label>
              <label>
                <input type="radio" v-model="newQuestion.media_type" value="both">
                🖼️+📄 Изображение и файл
              </label>
            </div>

            <div v-if="newQuestion.media_type !== 'none'" class="media-fields">
              <input v-model="newQuestion.media_url" placeholder="URL файла/изображения (например: /uploads/image.png)">
              <textarea v-model="newQuestion.media_description" placeholder="Описание медиа (для изображений)" rows="2"></textarea>
              <small class="media-hint">
                💡 Для файлов из заданий: загрузите файлы в папку public/uploads/
              </small>
            </div>
          </div>

          <div class="form-actions">
            <button @click="saveQuestion" class="btn-save">💾 Сохранить</button>
            <button @click="showAddQuestion = false" class="btn-cancel">❌ Отмена</button>
          </div>
        </div>

        <!-- Список вопросов -->
        <div v-for="question in questions" :key="question.id" class="admin-item question-item">
          <div class="question-info">
            <span class="question-type-badge">{{ question.question_type === 'input' ? '✍️ Ввод' : '📝 Выбор' }}</span>
            <span class="answer-type-badge">{{ getAnswerTypeLabel(question.answer_type) }}</span>
            <strong>{{ getTopicName(question.topic_id) }}</strong>
            <span class="question-text">{{ question.question_text }}</span>
            <span v-if="question.media_type && question.media_type !== 'none'" class="media-badge">
              📎 {{ question.media_type === 'image' ? 'Изображение' : question.media_type === 'file' ? 'Файл' : 'Изображение + Файл' }}
            </span>
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
import ThemeToggle from '@/components/ThemeToggle.vue';

const API_BASE = 'http://127.0.0.1:8000/api/admin';

export default {
  name: 'AdminPanel',
  components: { ThemeToggle },
  data() {
    return {
      activeTab: 'subjects',
      
      subjects: [],
      topics: [],
      questions: [],
      
      showAddSubject: false,
      newSubject: { name: '', slug: '', icon: '' },
      editingSubject: null,
      
      showAddTopic: false,
      newTopic: { subject_id: '', name: '', description: '' },
      editingTopic: null,
      
      showAddQuestion: false,
      newQuestion: {
        topic_id: '',
        question_text: '',
        question_type: 'input',
        options: [],
        correct_answer: '',
        hint: '',
        points: 1,
        media_type: 'none',
        media_url: '',
        media_description: '',
        answer_type: 'text'
      },
      editingQuestion: null
    };
  },
  mounted() {
    this.loadAll();
  },
  methods: {
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

    getSubjectName(id) {
      const subject = this.subjects.find(s => s.id === id);
      return subject ? subject.name : 'Неизвестный предмет';
    },

    getTopicName(id) {
      const topic = this.topics.find(t => t.id === id);
      return topic ? topic.name : 'Неизвестная тема';
    },

    getAnswerTypeLabel(type) {
      const labels = {
        text: 'Текст',
        number: 'Число',
        choice: 'Выбор'
      };
      return labels[type] || type;
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
        options: [],
        correct_answer: '',
        hint: '',
        points: 1,
        media_type: 'none',
        media_url: '',
        media_description: '',
        answer_type: 'text'
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
        points: question.points || 1,
        media_type: question.media_type || 'none',
        media_url: question.media_url || '',
        media_description: question.media_description || '',
        answer_type: question.answer_type || 'text'
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
          points: this.newQuestion.points || 1,
          media_type: this.newQuestion.media_type,
          media_url: this.newQuestion.media_url,
          media_description: this.newQuestion.media_description,
          answer_type: this.newQuestion.answer_type
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
          question_type: 'input',
          options: [],
          correct_answer: '',
          hint: '',
          points: 1,
          media_type: 'none',
          media_url: '',
          media_description: '',
          answer_type: 'text'
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
.admin-panel {
  background: var(--bg-secondary, #1b0e0b);
  border-radius: 16px;
  padding: 30px;
  color: var(--text-primary, #f0e0d0);
  max-width: 900px;
  margin: 40px auto;
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.15));
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-header h1 {
  font-size: 2rem;
  background: linear-gradient(45deg, #ff4500, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-exit {
  padding: 8px 16px;
  background: var(--button-bg, rgba(255, 69, 0, 0.15));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.2));
  border-radius: 20px;
  color: var(--text-secondary, #ffa07a);
  text-decoration: none;
  transition: 0.3s;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-exit:hover {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
}

.admin-nav {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.admin-nav button {
  padding: 10px 20px;
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.2));
  background: transparent;
  color: var(--text-secondary, #ffa07a);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
}

.admin-nav button:hover {
  background: rgba(255, 69, 0, 0.15);
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
  background: rgba(255, 69, 0, 0.2);
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
  background: var(--bg-card, rgba(255, 69, 0, 0.05));
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.05));
  transition: background 0.3s ease, border-color 0.3s ease;
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
  color: var(--text-primary, #f0e0d0);
  font-size: 1.05rem;
}

.question-options {
  color: var(--text-muted, #888);
  font-size: 0.9rem;
}

.question-correct {
  color: #66ff99;
  font-size: 0.9rem;
}

.topic-desc {
  color: var(--text-muted, #888);
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
  background: rgba(255, 140, 0, 0.25);
}

.btn-delete:hover {
  background: rgba(255, 51, 51, 0.25);
}

.add-form {
  background: var(--bg-card, rgba(255, 69, 0, 0.03));
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.1));
  margin-bottom: 20px;
  transition: background 0.3s ease, border-color 0.3s ease;
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
  background: var(--bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.15));
  color: var(--text-primary, #f0e0d0);
  border-radius: 8px;
  font-size: 1rem;
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.add-form input:focus,
.add-form select:focus,
.add-form textarea:focus {
  outline: none;
  border-color: #ff4500;
  background: rgba(255, 69, 0, 0.08);
}

.add-form select option {
  background: var(--bg-secondary, #1b0e0b);
  color: var(--text-primary, #f0e0d0);
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

.btn-add-option {
  background: rgba(255, 69, 0, 0.15);
  border: 1px dashed #ff4500;
  color: #ff8c5a;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.3s;
}

.btn-add-option:hover {
  background: rgba(255, 69, 0, 0.25);
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

.question-type {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  padding: 10px;
  background: var(--bg-card, rgba(255, 69, 0, 0.03));
  border-radius: 8px;
  transition: background 0.3s ease;
}

.question-type label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary, #ddd);
  cursor: pointer;
}

.question-type input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #ff4500;
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

.answer-type-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 140, 0, 0.2);
  color: #ffcc66;
  margin-right: 10px;
}

.media-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(0, 200, 255, 0.15);
  color: #66ddff;
  margin-right: 10px;
}

.media-group {
  margin: 15px 0;
  padding: 15px;
  background: rgba(0, 200, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(0, 200, 255, 0.08);
}

.media-group h4 {
  color: #66ddff;
  margin-bottom: 10px;
}

.media-type-select {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
}

.media-type-select label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary, #ccc);
  cursor: pointer;
}

.media-type-select input[type="radio"] {
  accent-color: #ff4500;
}

.media-fields {
  margin-top: 10px;
}

.media-hint {
  display: block;
  color: var(--text-muted, #888);
  font-size: 0.85rem;
  margin-top: 5px;
}

.answer-type-group {
  margin: 10px 0;
}

.answer-type-group h4 {
  color: #ffa07a;
  margin-bottom: 8px;
}

.answer-type-group select {
  display: block;
  width: 100%;
  padding: 10px;
  background: var(--bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.15));
  color: var(--text-primary, #f0e0d0);
  border-radius: 8px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
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
  background: var(--button-bg, rgba(255, 255, 255, 0.08));
  color: var(--text-secondary, #fff);
  border: 1px solid var(--border-color, #666);
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>