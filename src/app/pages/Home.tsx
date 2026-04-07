import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Camera, Mic, Loader2 } from "lucide-react";
import { scanMedication, sendChat } from "../services/api";

// ---------------------------------------------------------------------------
// Utilitário de voz (TTS)
// ---------------------------------------------------------------------------
function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.85;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function Home() {
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // -------------------------------------------------------------------------
  // CÂMERA — captura foto e envia para o backend identificar o medicamento
  // -------------------------------------------------------------------------
  const handleCameraClick = () => {
    if (isProcessing) return;
    cameraInputRef.current?.click();
  };

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage("Analisando medicamento...");

    try {
      const result = await scanMedication(file);

      // Navega para o detalhe passando os dados via state (sem nova requisição)
      navigate(`/bulas/${result.id}`, { state: { medication: result } });
    } catch {
      const msg = "Não foi possível identificar o medicamento. Tente tirar a foto com mais luz.";
      setStatusMessage(msg);
      speak(msg);
    } finally {
      setIsProcessing(false);
      // Limpa o input para que a mesma foto possa ser reenviada se necessário
      e.target.value = "";
    }
  };

  // -------------------------------------------------------------------------
  // MICROFONE — captura voz via Web Speech API e envia para a IA responder
  // -------------------------------------------------------------------------
  const handleMicClick = () => {
    if (isProcessing) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      speak("Seu navegador não suporta reconhecimento de voz. Tente pelo Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    let gotResult = false;

    recognition.onstart = () => {
      setIsProcessing(true);
      setStatusMessage("Ouvindo...");
    };

    recognition.onresult = async (event: any) => {
      gotResult = true;
      const transcript: string = event.results[0][0].transcript;
      setStatusMessage(`Você disse: "${transcript}"`);

      try {
        const result = await sendChat(transcript);
        setStatusMessage(result.response);
        speak(result.response);
      } catch {
        const msg = "Não consegui processar sua pergunta. Tente novamente.";
        setStatusMessage(msg);
        speak(msg);
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = () => {
      if (!gotResult) {
        const msg = "Não consegui ouvir. Segure o botão e fale novamente.";
        setStatusMessage(msg);
        speak(msg);
        setIsProcessing(false);
      }
    };

    recognition.onend = () => {
      if (!gotResult) {
        setIsProcessing(false);
        setStatusMessage("");
      }
    };

    recognition.start();
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Input de câmera oculto — abre câmera traseira em dispositivos móveis */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageCapture}
      />

      {/* TOPO (50%) */}
      <div className="h-1/2 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-28 h-28 bg-blue-200/40 rounded-3xl flex items-center justify-center backdrop-blur-sm">
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
            <rect x="30" y="10" width="20" height="60" rx="4" fill="white" />
            <rect x="10" y="30" width="60" height="20" rx="4" fill="white" />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">MedCare</h1>
          <p className="text-sm text-white/90">Seu assistente de medicamentos</p>
        </div>
      </div>

      {/* PARTE DE BAIXO */}
      <div className="h-1/2 flex flex-col items-center justify-center gap-6 px-6 bg-white">
        {isProcessing ? (
          /* Estado de processamento */
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-blue-500 animate-spin" />
            <p className="text-base text-gray-600 text-center font-medium">
              {statusMessage || "Processando..."}
            </p>
          </div>
        ) : (
          <>
            {statusMessage && (
              <p className="text-sm text-gray-600 text-center px-4 leading-relaxed">
                {statusMessage}
              </p>
            )}

            <p className="text-base text-gray-500 text-center">
              Como deseja consultar a bula?
            </p>

            {/* BOTÕES */}
            <div className="flex items-center justify-center gap-10">
              {/* Câmera */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleCameraClick}
                  disabled={isProcessing}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
                  aria-label="Fotografar embalagem do medicamento"
                >
                  <Camera size={36} />
                </button>
                <span className="text-sm text-gray-600">Câmera</span>
              </div>

              {/* Microfone */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleMicClick}
                  disabled={isProcessing}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
                  aria-label="Fazer pergunta por voz"
                >
                  <Mic size={36} />
                </button>
                <span className="text-sm text-gray-600">Voz</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
