<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
              // Brisanje postojećeg FK ka user_id
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');

            // Dodavanje nove kolone i FK ka todo_lists
            $table->unsignedBigInteger('todo_list_id')->after('id');
            $table->foreign('todo_list_id')
                  ->references('id')
                  ->on('todo_lists')
                  ->onDelete('cascade'); // brisanje taskova kada se obriše lista
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Brisanje FK ka todo_lists
            $table->dropForeign(['todo_list_id']);
            $table->dropColumn('todo_list_id');

            // Vraćanje kolone i FK ka users
            $table->unsignedBigInteger('user_id')->after('id');
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }
};
