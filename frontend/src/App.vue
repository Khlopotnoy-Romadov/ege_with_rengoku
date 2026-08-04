<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Подключаем японский шрифт */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');

/* === СВЕТЛАЯ ТЕМА (по умолчанию) === */
:root,
[data-theme="light"] {
  --bg-primary: #f5f0eb;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --bg-card-hover: #f0ebe5;
  --bg-input: #ffffff;
  --text-primary: #1a0e08;
  --text-secondary: #4a3a32;
  --text-muted: #8a7a72;
  --border-color: rgba(180, 100, 60, 0.2);
  --shadow-color: rgba(180, 100, 60, 0.1);
  --button-bg: rgba(255, 69, 0, 0.08);
  --scrollbar-track: #f0ebe5;
  --scrollbar-thumb: #cc8a6a;
  --flame-opacity: 0.05;
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(180, 100, 60, 0.15);
  --topic-bg: rgba(255, 255, 255, 0.85);
  --test-bg: rgba(255, 255, 255, 0.9);
  --mentor-color: #ff4500;
}

/* === ТЕМНАЯ ТЕМА === */
[data-theme="dark"] {
  --bg-primary: #0a0503;
  --bg-secondary: #1b0e0b;
  --bg-card: rgba(30, 10, 5, 0.85);
  --bg-card-hover: rgba(40, 16, 8, 0.9);
  --bg-input: rgba(255, 255, 255, 0.05);
  --text-primary: #f0e0d0;
  --text-secondary: #d4a088;
  --text-muted: #8a7a72;
  --border-color: rgba(255, 69, 0, 0.2);
  --shadow-color: rgba(255, 69, 0, 0.1);
  --button-bg: rgba(255, 69, 0, 0.15);
  --scrollbar-track: #1b0e0b;
  --scrollbar-thumb: #ff4500;
  --flame-opacity: 0.1;
  --glass-bg: rgba(10, 5, 3, 0.85);
  --glass-border: rgba(255, 69, 0, 0.15);
  --topic-bg: rgba(20, 8, 4, 0.8);
  --test-bg: rgba(10, 5, 3, 0.9);
  --mentor-color: #ff4500;
}

body {
  font-family: 'Segoe UI', 'Noto Sans JP', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
  transition: background 0.3s ease, color 0.3s ease;
}

/* Стилизация скроллбара */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb);
  opacity: 0.8;
}
</style>