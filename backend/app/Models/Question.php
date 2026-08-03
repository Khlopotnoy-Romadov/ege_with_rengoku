<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'topic_id',
        'question_text',
        'question_type',
        'options',
        'correct_answer',
        'hint',
        'points'
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}