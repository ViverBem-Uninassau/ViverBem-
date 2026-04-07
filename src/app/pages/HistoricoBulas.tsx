import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FileText, ChevronRight, Loader2, Camera } from "lucide-react";
import { getMedicationHistory, type Medicamento } from "../services/api";

export function HistoricoBulas() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMedicationHistory()
      .then(setMedications)
      .catch(() => setError("Não foi possível carregar o histórico."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-md mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-6 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Histórico de Bulas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerenciado pela IA · máx. 15 medicamentos
          </p>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {loading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 size={36} className="text-blue-500 animate-spin" />
            </div>
          )}

          {!loading && error && (
            <div className="flex justify-center items-center h-40">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          )}

          {!loading && !error && medications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Camera size={32} className="text-blue-400" />
              </div>
              <p className="text-gray-500 text-base leading-relaxed px-4">
                Nenhum medicamento consultado ainda.{"\n"}
                Use a câmera ou o microfone na tela inicial.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            medications.map((med) => (
              <button
                key={med.id}
                onClick={() =>
                  navigate(`/bulas/${med.id}`, { state: { medication: med } })
                }
                className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={24} className="text-blue-600" strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-gray-800 block">
                      {med.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {med.source === "scan" ? "📷 Foto" : "🎤 Voz"} · {med.dosage || "—"}
                    </span>
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
    </div>
  );
}
