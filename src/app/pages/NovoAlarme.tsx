import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, Plus } from "lucide-react";

export function NovoAlarme() {
  const navigate = useNavigate();
  const [hora, setHora] = useState("08:00");
  const [remedio, setRemedio] = useState("");
  const [frequencia, setFrequencia] = useState("Diário");

  const handleSalvar = () => {
    if (!remedio) {
      alert("Por favor, insira o nome do medicamento");
      return;
    }
    console.log("Salvando alarme:", { hora, remedio, frequencia });
    navigate("/alarmes");
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/alarmes")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Novo Alarme</h1>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            {/* Ícone */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock size={40} className="text-orange-600" strokeWidth={2} />
              </div>
            </div>

            {/* Campo Horário */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Horário
              </label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Campo Medicamento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Medicamento
              </label>
              <input
                type="text"
                value={remedio}
                onChange={(e) => setRemedio(e.target.value)}
                placeholder="Ex: Dipirona"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Campo Frequência */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Frequência
              </label>
              <select
                value={frequencia}
                onChange={(e) => setFrequencia(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="Diário">Diário</option>
                <option value="Segunda a Sexta">Segunda a Sexta</option>
                <option value="Fim de Semana">Fim de Semana</option>
                <option value="Segunda, Quarta e Sexta">Segunda, Quarta e Sexta</option>
                <option value="Terça e Quinta">Terça e Quinta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="bg-white border-t border-gray-200 p-6">
          <button
            onClick={handleSalvar}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full py-5 px-8 shadow-lg shadow-orange-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Plus size={24} strokeWidth={2.5} />
            <span className="text-lg font-bold">Criar Alarme</span>
          </button>
        </div>
      </div>
    </div>
  );
}
