"use client";

import { useState, useEffect } from "react";
import { Task } from "@/app/models/Task";

export default function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError("");

            const laravelToken = localStorage.getItem("laravelToken");
            const wpToken = localStorage.getItem("wpToken");

            if (!laravelToken || !wpToken) {
                setError("Tokens não encontrados. Faça login no WordPress e no Laravel!");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/api/tasks`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${laravelToken}`,
                            "X-WordPress-Token": wpToken,
                        },
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Erro ao buscar as tasks.");
                }

                const data: Task[] = await res.json();
                setTasks(data);
            } catch (err: any) {
                setError(err.message || "Erro desconhecido ao buscar tasks");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    return { tasks, loading, error };
}
