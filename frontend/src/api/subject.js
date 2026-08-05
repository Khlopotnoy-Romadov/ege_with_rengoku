import { subjects, subjectDataMap } from '@/data';

export async function mapSubjects() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return subjects;
}

export async function fetchSubject(slug) {
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = subjectDataMap[slug];
  if (!data) {
    throw new Error(`Предмет "${slug}" не найден`);
  }
  return data;
}