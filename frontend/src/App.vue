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

body {
  font-family: 'Segoe UI', 'Noto Sans JP', sans-serif;
  background: #0a0503;
  color: #fff;
  overflow-x: hidden;
}

/* Подключаем японский шрифт */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
</style>