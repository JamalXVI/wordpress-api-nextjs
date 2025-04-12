"use client";

import React, { useState } from "react";
import wordpressAuth from "../hooks/wordpressAuth";
import {LoginFormProps} from "@/app/models/LoginFormProps";

export default function WordpressLoginForm({ onSuccess }: LoginFormProps) {
    // Preenche os valores iniciais com "admin"
    const { login, loading, error } = wordpressAuth();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login({ email: username, password });

        // Se existir "wpToken" no localStorage, chamamos onSuccess
        const token = localStorage.getItem("wpToken");
        if (token) {
            onSuccess?.();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">Login do WordPress</h1>
                {error && (
                    <div className="mb-4 text-center text-red-500">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Usuário
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            placeholder="Digite seu usuário"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            placeholder="Digite sua senha"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            loading
                                ? "bg-green-500 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-700 focus:bg-green-500"
                        }`}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
