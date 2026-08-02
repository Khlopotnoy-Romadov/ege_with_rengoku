<template>
  <div class="admin-panel">
    <h1>🔥 Панель управления</h1>
    
    <div class="admin-nav">
      <button @click="activeTab = 'subjects'" :class="{ active: activeTab === 'subjects' }">
        📚 Предметы
      </button>
      <button @click="activeTab = 'topics'" :class="{ active: activeTab === 'topics' }">
        📝 Темы
      </button>
      <button @click="activeTab = 'questions'" :class="{ active: activeTab === 'questions' }">
        ❓ Вопросы
      </button>
      <button @click="activeTab = 'add'" class="btn-add" :class="{ active: activeTab === 'add' }">
        ➕ Добавить
      </button>
    </div>

    <div class="admin-content">
      <!-- Список предметов -->
      <div v-if="activeTab === 'subjects'">
        <div v-for="subject in subjects" :key="subject.id" class="admin-item">
          <span>{{ subject.icon }} {{ subject.name }} ({{ subject.slug }})</span>
          <div class="admin-actions">
            <button @click="editSubject(subject)" class="btn-edit">✏️</button>
            <button @click="deleteSubject(subject.id)" class="btn-delete">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Форма добавления -->
      <div v-if="activeTab === 'add'" class="add-form">
        <h3>Добавить предмет</h3>
        <input v-model="newSubject.name" placeholder="Название предмета">
        <input v-model="newSubject.slug" placeholder="Slug (на английском)">
        <input v-model="newSubject.icon" placeholder="Иконка (эмодзи)">
        <button @click="addSubject" class="btn-save">💾 Сохранить</button>
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
      subjects: [],
      newSubject: {
        name: '',
        slug: '',
        icon: ''
      }
    };
  },
  mounted() {
    this.loadSubjects();
  },
  methods: {
    async loadSubjects() {
      const response = await axios.get(`${API_BASE}/subjects`, {
        headers: { 'X-Admin-Token': 'rengoku2026' }
      });
      this.subjects = response.data;
    },
    async addSubject() {
      await axios.post(`${API_BASE}/subjects`, this.newSubject, {
        headers: { 'X-Admin-Token': 'rengoku2026' }
      });
      this.newSubject = { name: '', slug: '', icon: '' };
      this.loadSubjects();
    },
    async deleteSubject(id) {
      if (confirm('Удалить предмет?')) {
        await axios.delete(`${API_BASE}/subjects/${id}`, {
          headers: { 'X-Admin-Token': 'rengoku2026' }
        });
        this.loadSubjects();
      }
    }
  }
};
</script>

<style scoped>
.admin-panel {
  background: rgba(10, 5, 3, 0.95);
  border-radius: 16px;
  padding: 30px;
  color: #fff;
  max-width: 800px;
  margin: 40px auto;
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

.admin-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 69, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 8px;
}

.admin-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-edit:hover { color: #ff8c00; }
.btn-delete:hover { color: #ff3333; }

.add-form {
  background: rgba(255, 69, 0, 0.05);
  padding: 20px;
  border-radius: 12px;
}

.add-form input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 69, 0, 0.3);
  color: #fff;
  border-radius: 8px;
}

.btn-save {
  background: #ff4500;
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save:hover {
  background: #cc3700;
}
</style>