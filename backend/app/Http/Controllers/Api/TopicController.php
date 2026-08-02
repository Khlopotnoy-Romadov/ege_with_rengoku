<?php

namespace App\Http\Controllers\Api;

use App\Models\Topic;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        return Topic::with('subject')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'order' => 'integer|default:0'
        ]);

        $topic = Topic::create($validated);
        return response()->json($topic, 201);
    }

    public function update(Request $request, $id)
    {
        $topic = Topic::findOrFail($id);
        
        $validated = $request->validate([
            'subject_id' => 'sometimes|exists:subjects,id',
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'order' => 'integer'
        ]);

        $topic->update($validated);
        return response()->json($topic);
    }

    public function destroy($id)
    {
        $topic = Topic::findOrFail($id);
        $topic->delete();
        return response()->json(['message' => 'Тема удалена']);
    }
}