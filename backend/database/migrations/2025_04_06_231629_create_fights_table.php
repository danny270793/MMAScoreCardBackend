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
        Schema::create('fights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->integer('position');
            $table->foreignId('fighter1_id')->constrained('fighters')->onDelete('cascade');
            $table->string('fighter1_result')->nullable();
            $table->foreignId('fighter2_id')->constrained('fighters')->onDelete('cascade');
            $table->string('fighter2_result')->nullable();
            $table->foreignId('division_id')->nullable()->constrained('divisions')->onDelete('cascade');
            $table->string('method')->nullable();
            $table->string('method_detail')->nullable();
            $table->foreignId('referee_id')->nullable()->constrained('referees')->onDelete('cascade');
            $table->integer('round')->nullable();
            $table->string('time')->nullable();
            $table->enum('state', ['upcoming', 'finished']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fights');
    }
};
