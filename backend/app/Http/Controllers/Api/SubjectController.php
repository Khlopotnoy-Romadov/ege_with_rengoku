<?php

namespace App\Http\Controllers\Api;

use App\Models\Subject;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    // GET /api/admin/subjects - список предметов
    public function index()
    {
        return Subject::all();
    }

    // POST /api/admin/subjects - создать предмет
    public function store(Request $request)
    {
        // Валидация
        $validated = $request->validate([
            'slug' => 'required|string|unique:subjects',
            'name' => 'required|string',
            'icon' => 'nullable|string|max:255'
        ]);

        // Создание
        $subject = Subject::create([
            'slug' => $validated['slug'],
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? null
        ]);

        return response()->json($subject, 201);
    }

    // PUT /api/admin/subjects/{id} - обновить предмет
    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'slug' => 'sometimes|string|unique:subjects,slug,' . $id,
            'name' => 'sometimes|string',
            'icon' => 'nullable|string'
        ]);

        $subject->update($validated);
        return response()->json($subject);
    }

    // DELETE /api/admin/subjects/{id} - удалить предмет
    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
        return response()->json(['message' => 'Предмет удалён']);
    }

    // GET /api/v1/subjects - публичный список (уже есть)
    // GET /api/v1/subjects/{slug}/full - публичный (уже есть)
}
