export const informaticsData = {
  id: 'informatics',
  name: 'Информатика',
  icon: '💻',
  topics: [
    {
      id: 'variant1',
      name: '📝 Вариант 1 (демоверсия)',
      description: 'Полный вариант ЕГЭ по информатике (демоверсия 2026)',
      questions: [
        // ===== ЗАДАНИЕ 1 =====
        {
          id: 'ege-1',
          number: 1,
          type: 'Графы',
          difficulty: 'easy',
          text: 'На рисунке схема дорог Н-ского района изображена в виде графа. Определите длину дороги из пункта Б в пункт Д.',
          answerType: 'number',
          correctAnswer: '20',
          hint: 'Найдите на графе путь от Б до Д',
          points: 1,
          media: {
            type: 'image',
            url: '/ege/informatics/variant1/1.png',
            description: 'Схема дорог'
          }
        },
        // ===== ЗАДАНИЕ 2 =====
        {
          id: 'ege-2',
          number: 2,
          type: 'Логика',
          difficulty: 'medium',
          text: 'Логическая функция F задаётся выражением (x ∧ ¬y) ∨ (y ≡ z) ∨ ¬w. Определите, какому столбцу таблицы истинности соответствует каждая из переменных w, x, y, z.',
          answerType: 'text',
          correctAnswer: 'wxyz',
          hint: 'Постройте таблицу истинности и сравните столбцы',
          points: 1,
          media: {
            type: 'image',
            url: '/ege/informatics/variant1/2.png',
            description: 'Фрагмент таблицы истинности'
          }
        },
        // ===== ЗАДАНИЕ 3 =====
        {
          id: 'ege-3',
          number: 3,
          type: 'Базы данных',
          difficulty: 'easy',
          text: 'Определите, сколько килограммов сахара всех видов поступило за указанный период в магазины Заречного района.',
          answerType: 'number',
          correctAnswer: '150',
          hint: 'Используйте фильтры в таблице',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/3.ods',
            description: 'Файл базы данных'
          }
        },
        // ===== ЗАДАНИЕ 4 =====
        {
          id: 'ege-4',
          number: 4,
          type: 'Кодирование',
          difficulty: 'medium',
          text: 'По каналу связи передаются сообщения, содержащие только семь букв: А, Б, Г, И, М, Р, Я. Используется код, удовлетворяющий условию Фано. Кодовые слова для некоторых букв известны: А — 010, Б — 011, И — 10. Какое наименьшее количество двоичных знаков потребуется для кодирования слова ГРАММ?',
          answerType: 'number',
          correctAnswer: '11',
          hint: 'Постройте дерево Фано',
          points: 1
        },
        // ===== ЗАДАНИЕ 5 =====
        {
          id: 'ege-5',
          number: 5,
          type: 'Автоматы',
          difficulty: 'medium',
          text: 'Автомат обрабатывает натуральное число N. Укажите наименьшее число, большее 52, которое может являться результатом работы автомата.',
          answerType: 'number',
          correctAnswer: '55',
          hint: 'Переберите числа в порядке возрастания',
          points: 1
        },
        // ===== ЗАДАНИЕ 6 =====
        {
          id: 'ege-6',
          number: 6,
          type: 'Черепаха',
          difficulty: 'hard',
          text: 'Исполнитель Черепаха. Определите, при каком наименьшем натуральном х количество точек с целочисленными координатами внутри области окажется больше 400.',
          answerType: 'number',
          correctAnswer: '8',
          hint: 'Нарисуйте траекторию движения',
          points: 1
        },
        // ===== ЗАДАНИЕ 7 =====
        {
          id: 'ege-7',
          number: 7,
          type: 'Звукозапись',
          difficulty: 'easy',
          text: 'Производится звукозапись. Определите размер файла в Мбайт при повторной записи.',
          answerType: 'number',
          correctAnswer: '5',
          hint: 'Используйте формулу: V = f * t * i * k',
          points: 1
        },
        // ===== ЗАДАНИЕ 8 =====
        {
          id: 'ege-8',
          number: 8,
          type: 'Комбинаторика',
          difficulty: 'medium',
          text: 'Все 5-буквенные слова из букв А, О, У записаны в алфавитном порядке. Запишите слово, которое стоит на 210-м месте.',
          answerType: 'text',
          correctAnswer: 'УУУОА',
          hint: 'Используйте системы счисления',
          points: 1
        },
        // ===== ЗАДАНИЕ 9 =====
        {
          id: 'ege-9',
          number: 9,
          type: 'Электронные таблицы',
          difficulty: 'hard',
          text: 'Откройте файл электронной таблицы. Определите количество строк, удовлетворяющих условиям.',
          answerType: 'number',
          correctAnswer: '3',
          hint: 'Используйте встроенные функции Excel',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/9.xlsx',
            description: 'Файл электронной таблицы'
          }
        },
        // ===== ЗАДАНИЕ 10 =====
        {
          id: 'ege-10',
          number: 10,
          type: 'Анализ текста',
          difficulty: 'medium',
          text: 'Определите, сколько раз во второй истории «Понедельник начинается в субботу» встречаются слова на букву Я (заглавной или строчной) и содержащие не менее трёх букв.',
          answerType: 'number',
          correctAnswer: '5',
          hint: 'Используйте поиск в тексте',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/10.odt',
            description: 'Текст повести'
          }
        },
        // ===== ЗАДАНИЕ 11 =====
        {
          id: 'ege-11',
          number: 11,
          type: 'Информация',
          difficulty: 'medium',
          text: 'Сколько байт выделено для хранения дополнительных сведений об одном пользователе?',
          answerType: 'number',
          correctAnswer: '16',
          hint: 'Рассчитайте информационный объём',
          points: 1
        },
        // ===== ЗАДАНИЕ 12 =====
        {
          id: 'ege-12',
          number: 12,
          type: 'Редактор',
          difficulty: 'hard',
          text: 'Какая строка получится после выполнения программы для исполнителя Редактор?',
          answerType: 'text',
          correctAnswer: '57',
          hint: 'Выполните алгоритм по шагам',
          points: 1
        },
        // ===== ЗАДАНИЕ 13 =====
        {
          id: 'ege-13',
          number: 13,
          type: 'Сети',
          difficulty: 'hard',
          text: 'Для скольких различных значений маски это возможно?',
          answerType: 'number',
          correctAnswer: '3',
          hint: 'Используйте поразрядную конъюнкцию',
          points: 1
        },
        // ===== ЗАДАНИЕ 14 =====
        {
          id: 'ege-14',
          number: 14,
          type: 'Системы счисления',
          difficulty: 'hard',
          text: 'Сколько цифр 6 содержится в записи выражения 49^10 + 7^30 - 49 в системе счисления с основанием 7?',
          answerType: 'number',
          correctAnswer: '10',
          hint: 'Приведите выражение к виду 7^20 + ...',
          points: 1
        },
        // ===== ЗАДАНИЕ 15 =====
        {
          id: 'ege-15',
          number: 15,
          type: 'Логика',
          difficulty: 'hard',
          text: 'Сколько существует целых значений числа A, при которых формула тождественно истинна?',
          answerType: 'number',
          correctAnswer: '5',
          hint: 'Решите систему неравенств',
          points: 1
        },
        // ===== ЗАДАНИЕ 16 =====
        {
          id: 'ege-16',
          number: 16,
          type: 'Рекурсия',
          difficulty: 'easy',
          text: 'Чему равно значение функции F(5) + G(5)?',
          answerType: 'number',
          correctAnswer: '135',
          hint: 'Вычислите значения по формулам',
          points: 1
        },
        // ===== ЗАДАНИЕ 17 =====
        {
          id: 'ege-17',
          number: 17,
          type: 'Обработка данных',
          difficulty: 'hard',
          text: 'Определите количество пар элементов последовательности, для которых произведение делится на 10, затем максимальную сумму элементов таких пар.',
          answerType: 'text',
          correctAnswer: '12 45',
          hint: 'Напишите программу для обработки',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/17.txt',
            description: 'Файл с последовательностью'
          }
        },
        // ===== ЗАДАНИЕ 18 =====
        {
          id: 'ege-18',
          number: 18,
          type: 'Динамика',
          difficulty: 'hard',
          text: 'Определите максимальный и минимальный запас энергии робота после перехода в правую нижнюю клетку поля.',
          answerType: 'text',
          correctAnswer: '346 117',
          hint: 'Используйте динамическое программирование',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/18.xlsx',
            description: 'Таблица с числами'
          }
        },
        // ===== ЗАДАНИЕ 19 =====
        {
          id: 'ege-19',
          number: 19,
          type: 'Игры',
          difficulty: 'hard',
          text: 'Какое наименьшее число камней могло быть суммарно в двух кучах?',
          answerType: 'number',
          correctAnswer: '23',
          hint: 'Проанализируйте все возможные ходы',
          points: 1
        },
        // ===== ЗАДАНИЕ 20 =====
        {
          id: 'ege-20',
          number: 20,
          type: 'Игры',
          difficulty: 'hard',
          text: 'Укажите минимальное и максимальное значение S, при которых Петя не может выиграть первым ходом, но может выиграть вторым.',
          answerType: 'text',
          correctAnswer: '7 11',
          hint: 'Постройте дерево игры',
          points: 1
        },
        // ===== ЗАДАНИЕ 21 =====
        {
          id: 'ege-21',
          number: 21,
          type: 'Игры',
          difficulty: 'hard',
          text: 'Найдите минимальное S, при котором у Вани есть стратегия выиграть вторым ходом.',
          answerType: 'number',
          correctAnswer: '8',
          hint: 'Постройте дерево игры для Вани',
          points: 1
        },
        // ===== ЗАДАНИЕ 22 =====
        {
          id: 'ege-22',
          number: 22,
          type: 'Процессы',
          difficulty: 'hard',
          text: 'Определите минимальное время выполнения всех процессов в мс.',
          answerType: 'number',
          correctAnswer: '29',
          hint: 'Постройте граф зависимостей',
          points: 1,
          media: {
            type: 'image',
            url: '/ege/informatics/variant1/22.png',
            description: 'Схема процессов'
          }
        },
        // ===== ЗАДАНИЕ 23 =====
        {
          id: 'ege-23',
          number: 23,
          type: 'Алгоритмы',
          difficulty: 'medium',
          text: 'Сколько существует программ, которые число 2 преобразуют в число 10?',
          answerType: 'number',
          correctAnswer: '5',
          hint: 'Используйте динамическое программирование',
          points: 1
        },
        // ===== ЗАДАНИЕ 24 =====
        {
          id: 'ege-24',
          number: 24,
          type: 'Строки',
          difficulty: 'medium',
          text: 'Найдите максимальную длину подстроки, в которой символы a и d не стоят рядом.',
          answerType: 'number',
          correctAnswer: '3',
          hint: 'Напишите программу на Python',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/24.txt',
            description: 'Текстовый файл'
          }
        },
        // ===== ЗАДАНИЕ 25 =====
        {
          id: 'ege-25',
          number: 25,
          type: 'Делители',
          difficulty: 'hard',
          text: 'Найдите 5 наименьших натуральных чисел, для которых 0 < M(N) < 10000.',
          answerType: 'text',
          correctAnswer: '4 8 16 32 64',
          hint: 'Используйте алгоритм поиска делителей',
          points: 1
        },
        // ===== ЗАДАНИЕ 26 =====
        {
          id: 'ege-26',
          number: 26,
          type: 'Обработка данных',
          difficulty: 'hard',
          text: 'Найдите ряд с наибольшим номером, в котором есть два соседних места, таких что слева и справа от них места уже заняты.',
          answerType: 'text',
          correctAnswer: '60 23',
          hint: 'Используйте множества для проверки',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/26.txt',
            description: 'Файл с данными о местах'
          }
        },
        // ===== ЗАДАНИЕ 27 =====
        {
          id: 'ege-27',
          number: 27,
          type: 'Произведения',
          difficulty: 'hard',
          text: 'Определите количество пар, для которых произведение элементов делится на 26.',
          answerType: 'number',
          correctAnswer: '4',
          hint: 'Используйте остатки от деления',
          points: 1,
          media: {
            type: 'file',
            url: '/ege/informatics/variant1/27.txt',
            description: 'Файл с последовательностью'
          }
        }
      ]
    }
  ]
};