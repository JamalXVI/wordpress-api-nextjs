"use client";

import React from "react";
import { Task } from "@/app/models/Task";

interface TaskListViewProps {
    tasks: Task[];
}

export default function TaskListView({ tasks }: TaskListViewProps) {
    return (
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
    );
}
