<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->string('media_type')->nullable()->after('question_type'); // 'image', 'file', 'both'
            $table->string('media_url')->nullable()->after('media_type'); // путь к файлу/картинке
            $table->text('media_description')->nullable()->after('media_url'); // описание для картинки
            $table->string('answer_type')->default('choice')->after('media_description'); // 'choice', 'input', 'number', 'file'
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['media_type', 'media_url', 'media_description', 'answer_type']);
        });
    }
};