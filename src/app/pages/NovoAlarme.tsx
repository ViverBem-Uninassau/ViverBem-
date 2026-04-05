import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, Plus } from "lucide-react";
import { alarmes } from "../services/api";

export function NovoAlarme() {
  const navigate = useNavigate();
  const [hora, setHora] = useState("08:00");
  const [remedio, setRemedio] = useState("");
  const [frequencia, setFrequencia] = useState("daily");
  const [dosagem, setDosagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSalvar = async () => {
    if (!remedio.trim()) {
      setErro("Por favor, insira o nome do medicamento");
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      await alarmes.criar({
        medication: remedio.trim(),
        time: hora,
        frequency: frequencia,
        dosage: dosagem.trim() || undefined,
      });
      navigate("/alarmes");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao criar alarme");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">
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

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock size={40} className="text-orange-600" strokeWidth={2} />
              </div>
            </div>

            {erro && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {erro}
              </div>
            )}

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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dosagem (opcional)
              </label>
              <input
                type="text"
                value={dosagem}
                onChange={(e) => setDosagem(e.target.value)}
                placeholder="Ex: 500mg"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Frequência
              </label>
              <select
                value={frequencia}
                onChange={(e) => setFrequencia(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="daily">Diário</option>
                <option value="weekdays">Segunda a Sexta</option>
                <option value="weekend">Fim de Semana</option>
                <option value="mon-wed-fri">Segunda, Quarta e Sexta</option>
                <option value="tue-thu">Terça e Quinta</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full py-5 px-8 shadow-lg shadow-orange-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:scale-100"
          >
            <Plus size={24} strokeWidth={2.5} />
            <span className="text-lg font-bold">
              {salvando ? "Salvando..." : "Criar Alarme"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
