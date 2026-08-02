<?php

namespace App\Http\Controllers\Api;

use App\Models\Question;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        return Question::with('topic')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_answer' => 'required|string|max:1',
            'hint' => 'nullable|string',
            'points' => 'integer|default:1'
        ]);

        $question = Question::create($validated);
        return response()->json($question, 201);
    }

    public function update(Request $request, $id)
    {
        $question = Question::findOrFail($id);
        
        $validated = $request->validate([
            'topic_id' => 'sometimes|exists:topics,id',
            'question_text' => 'sometimes|string',
            'options' => 'sometimes|array|min:2',
            'correct_answer' => 'sometimes|string|max:1',
            'hint' => 'nullable|string',
            'points' => 'integer'
        ]);

        $question->update($validated);
        return response()->json($question);
    }

    public function destroy($id)
    {
        $question = Question::findOrFail($id);
        $question->delete();
        return response()->json(['message' => 'Вопрос удалён']);
    }
}