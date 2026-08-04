<template>
  <div class="mentor-selector">
    <button class="mentor-toggle" @click="showModal = !showModal">
      <img 
        v-if="mentor.current.avatar" 
        :src="mentor.current.avatar" 
        :alt="mentor.current.name"
        class="mentor-toggle-avatar"
      />
      <span v-else class="mentor-emoji">{{ mentor.current.emoji }}</span>
      <span class="mentor-name">{{ mentor.current.name }}</span>
      <span class="mentor-arrow">▼</span>
    </button>

    <div v-if="showModal" class="mentor-modal" @click.self="showModal = false">
      <div class="mentor-modal-content">
        <div class="mentor-modal-header">
          <h2>Выбери своего наставника 🎯</h2>
          <button class="mentor-modal-close" @click="showModal = false">✕</button>
        </div>

        <div class="mentor-grid">
          <div 
            v-for="m in mentors" 
            :key="m.id"
            class="mentor-card"
            :class="{ active: mentor.current.id === m.id }"
            @click="selectMentor(m)"
          >
            <div class="mentor-card-avatar" :style="{ background: m.color }">
              <img 
                v-if="m.avatar" 
                :src="m.avatar" 
                :alt="m.name"
                class="mentor-avatar-img"
              />
              <span v-else class="mentor-card-emoji">{{ m.emoji }}</span>
            </div>
            <div class="mentor-card-info">
              <h3>{{ m.name }}</h3>
              <p class="mentor-card-anime">{{ m.anime }}</p>
              <p class="mentor-card-quote">"{{ m.quote }}"</p>
              <p class="mentor-card-desc">{{ m.description }}</p>
            </div>
            <div v-if="mentor.current.id === m.id" class="mentor-card-check">✅</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mentors } from '@/data/mentors';

export default {
  name: 'MentorSelector',
  inject: ['mentor'],
  data() {
    return {
      mentors: mentors,
      showModal: false
    };
  },
  mounted() {
    this.mentor.load();
  },
  methods: {
    selectMentor(m) {
      this.mentor.set(m);
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
/* ... все стили как раньше ... */
.mentor-toggle-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.mentor-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--button-bg, rgba(255, 69, 0, 0.1));
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.2));
  border-radius: 30px;
  color: var(--text-primary, #333);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 600;
}

.mentor-toggle:hover {
  transform: scale(1.03);
  box-shadow: 0 0 20px var(--shadow-color, rgba(255, 69, 0, 0.1));
}

.mentor-emoji {
  font-size: 1.3rem;
}

.mentor-name {
  font-size: 0.9rem;
}

.mentor-arrow {
  font-size: 0.7rem;
  opacity: 0.6;
}

.mentor-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.mentor-modal-content {
  background: var(--bg-secondary, #1b0e0b);
  border-radius: 20px;
  padding: 30px;
  max-width: 700px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color, rgba(255, 69, 0, 0.1));
}

.mentor-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mentor-modal-header h2 {
  font-size: 1.6rem;
  color: var(--text-primary, #f0e0d0);
}

.mentor-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted, #888);
  transition: 0.3s;
}

.mentor-modal-close:hover {
  color: #ff4500;
  transform: rotate(90deg);
}

.mentor-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mentor-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--bg-card, rgba(255, 255, 255, 0.03));
  border: 2px solid var(--border-color, rgba(255, 255, 255, 0.05));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.mentor-card:hover {
  transform: translateX(8px);
  border-color: var(--border-color, rgba(255, 69, 0, 0.2));
}

.mentor-card.active {
  border-color: #ff4500;
  background: rgba(255, 69, 0, 0.06);
}

.mentor-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  overflow: hidden;
}

.mentor-avatar-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.mentor-card-emoji {
  font-size: 2rem;
}

.mentor-card-info {
  flex: 1;
}

.mentor-card-info h3 {
  font-size: 1.1rem;
  color: var(--text-primary, #f0e0d0);
  margin-bottom: 2px;
}

.mentor-card-anime {
  font-size: 0.8rem;
  color: var(--text-muted, #888);
  margin-bottom: 4px;
}

.mentor-card-quote {
  font-size: 0.9rem;
  color: var(--text-secondary, #d4a088);
  font-style: italic;
}

.mentor-card-desc {
  font-size: 0.85rem;
  color: var(--text-muted, #888);
  margin-top: 4px;
}

.mentor-card-check {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .mentor-modal-content {
    padding: 20px;
  }
  
  .mentor-card {
    flex-wrap: wrap;
  }
}
</style>