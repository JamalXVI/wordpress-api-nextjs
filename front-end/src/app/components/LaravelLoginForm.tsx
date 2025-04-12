"use client";

import React, { useState } from "react";
import laravelAuth from "../hooks/laravelAuth";
import {LoginFormProps} from "@/app/models/LoginFormProps";



export default function LaravelLoginForm({ onSuccess }: LoginFormProps) {
    const { login, loading, error } = laravelAuth();
    const [email, setEmail] = useState("root@example.com"); // valores iniciais
    const [password, setPassword] = useState("root");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Faz o login (salva o token do Laravel no localStorage)
        await login({ email, password });

        // Se existir "laravelToken" no localStorage, chamamos onSuccess
        const token = localStorage.getItem("laravelToken");
        if (token) {
            onSuccess?.();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Login no Laravel
                </h1>
                {error && (
                    <div className="mb-4 text-center text-red-500">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            E-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            placeholder="Seu e-mail"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            placeholder="Digite sua senha"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center py-2 px-4 
              border border-transparent text-sm font-medium rounded-md text-white 
              focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-600"
                        }`}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
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
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
