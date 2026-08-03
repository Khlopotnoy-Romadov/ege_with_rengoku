<?php

namespace App\Http\Controllers\Api;

use App\Models\Subject;
use App\Models\Question;
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
        try {
            $subject = Subject::with(['topics.questions'])->where('slug', $slug)->firstOrFail();
            
            // Преобразуем данные для фронта
            $result = [
                'id' => $subject->id,
                'name' => $subject->name,
                'topics' => $subject->topics->map(function ($topic) {
                    return [
                        'id' => $topic->id,
                        'name' => $topic->name,
                        'description' => $topic->description,
                        'questions' => $topic->questions->map(function ($question) {
                            // Преобразуем options из JSON в массив
                            $options = $question->options;
                            if (is_string($options)) {
                                $options = json_decode($options, true);
                            }
                            
                            return [
                                'id' => $question->id,
                                'text' => $question->question_text,
                                'options' => $options,
                                'correct' => $question->correct_answer,
                                'hint' => $question->hint,
                                'points' => $question->points,
                            ];
                        })
                    ];
                })
            ];
            
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    // CRUD методы для админки
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'slug' => 'required|string|unique:subjects',
                'name' => 'required|string',
                'icon' => 'nullable|string|max:255'
            ]);

            $subject = Subject::create($validated);
            return response()->json($subject, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            
            $validated = $request->validate([
                'slug' => 'sometimes|string|unique:subjects,slug,' . $id,
                'name' => 'sometimes|string',
                'icon' => 'nullable|string|max:255'
            ]);

            $subject->update($validated);
            return response()->json($subject);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $subject->delete();
            return response()->json(['message' => 'Предмет удалён']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}