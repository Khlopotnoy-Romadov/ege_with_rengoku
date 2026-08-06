// Реальные варианты ЕГЭ
import { demo2026 } from './real/demo-2026';
import { early2026 } from './real/early-2026';
import { open2026 } from './real/open-2026';

// Варианты из сборника Крылова
import { variant1 } from './krylov/variant1';
// import { variant2 } from './krylov/variant2';

// Варианты СтатГрад
// import { statgrad2026 } from './statgrad/statgrad-2026';

// Другие варианты
// import { other2026 } from './other/other-2026';
import { testVariant } from './other/test-variant';


// ============================================================
// ГРУППИРОВКА ПО ГОДАМ И КАТЕГОРИЯМ
// ============================================================

export const informaticsByYear = {
  2026: {
    label: '2026',
    categories: {
      'Реальные варианты ЕГЭ': [demo2026, early2026, open2026],
      'Сборник С. С. Крылова 2026': [variant1],
      'Варианты СтатГрад': [],
      'Другие варианты': [testVariant]
    }
  },
  2025: {
    label: '2025',
    categories: {
      'Реальные варианты ЕГЭ': [],
      'Сборник С. С. Крылова 2025': [],
      'Варианты СтатГрад': [],
      'Другие варианты': []
    }
  },
  // 2024: {
  //   label: '2024',
  //   categories: {
  //     'Реальные варианты ЕГЭ': [real2024],
  //     'Сборник С. С. Крылова 2024': [],
  //     'Варианты СтатГрад': [],
  //     'Другие варианты': []
  //   }
  // },
  // 2023: { label: '2023', categories: { ... } },
  // 2022: { label: '2022', categories: { ... } },
  // 2021: { label: '2021', categories: { ... } },
};

// Список доступных годов (для навигации)
export const availableYears = Object.keys(informaticsByYear)
  .map(Number)
  .sort((a, b) => b - a); // по убыванию: 2026, 2025, ...

// Маппинг для совместимости со старым кодом (если нужно)
export const informaticsTopics = Object.values(informaticsByYear)
  .flatMap(year => Object.values(year.categories).flat());

export const informaticsData = {
  id: 'informatics',
  name: 'Информатика',
  icon: '💻',
  topics: informaticsTopics,
  byYear: informaticsByYear,
  availableYears: availableYears
};