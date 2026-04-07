import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Play, Pause, ArrowLeft, Volume2 } from "lucide-react";

type Medication = {
  id: string;
  name: string;
  active_ingredient: string;
  dosage: string;
  indications: string[];
  contraindications: string[];
  disclaimer: string;
};

// ---------------------------------------------------------------------------
// Formata os dados do medicamento em texto corrido para o TTS ler
// ---------------------------------------------------------------------------
function buildSpeechText(med: Medication): string {
  const indications = med.indications.length
    ? `Indicações: ${med.indications.join(", ")}.`
    : "";
  const contraindications = med.contraindications.length
    ? `Contraindicações: ${med.contraindications.join(", ")}.`
    : "";

  return [
    `Medicamento: ${med.name}.`,
    med.active_ingredient ? `Princípio ativo: ${med.active_ingredient}.` : "",
    med.dosage ? `Dosagem: ${med.dosage}.` : "",
    indications,
    contraindications,
    med.disclaimer,
  ]
    .filter(Boolean)
    .join(" ");
}

export function DetalheBula() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reproduzindo, setReproduzindo] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Dados do medicamento passados via router state pela HistoricoBulas ou Home
  const medication: Medication | undefined = location.state?.medication;

  // Cancela TTS ao sair da tela
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Redireciona se chegou sem dados (ex: refresh direto na URL)
  if (!medication) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-4 bg-blue-50 px-6">
        <p className="text-gray-600 text-center text-base">
          Informações do medicamento não encontradas.
        </p>
        <button
          onClick={() => navigate("/bulas")}
          className="text-blue-600 font-semibold underline"
        >
          Voltar ao histórico
        </button>
      </div>
    );
  }

  const handleReproducir = () => {
    if (reproduzindo) {
      window.speechSynthesis.cancel();
      setReproduzindo(false);
      utteranceRef.current = null;
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }

    const text = buildSpeechText(medication);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setReproduzindo(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setReproduzindo(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setReproduzindo(true);
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/bulas")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 truncate">
            {medication.name}
          </h1>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
            {reproduzindo && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Volume2 size={22} className="text-blue-600 animate-pulse" />
                <span className="text-sm font-semibold text-blue-700">
                  Reproduzindo...
                </span>
              </div>
            )}

            {/* Nome e dosagem */}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{medication.name}</h2>
              {medication.dosage && (
                <p className="text-sm text-gray-500 mt-1">{medication.dosage}</p>
              )}
            </div>

            {/* Princípio ativo */}
            {medication.active_ingredient && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Princípio ativo
                </h3>
                <p className="text-base text-gray-700">{medication.active_ingredient}</p>
              </div>
            )}

            {/* Indicações */}
            {medication.indications.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Indicações
                </h3>
                <ul className="space-y-1">
                  {medication.indications.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-gray-700">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contraindicações */}
            {medication.contraindications.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Contraindicações
                </h3>
                <ul className="space-y-1">
                  {medication.contraindications.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-gray-700">
                      <span className="text-red-400 mt-0.5">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            {medication.disclaimer && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  ⚠️ {medication.disclaimer}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botão Reproduzir */}
        <div className="bg-white border-t border-gray-200 p-6">
          <button
            onClick={handleReproducir}
            className={`w-full rounded-full py-5 px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-white ${
              reproduzindo
                ? "bg-gradient-to-r from-red-500 to-red-600 shadow-red-300"
                : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-300"
            }`}
          >
            {reproduzindo ? (
              <>
                <Pause size={24} strokeWidth={2.5} fill="white" />
                <span className="text-lg font-bold">Parar Reprodução</span>
              </>
            ) : (
              <>
                <Play size={24} strokeWidth={2.5} fill="white" />
                <span className="text-lg font-bold">Ouvir Bula</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
