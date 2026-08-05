export const mathData = {
  id: 'math',
  name: 'Математика',
  icon: '📐',
  topics: [
    {
      id: 'algebra',
      name: '📐 Алгебра',
      description: 'Уравнения, функции и прогрессии',
      questions: [
        {
          id: 'math-1',
          text: 'Решите уравнение: 2x + 5 = 15',
          answerType: 'number',
          correctAnswer: '5',
          hint: 'Перенесите 5 в правую часть',
          points: 1
        },
        {
          id: 'math-2',
          text: 'Найдите значение выражения: 3² + 4²',
          answerType: 'number',
          correctAnswer: '25',
          hint: 'Возведите числа в квадрат',
          points: 1
        }
      ]
    }
  ]
};