<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TaskController extends Controller
{

    public function index(Request $request)
    {
        // Pega o token do WordPress do header 'X-WordPress-Token'
        $wpToken = $request->header('X-WordPress-Token');
        $wpUrl = rtrim(env('WP_API_BASE_URL'), '/') . '/task/v1/tasks';

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$wpToken}"
        ])->get($wpUrl);

        if ($response->successful()) {
            $tasks = $response->json();
            return response()->json($tasks, 200);
        } else {
            return response()->json(['message' => 'Erro ao buscar tarefas na API do WordPress'], $response->status());
        }
    }

    /**
     * Cria uma nova tarefa repassando a chamada para o WordPress.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'status'      => 'required|in:incomplete,in progress,complete',
            'deadline'    => 'required|date_format:Y-m-d'
        ]);

        // Pega o token do WordPress do header 'X-WordPress-Token'
        $wpToken = $request->header('X-WordPress-Token');
        $wpUrl = rtrim(env('WP_API_BASE_URL'), '/') . '/task/v1/tasks';

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$wpToken}"
        ])->post($wpUrl, [
            'title'   => $data['title'],
            'content' => $data['description'],
            'status'  => $data['status'],
            'deadline'=> $data['deadline']
        ]);

        if ($response->successful()) {
            return response()->json(['message' => 'Tarefa criada com sucesso'], 201);
        } else {
            return response()->json(['message' => 'Erro ao criar a tarefa'], $response->status());
        }
    }
}
