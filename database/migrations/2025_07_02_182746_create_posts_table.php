<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('posts')) {
            Schema::create('posts', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('content');
                $table->text('excerpt')->nullable();
                $table->string('status')->default('published'); // draft, published, archived
                $table->string('type')->default('post'); // post, page, announcement
                $table->string('author_name');
                $table->string('author_email');
                $table->string('featured_image')->nullable();
                $table->json('meta_data')->nullable();
                $table->integer('views_count')->default(0);
                $table->integer('likes_count')->default(0);
                $table->integer('comments_count')->default(0);
                $table->boolean('allow_comments')->default(true);
                $table->timestamp('published_at')->nullable();
                $table->timestamps();

                $table->index(['status', 'type']);
                $table->index(['published_at', 'status']);
                $table->index('slug');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
