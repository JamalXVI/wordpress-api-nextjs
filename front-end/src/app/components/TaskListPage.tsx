"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/app/models/Task";
import SidebarMenu from "@/app/components/SidebarMenu";

export default function TaskListPage() {
    useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        // Verifica se há tokens
        const laravelToken = localStorage.getItem("laravelToken");
        const wpToken = localStorage.getItem("wpToken");
        if (!laravelToken || !wpToken) {
            setError("Token não encontrado. Faça login no WordPress e Laravel!");
            return;
        }

        // Busca tarefas no Laravel
        const fetchTasks = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/api/tasks`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${laravelToken}`,
                            "X-WordPress-Token": wpToken,
                            Accept: "application/json",
                        },
                    }
                );
                if (!res.ok) {
                    throw new Error("Erro ao buscar tasks no Laravel");
                }
                const data: Task[] = await res.json();
                setTasks(data);
            } catch (err: unknown) {
                setError((err as Error)?.message || "Erro desconhecido ao buscar tasks");
            }
        };

        fetchTasks();
    }, []);

    // Callback para abrir o modal a partir do Sidebar
    const handleOpenCreateTask = () => {
        setShowCreateModal(true);
    };

    // Exemplo simplificado de criação de nova task
    const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const laravelToken = localStorage.getItem("laravelToken");
        const wpToken = localStorage.getItem("wpToken");
        if (!laravelToken || !wpToken) {
            setError("Tokens não encontrados. Faça login novamente!");
            return;
        }

        // Exemplo: recupera dados do form
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;

        // Faria também "status", "deadline" etc. conforme seu payload
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/api/tasks`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${laravelToken}`,
                        "X-WordPress-Token": wpToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        description: content,
                        status: "in progress",
                        deadline: "2025-12-31",
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Erro ao criar nova tarefa");
            }

            // Depois de criar, pode refazer fetch ou inserir localmente:
            const newTask = await res.json();
            setTasks((prev) => [newTask, ...prev]);
            setShowCreateModal(false);
        } catch (err: unknown) {
            setError((err as Error)?.message || "Erro desconhecido ao criar task");
        }
    };

    if (error) {
        return <div className="text-red-500 mt-6 text-center">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Barra Superior */}
            <header className="bg-white px-4 py-3 shadow flex items-center justify-between">
                {/* Passamos a callback de abrir modal para o SidebarMenu */}
                <SidebarMenu onAddTaskClick={handleOpenCreateTask} />

                <h1 className="text-xl font-bold">To-Do List</h1>
            </header>

            {/* Conteúdo Principal */}
            <div className="p-4">
                {/* Modal de Criar Nova Tarefa */}
                {showCreateModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        {/* Conteúdo do modal */}
                        <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
                            <h2 className="text-lg font-bold mb-4">Nova Tarefa</h2>
                            <form onSubmit={handleCreateTask}>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Título
                                    </label>
                                    <input
                                        name="title"
                                        className="mt-1 block w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Descrição
                                    </label>
                                    <textarea
                                        name="content"
                                        className="mt-1 block w-full px-3 py-2 border rounded"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Lista de tarefas */}
                <div className="max-w-md mx-auto space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="relative bg-white p-4 rounded-xl shadow-md flex flex-col border border-gray-200"
                        >
                            <h2 className="text-lg font-semibold mb-1">{task.title}</h2>

                            {/* Interpreta HTML vindo do WordPress */}
                            <div
                                className="text-gray-600"
                                dangerouslySetInnerHTML={{ __html: task.content ?? "" }}
                            />

                            <p className="mt-1 text-sm text-gray-400">
                                Deadline: {task.deadline}
                            </p>

                            {/* Badge no canto inferior direito */}
                            <span
                                className={`absolute bottom-2 right-2 text-sm px-2 py-1 rounded-full ${
                                    task.status === "complete"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                {task.status}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
