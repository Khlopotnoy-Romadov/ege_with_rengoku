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

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid var(--border-color, rgba(255, 69, 0, 0.3));
  border-radius: 30px;
  background: var(--button-bg, rgba(255, 255, 255, 0.1));
  color: var(--text-color, #333);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
}

.theme-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--shadow-color, rgba(255, 69, 0, 0.2));
}

.theme-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.theme-label {
  font-size: 0.85rem;
}

/* Темная тема */
[data-theme="dark"] .theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 69, 0, 0.3);
  color: #ffa07a;
}

[data-theme="dark"] .theme-toggle:hover {
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.3);
}

/* Светлая тема */
[data-theme="light"] .theme-toggle {
  background: rgba(255, 69, 0, 0.1);
  border-color: rgba(255, 69, 0, 0.3);
  color: #cc3700;
}

[data-theme="light"] .theme-toggle:hover {
  background: rgba(255, 69, 0, 0.2);
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.15);
}

/* Адаптив */
@media (max-width: 768px) {
  .theme-toggle {
    padding: 6px 12px;
  }
  
  .theme-label {
    display: none;
  }
}
</style>