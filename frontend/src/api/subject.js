import { subjects, subjectDataMap, informaticsByYear, availableYears } from '@/data';

// Получить список всех предметов
export async function mapSubjects() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return subjects;
}

// Получить полные данные по предмету
export async function fetchSubject(slug) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = subjectDataMap[slug];
  if (!data) {
    throw new Error(`Предмет "${slug}" не найден`);
  }
  return data;
}

// Получить данные по годам для информатики
export async function fetchInformaticsByYear() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return informaticsByYear;
}

// Получить список доступных годов
export async function fetchAvailableYears() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return availableYears;
}