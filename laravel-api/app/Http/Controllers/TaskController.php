<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TaskController extends Controller
{
    /**
     * Lista todas as tarefas.
     */
    public function index()
    {
        // Exemplo de autenticação: supondo que você use JWT e precisa enviar o token
        $token = config('services.wp.jwt_token'); // ou recupere de ENV
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->get(env('WP_API_BASE_URL') . '/tasks');

        // Verifica se a requisição foi bem-sucedida
        if ($response->successful()) {
            $tasks = $response->json();
            return view('tasks.index', compact('tasks'));
        } else {
            return back()->withErrors('Erro ao buscar tarefas.');
        }
    }

    /**
     * Mostra o formulário para criar uma nova tarefa.
     */
    public function create()
    {
        return view('tasks.create');
    }

    /**
     * Armazena uma nova tarefa.
     */
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'status'      => 'required|in:incomplete,in progress,complete',
            'deadline'    => 'required|date_format:Y-m-d'
        ]);

        $token = config('services.wp.jwt_token');
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->post(env('WP_API_BASE_URL') . '/tasks', [
            'title'       => $data['title'],
            'content'     => $data['description'],
            'status'      => $data['status'],
            'deadline'    => $data['deadline'],
        ]);

        if ($response->successful()) {
            return redirect()->route('tasks.index')->with('success', 'Tarefa criada com sucesso.');
        } else {
            return back()->withErrors('Erro ao criar a tarefa.');
        }
    }


    public function edit($id)
    {
        $token = config('services.wp.jwt_token');
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->get(env('WP_API_BASE_URL') . '/tasks/' . $id);

        if ($response->successful()) {
            $task = $response->json();
            return view('tasks.edit', compact('task'));
        } else {
            return back()->withErrors('Erro ao obter os dados da tarefa.');
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'status'      => 'required|in:incomplete,in progress,complete',
            'deadline'    => 'required|date_format:Y-m-d'
        ]);

        $token = config('services.wp.jwt_token');
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->patch(env('WP_API_BASE_URL') . '/tasks/' . $id, [
            'title'       => $data['title'],
            'content'     => $data['description'],
            'status'      => $data['status'],
            'deadline'    => $data['deadline'],
        ]);

        if ($response->successful()) {
            return redirect()->route('tasks.index')->with('success', 'Tarefa atualizada com sucesso.');
        } else {
            return back()->withErrors('Erro ao atualizar a tarefa.');
        }
    }


    public function destroy($id)
    {
        $token = config('services.wp.jwt_token');
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->delete(env('WP_API_BASE_URL') . '/tasks/' . $id);

        if ($response->successful()) {
            return redirect()->route('tasks.index')->with('success', 'Tarefa excluída com sucesso.');
        } else {
            return back()->withErrors('Erro ao excluir a tarefa.');
        }
    }
}
