<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\Question;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        // Создаём предмет
        $informatics = Subject::create([
            'slug' => 'informatics',
            'name' => 'Информатика',
            'icon' => '💻'
        ]);

        // Создаём темы
        $coding = Topic::create([
            'subject_id' => $informatics->id,
            'name' => 'Кодирование информации',
            'description' => 'Как компьютеры понимают текст и числа?'
        ]);

        $logic = Topic::create([
            'subject_id' => $informatics->id,
            'name' => 'Логика и алгоритмы',
            'description' => 'Основы логических выражений'
        ]);

        // Вопросы для темы "Кодирование информации"
        Question::create([
            'topic_id' => $coding->id,
            'question_text' => 'Сколько бит в одном байте?',
            'options' => ['4', '8', '16', '32'],
            'correct_answer' => 'B',
            'hint' => 'Вспомни базовые единицы измерения информации',
            'points' => 1
        ]);

        Question::create([
            'topic_id' => $coding->id,
            'question_text' => 'Какая кодировка используется для представления кириллицы?',
            'options' => ['ASCII', 'CP1251', 'UTF-8', 'KOI-8'],
            'correct_answer' => 'C',
            'hint' => 'Самая популярная сейчас кодировка',
            'points' => 1
        ]);

        Question::create([
            'topic_id' => $coding->id,
            'question_text' => 'Сколько символов можно закодировать 1 байтом?',
            'options' => ['128', '256', '512', '1024'],
            'correct_answer' => 'B',
            'hint' => '2^8 = ?',
            'points' => 1
        ]);

        // Вопросы для темы "Логика и алгоритмы"
        Question::create([
            'topic_id' => $logic->id,
            'question_text' => 'Что будет результатом логического выражения: TRUE AND FALSE?',
            'options' => ['TRUE', 'FALSE', 'NULL', 'Ошибка'],
            'correct_answer' => 'B',
            'hint' => 'Конъюнкция (И)',
            'points' => 1
        ]);

        Question::create([
            'topic_id' => $logic->id,
            'question_text' => 'Что будет результатом логического выражения: TRUE OR FALSE?',
            'options' => ['TRUE', 'FALSE', 'NULL', 'Ошибка'],
            'correct_answer' => 'A',
            'hint' => 'Дизъюнкция (ИЛИ)',
            'points' => 1
        ]);
    }
}