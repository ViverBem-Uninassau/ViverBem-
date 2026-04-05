import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Clock, ChevronRight, Plus } from "lucide-react";
import { alarmes, type Alarme } from "../services/api";

const FREQ_MAP: Record<string, string> = {
  daily: "Diário",
  weekdays: "Segunda a Sexta",
  weekend: "Fim de Semana",
  "mon-wed-fri": "Segunda, Quarta e Sexta",
  "tue-thu": "Terça e Quinta",
};

export function HistoricoAlarmes() {
  const navigate = useNavigate();
  const [lista, setLista] = useState<Alarme[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    alarmes.listar()
      .then(setLista)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 relative">
      <div className="max-w-md mx-auto h-full flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 py-6 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Seus Alarmes</h1>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {carregando && (
            <p className="text-center text-gray-400 mt-10">Carregando alarmes...</p>
          )}

          {erro && (
            <p className="text-center text-red-500 mt-10">{erro}</p>
          )}

          {!carregando && !erro && lista.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              Nenhum alarme cadastrado. Clique em + para criar.
            </p>
          )}

          {lista.map((alarme) => (
            <button
              key={alarme.id}
              onClick={() => navigate(`/alarmes/${alarme.id}`)}
              className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alarme.active ? "bg-orange-100" : "bg-gray-200"
                }`}>
                  <Clock size={24} className={alarme.active ? "text-orange-600" : "text-gray-400"} strokeWidth={2} />
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className={`text-2xl font-bold ${alarme.active ? "text-gray-800" : "text-gray-400"}`}>
                      {alarme.time}
                    </span>
                    <span className={`text-sm ${alarme.active ? "text-gray-500" : "text-gray-400"}`}>
                      {FREQ_MAP[alarme.frequency] ?? alarme.frequency}
                    </span>
                  </div>
                  <span className={`text-base font-medium ${alarme.active ? "text-gray-700" : "text-gray-400"}`}>
                    {alarme.medication}
                  </span>
                  <div className="mt-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      alarme.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {alarme.active ? "Ativado" : "Desativado"}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight
                size={24}
                className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                strokeWidth={2.5}
              />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/alarmes/novo")}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-2xl shadow-orange-400 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center z-50"
        aria-label="Criar novo alarme"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>
    </div>
  );
}
