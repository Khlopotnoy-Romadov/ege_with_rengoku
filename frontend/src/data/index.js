import { subjects } from './subjects';
import { informaticsData, informaticsByYear, availableYears } from './informatics';

const subjectDataMap = {
  informatics: informaticsData,
  // math: mathData,
  // russian: russianData,
};

// Экспортируем всё, что нужно
export { 
  subjects, 
  subjectDataMap, 
  informaticsByYear, 
  availableYears 
};