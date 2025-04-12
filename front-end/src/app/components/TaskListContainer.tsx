"use client";

import React from "react";
import useTasks from "@/app/hooks/useTasks";
import TaskListView from "@/app/components/TaskListView";
import SidebarMenu from "@/app/components/SidebarMenu";

export default function TaskListContainer() {
    // Extraímos as tasks, loading e error diretamente do hook useTasks
    const { tasks, loading, error } = useTasks();
    const [showCreateModal, setShowCreateModal] = React.useState(false);

    const handleOpenCreateTask = () => {
        setShowCreateModal(true);
    };

    const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Aqui você pode implementar a lógica de criação de nova tarefa.
        // Se necessário, depois de criar a nova tarefa, chame uma função do hook ou recarregue as tasks.
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="bg-white px-4 py-3 shadow flex items-center justify-between">
                {/* O SidebarMenu recebe a callback de abrir o modal para criar uma nova tarefa */}
                <SidebarMenu onAddTaskClick={handleOpenCreateTask} />
                <h1 className="text-xl font-bold">To-Do List</h1>
            </header>
            {/* Conteúdo abaixo do header */}
            <div className="mt-4">
                {loading ? (
                    // Spinner de carregamento centralizado abaixo do header
                    <div className="flex items-center justify-center py-8">
                        <svg
                            className="animate-spin h-10 w-10 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <TaskListView tasks={tasks} />
                )}
            </div>

            {/* Modal de Criar Nova Tarefa */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
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

            {/* Exibindo a lista de tasks */}
            <TaskListView tasks={tasks} />
        </div>
    );
}
