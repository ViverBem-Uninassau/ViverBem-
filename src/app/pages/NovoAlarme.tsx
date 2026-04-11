import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, Plus } from "lucide-react";
import { alarmes } from "../services/api";

export function NovoAlarme() {
  const navigate = useNavigate();

  const [hora, setHora] = useState("08:00");
  const [remedio, setRemedio] = useState("");
  const [frequencia, setFrequencia] = useState("8"); // número de horas
  const [dosagem, setDosagem] = useState("");
  const [unidade, setUnidade] = useState("comprimido(s)");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSalvar = async () => {
    if (!remedio.trim()) {
      setErro("Por favor, insira o nome do medicamento");
      return;
    }

    if (!dosagem.trim()) {
      setErro("Por favor, insira a dosagem");
      return;
    }

    if (!frequencia.trim()) {
      setErro("Por favor, insira a frequência");
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      await alarmes.criar({
        medication: remedio.trim(),
        time: hora,
        frequency: `${frequencia}h`, // continua no padrão que você gosta
        dosage_value: dosagem,       // 🔥 agora separado
        dosage_unit: unidade,        // 🔥 agora separado
      });

      navigate("/alarmes");

    } catch (e: any) {
      console.log("ERRO COMPLETO:", e);
      setErro(e.message || "Erro ao criar alarme");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">

        {/* HEADER */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/alarmes")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Novo Alarme
          </h1>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

            {erro && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {erro}
              </div>
            )}

            {/* HORÁRIO */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Horário
              </label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl"
              />
            </div>

            {/* MEDICAMENTO */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Medicamento
              </label>
              <input
                type="text"
                value={remedio}
                onChange={(e) => setRemedio(e.target.value)}
                placeholder="Ex: Dipirona"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl"
              />
            </div>

            {/* DOSAGEM */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dosagem
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="1"
                  value={dosagem}
                  onChange={(e) => setDosagem(e.target.value)}
                  className="w-24 px-4 py-4 text-lg border-2 border-gray-300 rounded-xl"
                />
                <select
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  className="flex-1 px-5 py-4 text-lg border-2 border-gray-300 rounded-xl bg-white"
                >
                  <option>comprimido(s)</option>
                  <option>ml</option>
                  <option>mg</option>
                  <option>gota(s)</option>
                  <option>cápsula(s)</option>
                </select>
              </div>
            </div>

            {/* FREQUÊNCIA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Intervalo de uso (horas)
              </label>
              <input
                type="number"
                min={1}
                value={frequencia}
                onChange={(e) => setFrequencia(e.target.value)}
                className="w-24 px-4 py-4 text-lg border-2 border-gray-300 rounded-xl text-center"
              />
            </div>

            {/* BOTÃO */}
            <div className="mt-8 pb-6">
              <button
                onClick={handleSalvar}
                disabled={salvando}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full py-5 px-8 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <Plus size={24} />
                <span className="text-lg font-bold">
                  {salvando ? "Salvando..." : "Criar Alarme"}
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}