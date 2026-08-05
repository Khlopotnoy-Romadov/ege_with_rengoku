<template>
  <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Включить светлую тему' : 'Включить темную тему'">
    <span class="theme-icon">
      <span v-if="isDark">🌙</span>
      <span v-else>☀️</span>
    </span>
    <span class="theme-label">{{ isDark ? 'Темная' : 'Светлая' }}</span>
  </button>
</template>

<script>
import { useTheme } from '@/composables/useTheme';
import { computed } from 'vue';

export default {
  name: 'ThemeToggle',
  setup() {
    const { theme, toggleTheme } = useTheme();
    
    const isDark = computed(() => theme.value === 'dark');
    
    return {
      isDark,
      toggleTheme
    };
  }
};
</script>