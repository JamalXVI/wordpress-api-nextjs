"use client";

import React, { useState } from "react";
import WordpressLoginForm from "./components/WordpressLoginForm";
import LaravelLoginForm from "./components/LaravelLoginForm";
import TaskListContainer from "@/app/components/TaskListContainer";

// Definindo as etapas do "wizard"
const steps = [
  { id: 1, label: "Login WordPress" },
  { id: 2, label: "Login Laravel" },
  { id: 3, label: "Tasks" },
];

export default function Home() {
  const [step, setStep] = useState<number>(1);

  // Callbacks para mudança de etapa quando o login é realizado
  const handleWpSuccess = () => setStep(2);
  const handleLaravelSuccess = () => setStep(3);

  // Renderiza o conteúdo da etapa atual
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <WordpressLoginForm onSuccess={handleWpSuccess} />;
      case 2:
        return <LaravelLoginForm onSuccess={handleLaravelSuccess} />;
      case 3:
        return <TaskListContainer />;
      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Só mostra o StepIndicator se não for o passo 3 */}
          {step < 3 && <StepIndicator currentStep={step} steps={steps} />}
          <div className="mt-8">{renderStepContent()}</div>
        </div>
      </div>
  );
}

// Componente para exibir os indicadores de passo
function StepIndicator({
                         currentStep,
                         steps,
                       }: {
  currentStep: number;
  steps: { id: number; label: string }[];
}) {
  return (
      <div className="flex items-center justify-center space-x-6">
        {steps.map((s, index) => (
            <div key={s.id} className="flex flex-col items-center">
              {/* Ícone/círculo do passo */}
              <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                      currentStep >= s.id
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-gray-500 border-gray-300"
                  }`}
              >
                {s.id}
              </div>
              {/* Rótulo do passo */}
              <span className="mt-1 text-sm font-semibold text-gray-600 text-center">
            {s.label}
          </span>
              {/* Linha de conexão entre os passos (exceto para o último) */}
              {index < steps.length - 1 && (
                  <div className="w-10 h-1 bg-gray-300 mt-2"></div>
              )}
            </div>
        ))}
      </div>
  );
}
