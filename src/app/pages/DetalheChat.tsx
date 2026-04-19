import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Play, Pause, ArrowLeft, Volume2, Mic } from "lucide-react";

interface ChatState {
  transcript: string;
  response: string;
}

export function DetalheChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reproduzindo, setReproduzindo] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoPlayedRef = useRef(false);

  const state = location.state as ChatState | undefined;

  // Cleanup: para a fala ao sair da tela
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Autoplay da resposta quando a tela abre
  useEffect(() => {
    if (state?.response && !autoPlayedRef.current) {
      autoPlayedRef.current = true;
      startSpeaking(state.response);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.response]);

  // Fallback: dados não encontrados
  if (!state) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-4 bg-blue-50 px-6">
        <p className="text-gray-600 text-center text-base">
          Informações da conversa não encontradas.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 font-semibold underline"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // TTS helpers
  // -------------------------------------------------------------------------
  function startSpeaking(text: string) {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
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
  }

  const handleTogglePlay = () => {
    if (reproduzindo) {
      window.speechSynthesis.cancel();
      setReproduzindo(false);
      utteranceRef.current = null;
    } else {
      startSpeaking(state.response);
    }
  };

  // -------------------------------------------------------------------------
  // UI — mesmo layout de DetalheBula.tsx para padronização
  // -------------------------------------------------------------------------
  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">

        {/* ===== HEADER ===== */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 flex items-center gap-3">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              navigate("/");
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 truncate">
            Resposta da Assistente
          </h1>
        </div>

        {/* ===== CONTEÚDO COM SCROLL ===== */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">

            {/* Indicador de reprodução */}
            {reproduzindo && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Volume2 size={22} className="text-blue-600 animate-pulse" />
                <span className="text-sm font-semibold text-blue-700">
                  Reproduzindo…
                </span>
              </div>
            )}

            {/* Pergunta do Usuário */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mic size={18} className="text-green-500" />
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Você perguntou
                </h3>
              </div>
              <p className="text-base text-gray-700 italic border-l-4 border-green-200 pl-3">
                "{state.transcript}"
              </p>
            </div>

            {/* Resposta da IA */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Resposta
              </h3>
              <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                {state.response}
              </div>
            </div>

          </div>
        </div>

        {/* ===== BOTÃO REPRODUZIR / PARAR ===== */}
        <div className="bg-white border-t border-gray-200 p-6">
          <button
            onClick={handleTogglePlay}
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
                <span className="text-lg font-bold">Ouvir Resposta</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
