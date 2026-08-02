<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>🔥 Панель управления</h1>
      <router-link to="/" class="btn-exit">🏠 На главную</router-link>
    </div>
    
    <div class="admin-nav">
      <button @click="activeTab = 'subjects'" :class="{ active: activeTab === 'subjects' }">
        📚 Предметы
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
            <button @click="startEditSubject(subject)" class="btn-edit">✏️</button>
            <button @click="deleteSubject(subject.id)" class="btn-delete">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Форма добавления/редактирования -->
      <div v-if="activeTab === 'add'" class="add-form">
        <h3>{{ editingSubject ? '✏️ Редактировать предмет' : '➕ Добавить предмет' }}</h3>
        
        <input v-model="formSubject.name" placeholder="Название предмета">
        <input v-model="formSubject.slug" placeholder="Slug (на английском)">
        <input v-model="formSubject.icon" placeholder="Иконка (эмодзи)">
        
        <div class="form-actions">
          <button @click="saveSubject" class="btn-save">💾 Сохранить</button>
          <button v-if="editingSubject" @click="cancelEdit" class="btn-cancel">❌ Отмена</button>
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
      subjects: [],
      editingSubject: null,
      formSubject: {
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
      try {
        const response = await axios.get(`${API_BASE}/subjects`, {
          headers: { 'X-Admin-Token': 'rengoku2026' }
        });
        this.subjects = response.data;
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        alert('Ошибка загрузки предметов');
      }
    },

    startEditSubject(subject) {
      this.editingSubject = subject;
      this.formSubject = {
        name: subject.name,
        slug: subject.slug,
        icon: subject.icon || ''
      };
      this.activeTab = 'add';
    },

    cancelEdit() {
      this.editingSubject = null;
      this.formSubject = { name: '', slug: '', icon: '' };
      this.activeTab = 'subjects';
    },

    async saveSubject() {
      try {
        if (this.editingSubject) {
          await axios.put(
            `${API_BASE}/subjects/${this.editingSubject.id}`,
            this.formSubject,
            {
              headers: {
                'X-Admin-Token': 'rengoku2026',
                'Content-Type': 'application/json'
              }
            }
          );
          alert('✅ Предмет обновлён!');
        } else {
          await axios.post(
            `${API_BASE}/subjects`,
            this.formSubject,
            {
              headers: {
                'X-Admin-Token': 'rengoku2026',
                'Content-Type': 'application/json'
              }
            }
          );
          alert('✅ Предмет добавлен!');
        }
        
        this.formSubject = { name: '', slug: '', icon: '' };
        this.editingSubject = null;
        this.activeTab = 'subjects';
        this.loadSubjects();
      } catch (error) {
        console.error('Ошибка:', error);
        if (error.response) {
          alert(`Ошибка: ${error.response.status}\n${JSON.stringify(error.response.data, null, 2)}`);
        } else {
          alert('Ошибка при сохранении. Проверьте консоль.');
        }
      }
    },

    async deleteSubject(id) {
      if (confirm('Удалить предмет?')) {
        try {
          await axios.delete(`${API_BASE}/subjects/${id}`, {
            headers: { 'X-Admin-Token': 'rengoku2026' }
          });
          alert('✅ Предмет удалён');
          this.loadSubjects();
        } catch (error) {
          console.error('Ошибка удаления:', error);
          alert('Ошибка при удалении');
        }
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
}

.add-form h3 {
  margin-bottom: 15px;
  color: #ff8c5a;
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
  font-size: 1rem;
}

.add-form input:focus {
  outline: none;
  border-color: #ff4500;
  background: rgba(255, 69, 0, 0.1);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
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