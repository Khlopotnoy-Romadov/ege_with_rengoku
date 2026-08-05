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