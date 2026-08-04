import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { mentorState } from './mentor';

const app = createApp(App);
app.use(router);
app.provide('mentor', mentorState);
app.mount('#app');