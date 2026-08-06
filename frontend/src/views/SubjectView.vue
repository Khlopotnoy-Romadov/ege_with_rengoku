<template>
  <FlameBackground>
    <div class="subject-view">
      <div class="view-header">
        <button class="btn-back" @click="$router.push('/')">← 戻る (Назад)</button>
        <ThemeToggle />
      </div>

      <h2 class="subject-title">{{ subjectData?.name || 'Загрузка...' }}</h2>

      <div v-if="loading" class="loading">🔥 Загрузка...</div>

      <!-- Список вариантов -->
      <template v-else-if="!loading && subjectData && !currentTopic && !showResultsPage">
        <YearSelector
          :availableYears="availableYears"
          :selectedYear="selectedYear"
          @select="selectYear"
        />

        <div v-for="(variants, category) in currentYearData" :key="category" class="category-block">
          <h3 class="category-title">{{ category }}</h3>
          
          <div v-if="variants.length === 0" class="category-empty">
            Нет вариантов в этой категории
          </div>

          <div v-else class="topics-list">
            <div
              v-for="variant in variants"
              :key="variant.id"
              class="topic-card"
            >
              <div class="topic-info">
                <h3>🔥 {{ variant.name }}</h3>
                <p>{{ variant.description || 'Вариант ЕГЭ по информатике' }}</p>
                <span class="question-count">{{ variant.questions?.length || 0 }} заданий</span>
              </div>
              <div class="topic-actions">
                <button class="btn-start" @click="startTopic(variant)">⚔️ Пройти</button>
                <router-link
                  :to="`/subject/${$route.params.slug}/full/${variant.id}`"
                  class="btn-view"
                >
                  📄 Просмотреть вариант
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- TestRunner -->
      <TestRunner
        v-if="currentTopic"
        :topic="currentTopic"
        @finish="finishTopic"
        @restart="finishTopic"
        @showResults="showResults"
      />

      <!-- Страница результатов -->
      <ResultsPage
        v-else-if="showResultsPage"
        :topic="resultsData.topic"
        :results="resultsData.results"
        :score="resultsData.score"
        :total="resultsData.total"
        @back="backToVariants"
        @retry="retryVariant"
      />

      <!-- Пусто -->
      <div v-else-if="!loading && !subjectData" class="empty">
        <p>📭 Предмет не найден</p>
      </div>
    </div>
  </FlameBackground>
</template>

<script>
import { fetchSubject, fetchInformaticsByYear } from '@/api/subject';
import FlameBackground from '@/components/FlameBackground.vue';
import TestRunner from '@/components/TestRunner.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import YearSelector from '@/components/YearSelector.vue';
import ResultsPage from '@/components/ResultsPage.vue';

export default {
  name: 'SubjectView',
  components: { FlameBackground, TestRunner, ThemeToggle, YearSelector, ResultsPage },
  inject: ['mentor'],
  data() {
    return {
      subjectData: null,
      currentTopic: null,
      loading: true,
      availableYears: [],
      selectedYear: 2026,
      byYear: null,
      showResultsPage: false,
      resultsData: {
        topic: null,
        results: [],
        score: 0,
        total: 0
      }
    };
  },
  computed: {
    currentYearData() {
      if (!this.byYear || !this.byYear[this.selectedYear]) return {};
      return this.byYear[this.selectedYear].categories || {};
    }
  },
  async created() {
    const slug = this.$route.params.slug;
    try {
      this.loading = true;
      
      if (slug === 'informatics') {
        const data = await fetchInformaticsByYear();
        this.byYear = data;
        this.availableYears = Object.keys(data).map(Number).sort((a, b) => b - a);
        this.selectedYear = this.availableYears[0] || 2026;
        
        this.subjectData = {
          id: 'informatics',
          name: 'Информатика',
          icon: '💻',
          topics: []
        };
      } else {
        this.subjectData = await fetchSubject(slug);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      this.subjectData = null;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    selectYear(year) {
      this.selectedYear = year;
      this.currentTopic = null;
      this.showResultsPage = false;
    },
    startTopic(topic) {
      if (topic && topic.questions && topic.questions.length > 0) {
        this.currentTopic = topic;
        this.showResultsPage = false;
      } else {
        console.warn('⚠️ В варианте нет вопросов!');
        alert('В этом варианте пока нет вопросов');
      }
    },
    finishTopic() {
      this.currentTopic = null;
    },
    showResults(data) {
      this.resultsData = data;
      this.showResultsPage = true;
      this.currentTopic = null;
    },
    backToVariants() {
      this.showResultsPage = false;
      this.currentTopic = null;
    },
    retryVariant() {
      this.showResultsPage = false;
      this.currentTopic = this.resultsData.topic;
    }
  }
};
</script>