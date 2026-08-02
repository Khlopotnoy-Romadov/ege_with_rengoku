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
        $subjects = [
            [
                'slug' => 'informatics',
                'name' => 'Информатика',
                'icon' => '💻'
            ],
            [
                'slug' => 'math',
                'name' => 'Математика',
                'icon' => '📐'
            ],
            [
                'slug' => 'russian',
                'name' => 'Русский язык',
                'icon' => '📖'
            ],
            [
                'slug' => 'python',
                'name' => 'Python',
                'icon' => '🐍'
            ],
            [
                'slug' => 'frontend',
                'name' => 'Frontend',
                'icon' => '🎨'
            ],
            [
                'slug' => 'php',
                'name' => 'PHP',
                'icon' => '🐘'
            ],
            [
                'slug' => 'chess',
                'name' => 'Шахматы',
                'icon' => '♟️'
            ]
        ];

        foreach ($subjects as $subjectData) {
            Subject::create($subjectData);
        };
    }
}