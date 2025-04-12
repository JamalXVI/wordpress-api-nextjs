"use client";

import React, { useState } from "react";

// Recebe uma prop para chamar a ação de "Adicionar Nova Tarefa"
interface SidebarMenuProps {
    onAddTaskClick?: () => void;
}

export default function SidebarMenu({ onAddTaskClick }: SidebarMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="relative">
            {/* Botão de Hamburger (bars-3) */}
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Abrir Menu"
            >
                {/* Ícone bars-3 (Heroicons) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Menu popup (dropdown) */}
            {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                        onClick={() => {
                            // Fecha o menu e chama callback do parent
                            setMenuOpen(false);
                            onAddTaskClick?.();
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-md"
                    >
                        Adicionar Nova Tarefa
                    </button>
                    {/* Poderia adicionar mais opções de menu aqui */}
                </div>
            )}
        </div>
    );
}
