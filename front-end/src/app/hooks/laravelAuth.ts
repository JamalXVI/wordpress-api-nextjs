"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // use next/navigation para app directory
import { LoginCredentials } from "@/app/models/LoginCredentials";
import {LaravelUser} from "@/app/models/LaravelAuthResponse";

export default function laravelAuth() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState<string>("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRouter();
    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL}/api/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials.email, // Note que usamos "username" para autenticar
                        password: credentials.password,
                    }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro na autenticação");
            }

            const data: LaravelUser = await res.json();
            localStorage.setItem("laravelToken", data.token);
        } catch (err: unknown) {
            // @ts-expect-error: err is typed as unknown and may not have a "message" property
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}
