<template>
  <FlameBackground>
    <div class="home-container">
      <header class="anime-header">
        <div class="header-content">
          <div class="header-left">
            <h1>🔥 煉獄さんと EГЭ</h1>
            <p class="subtitle">「心を燃やせ！」 — Зажги своё сердце для экзамена</p>
          </div>
          <div class="header-right">
            <MentorSelector @change="onMentorChange" />
            <ThemeToggle />
            <router-link to="/admin" class="admin-link">⚙️ Панель управления</router-link>
          </div>
        </div>
      </header>

      <div class="welcome-mentor" v-if="mentor.current">
        <img 
          v-if="mentor.current.avatar" 
          :src="mentor.current.avatar" 
          :alt="mentor.current.name"
          class="welcome-avatar"
        />
        <span v-else class="welcome-emoji">{{ mentor.current.emoji }}</span>
        <span class="welcome-text">
          Сегодня с тобой занимается <strong>{{ mentor.current.name }}</strong>
          <span class="welcome-quote">«{{ mentor.current.quote }}»</span>
        </span>
      </div>

      <div class="subject-grid">
        <SubjectCard
          v-for="subject in subjects"
          :key="subject.id"
          :subject="subject"
          @click="navigateToSubject(subject.slug)"
        />
      </div>
    </div>
  </FlameBackground>
</template>

<script>
import { mapSubjects } from '@/api/subject';
import FlameBackground from '@/components/FlameBackground.vue';
import SubjectCard from '@/components/SubjectCard.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import MentorSelector from '@/components/MentorSelector.vue';

export default {
  name: 'Home',
  components: { FlameBackground, SubjectCard, ThemeToggle, MentorSelector },
  inject: ['mentor'],
  data() {
    return {
      subjects: []
    };
  },
  async created() {
    this.subjects = await mapSubjects();
    this.mentor.load();
  },
  methods: {
    navigateToSubject(slug) {
      this.$router.push(`/subject/${slug}`);
    },
    onMentorChange(mentor) {
      console.log('Наставник выбран:', mentor.name);
    }
  }
};
</script>