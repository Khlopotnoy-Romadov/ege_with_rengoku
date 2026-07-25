import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SubjectView from '../views/SubjectView.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/subject/:slug', component: SubjectView }
];

export default createRouter({
  history: createWebHistory(),
  routes
});