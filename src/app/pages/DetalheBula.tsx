import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Play, Pause, ArrowLeft, Volume2 } from "lucide-react";
import { type Medicamento } from "../services/api";

export function DetalheBula() {
  const navigate = useNavigate();
  const location = useLocation();
  const med = location.state as Medicamento | null;

  const [reproduzindo, setReproduzindo] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!med) {
    return (
      <div className="size-full flex items-center justify-center">
        <p className="text-gray-500">Medicamento não encontrado.</p>
      </div>
    );
  }

  const texto = `
    Medicamento: ${med.name}.
    Princípio ativo: ${med.active_ingredient}.
    Dosagem: ${med.dosage}.
    Consulte sempre um médico ou farmacêutico antes de usar qualquer medicamento.
  `.trim();

  const handleReproducir = () => {
    if (reproduzindo) {
      window.speechSynthesis.cancel();
      setReproduzindo(false);
      speechSynthesisRef.current = null;
    } else {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = "pt-BR";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          setReproduzindo(false);
          speechSynthesisRef.current = null;
        };

        utterance.onerror = () => {
          setReproduzindo(false);
          speechSynthesisRef.current = null;
        };

        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setReproduzindo(true);
      } else {
        alert("Seu navegador não suporta síntese de voz.");
      }
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/bulas")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Informação do Medicamento</h1>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
            {reproduzindo && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Volume2 size={24} className="text-blue-600 animate-pulse" />
                <span className="text-sm font-semibold text-blue-700">Reproduzindo texto...</span>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Nome</p>
              <p className="text-2xl font-bold text-gray-800">{med.name}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Princípio Ativo</p>
              <p className="text-lg text-gray-700">{med.active_ingredient}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Dosagem</p>
              <p className="text-lg text-gray-700">{med.dosage}</p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                Consulte sempre um médico ou farmacêutico antes de usar qualquer medicamento.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <button
            onClick={handleReproducir}
            className={`w-full rounded-full py-5 px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
              reproduzindo
                ? "bg-gradient-to-r from-red-500 to-red-600 shadow-red-300"
                : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-300"
            } text-white`}
          >
            {reproduzindo ? (
              <>
                <Pause size={24} strokeWidth={2.5} fill="white" />
                <span className="text-lg font-bold">Parar Reprodução</span>
              </>
            ) : (
              <>
                <Play size={24} strokeWidth={2.5} fill="white" />
                <span className="text-lg font-bold">Reproduzir Texto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
