import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SubjectView from '../views/SubjectView.vue';
import AdminPanel from '../components/AdminPanel.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/subject/:slug', component: SubjectView },
  { path: '/admin', component: AdminPanel } 
];

export default createRouter({
  history: createWebHistory(),
  routes
});