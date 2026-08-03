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
            // Базовая валидация
            $rules = [
                'topic_id' => 'required|exists:topics,id',
                'question_text' => 'required|string',
                'question_type' => 'required|in:choice,input',
                'correct_answer' => 'required|string',
                'hint' => 'nullable|string',
                'points' => 'integer|min:1'
            ];

            // Для типа "choice" проверяем options
            if ($request->question_type === 'choice') {
                $rules['options'] = 'required|array|min:2';
            } else {
                // Для типа "input" options не обязательны
                $rules['options'] = 'nullable|array';
            }

            $validated = $request->validate($rules);

            // Если тип "input" — очищаем options
            if ($validated['question_type'] === 'input') {
                $validated['options'] = json_encode([]);
            } else {
                $validated['options'] = json_encode($validated['options']);
            }

            if (!isset($validated['points'])) {
                $validated['points'] = 1;
            }

            $question = Question::create($validated);
            
            $question->options = json_decode($question->options, true);
            
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
            
            $rules = [
                'topic_id' => 'sometimes|exists:topics,id',
                'question_text' => 'sometimes|string',
                'question_type' => 'sometimes|in:choice,input',
                'correct_answer' => 'sometimes|string',
                'hint' => 'nullable|string',
                'points' => 'integer|min:1'
            ];

            if ($request->question_type === 'choice') {
                $rules['options'] = 'sometimes|array|min:2';
            } else {
                $rules['options'] = 'nullable|array';
            }

            $validated = $request->validate($rules);

            if (isset($validated['options'])) {
                if ($validated['question_type'] === 'input' || empty($validated['options'])) {
                    $validated['options'] = json_encode([]);
                } else {
                    $validated['options'] = json_encode($validated['options']);
                }
            }

            $question->update($validated);
            
            $question->options = json_decode($question->options, true);
            
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