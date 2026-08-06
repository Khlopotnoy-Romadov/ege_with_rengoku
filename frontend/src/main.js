import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { mentorState } from './mentor';

import './styles/main.css';
import './styles/components/flame-background.css';
import './styles/components/admin-panel.css';
import './styles/components/test-runner.css';
import './styles/components/full-variant.css';
import './styles/components/subject-card.css';
import './styles/components/table-renderer.css';
import './styles/components/theme-toggle.css';
import './styles/views/home.css';
import './styles/views/subject-view.css';
import './styles/components/mentor-selector.css';
import './styles/components/year-selector.css'

const app = createApp(App);
app.use(router);
app.provide('mentor', mentorState);
app.mount('#app');