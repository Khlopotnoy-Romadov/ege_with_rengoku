import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SubjectView from '../views/SubjectView.vue';
import AdminPanel from '../components/AdminPanel.vue';
import FullVariant from '../components/FullVariant.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/subject/:slug', component: SubjectView },
  { path: '/admin', component: AdminPanel },
  {
    path: '/subject/:slug/full/:topicId',
    component: FullVariant,
    name: 'FullVariant'
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});