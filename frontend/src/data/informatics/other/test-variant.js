export const testVariant = {
  id: 'test-variant',
  name: '🧪 Тестовый вариант (1 задание)',
  description: 'Тестовый вариант с одним заданием для проверки работы интерфейса',
  year: 2026,
  category: 'Другие варианты',
  questions: [
    {
      id: 'test-1',
      number: 1,
      type: 'Тестовое',
      difficulty: 'easy',
      text: 'Сколько будет 2 + 2 × 2?\n\nВведите ответ числом.',
      answerType: 'number',
      correctAnswer: '6',
      hint: 'Сначала умножение, потом сложение.',
      points: 1,
      media: null
    }
  ]
};