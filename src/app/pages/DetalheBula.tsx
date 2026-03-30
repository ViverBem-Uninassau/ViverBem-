import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Play, Pause, ArrowLeft, Volume2 } from "lucide-react";

const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

export function DetalheBula() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reproduzindo, setReproduzindo] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Cleanup ao desmontar
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleReproducir = () => {
    if (reproduzindo) {
      // Pausar/Parar
      window.speechSynthesis.cancel();
      setReproduzindo(false);
      speechSynthesisRef.current = null;
    } else {
      // Iniciar reprodução
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(loremText);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9; // Velocidade um pouco mais lenta para idosos
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          setReproduzindo(false);
          speechSynthesisRef.current = null;
        };

        utterance.onerror = () => {
          setReproduzindo(false);
          speechSynthesisRef.current = null;
          console.error("Erro ao reproduzir texto");
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
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/bulas")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Informação do Medicamento
          </h1>
        </div>

        {/* Conteúdo da Bula */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            {reproduzindo && (
              <div className="mb-4 flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Volume2 size={24} className="text-blue-600 animate-pulse" />
                <span className="text-sm font-semibold text-blue-700">
                  Reproduzindo texto...
                </span>
              </div>
            )}
            <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
              {loremText}
            </p>
          </div>
        </div>

        {/* Botão Reproduzir */}
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
