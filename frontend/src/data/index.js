import { subjects } from './subjects';
import { informaticsData } from './informatics';
import { mathData } from './math';

// Маппинг предметов к данным
export const subjectDataMap = {
  informatics: informaticsData,
  math: mathData,
  // Добавляйте новые предметы сюда
  // russian: russianData,
  // python: pythonData,
  // frontend: frontendData,
  // php: phpData,
  // chess: chessData,
};

// Экспортируем всё
export { subjects };