<?php

namespace App\Http\Controllers\Api;

use App\Models\Subject;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return Subject::all(['id', 'slug', 'name', 'icon']);
    }

    public function showFull($slug)
    {
        $subject = Subject::with(['topics.questions'])->where('slug', $slug)->firstOrFail();
        
        return response()->json([
            'id' => $subject->id,
            'name' => $subject->name,
            'topics' => $subject->topics->map(function ($topic) {
                return [
                    'id' => $topic->id,
                    'name' => $topic->name,
                    'description' => $topic->description,
                    'questions' => $topic->questions->map(function ($question) {
                        return [
                            'id' => $question->id,
                            'text' => $question->question_text,
                            'options' => $question->options,
                            'correct' => $question->correct_answer,
                            'hint' => $question->hint,
                            'points' => $question->points,
                        ];
                    })
                ];
            })
        ]);
    }
}