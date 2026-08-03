<?php

namespace App\Http\Controllers\Api;

use App\Models\Question;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::with('topic')->get();
        
        // Преобразуем options из JSON в массив
        $questions = $questions->map(function ($question) {
            if (is_string($question->options)) {
                $question->options = json_decode($question->options, true);
            }
            return $question;
        });
        
        return $questions;
    }

    public function store(Request $request)
    {
        try {
            // Правильная валидация БЕЗ default
            $validated = $request->validate([
                'topic_id' => 'required|exists:topics,id',
                'question_text' => 'required|string',
                'options' => 'required|array|min:2',
                'correct_answer' => 'required|string|max:1',
                'hint' => 'nullable|string',
                'points' => 'integer|min:1'
            ]);

            // Преобразуем options в JSON
            $validated['options'] = json_encode($validated['options']);
            
            // Если points не передан, ставим 1
            if (!isset($validated['points'])) {
                $validated['points'] = 1;
            }

            $question = Question::create($validated);
            return response()->json($question, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
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
            $question = Question::findOrFail($id);
            
            $validated = $request->validate([
                'topic_id' => 'sometimes|exists:topics,id',
                'question_text' => 'sometimes|string',
                'options' => 'sometimes|array|min:2',
                'correct_answer' => 'sometimes|string|max:1',
                'hint' => 'nullable|string',
                'points' => 'integer|min:1'
            ]);

            if (isset($validated['options'])) {
                $validated['options'] = json_encode($validated['options']);
            }

            $question->update($validated);
            return response()->json($question);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);
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
            $question = Question::findOrFail($id);
            $question->delete();
            return response()->json(['message' => 'Вопрос удалён']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}