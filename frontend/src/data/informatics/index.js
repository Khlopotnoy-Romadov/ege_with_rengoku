// frontend/src/data/informatics/index.js

import { variant1 } from './krylov/variant1';
// import { variant2 } from './krylov/variant2';
// import { demo } from './fipi/demo';

// Все варианты по информатике
export const informaticsTopics = [
  variant1,
  // variant2,
  // demo,
];

// Экспортируем сам предмет
export const informaticsData = {
  id: 'informatics',
  name: 'Информатика',
  icon: '💻',
  topics: informaticsTopics
};