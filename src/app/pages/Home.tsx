import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Camera, Mic, Loader2 } from "lucide-react";
import { scanMedication, sendChat } from "../services/api";
import logo from "../../assets/logo_viver_bem.png";

// ---------------------------------------------------------------------------
// TTS
// ---------------------------------------------------------------------------
function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function Home() {
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // -------------------------------------------------------------------------
  // CÂMERA
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
      navigate(`/bulas/${result.id}`, { state: { medication: result } });
    } catch {
      const msg =
        "Não foi possível identificar o medicamento. Tente novamente com mais luz.";
      setStatusMessage(msg);
      speak(msg);
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  // -------------------------------------------------------------------------
  // MICROFONE
  // -------------------------------------------------------------------------
  const handleMicClick = () => {
    if (isProcessing) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      speak("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";

    let gotResult = false;

    recognition.onstart = () => {
      setIsProcessing(true);
      setStatusMessage("Ouvindo...");
    };

    recognition.onresult = async (event: any) => {
      gotResult = true;
      const transcript = event.results[0][0].transcript;
      setStatusMessage(`Você disse: "${transcript}"`);

      try {
        const result = await sendChat(transcript);
        // Navega para tela dedicada (mesmo padrão da foto/bula)
        navigate("/chat/resultado", {
          state: {
            transcript,
            response: result.response,
          },
        });
      } catch {
        const msg = "Não consegui entender. Tente novamente.";
        setStatusMessage(msg);
        speak(msg);
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = () => {
      if (!gotResult) {
        const msg = "Não consegui ouvir. Tente novamente.";
        setStatusMessage(msg);
        speak(msg);
        setIsProcessing(false);
      }
    };

    recognition.start();
  };

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* INPUT CAMERA */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageCapture}
      />

      {/* ================= TOPO ================= */}
      <div className="h-[50%] relative bg-gradient-to-br from-blue-600 via-blue-300 to-blue-200 flex flex-col items-center justify-center gap-4 px-6">

        {/* luz suave */}
        <div className="absolute w-70 h-70 bg-white/20 rounded-full blur-3xl top-[-60px] right-[-60px]" />

        {/* halo leve (sem cor azul agora) */}
        <div className="absolute w-60 h-60 bg-white/20 rounded-full blur-2xl" />

        {/* LOGO */}
        <div className="w-44 h-44 flex items-center justify-center z-10">
          <img
            src={logo}
            alt="Logo ViverBem"

            className="max-w-full max-h-full object-contain 
            drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]
            contrast-110 brightness-95"
          />
        </div>

        {/* TEXTO */}
        <div className="text-center flex flex-col items-center gap-1">

          {/* NOME DA MARCA */}
          <h1 className="text-3xl font-bold text-white">
            ViverBem
          </h1>

          {/* SLOGAN */}
          <p className="text-lg text-white/80">
            Seu assistente de medicamentos
          </p>

        </div>
      </div>

      {/* ================= CONTEÚDO ================= */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 bg-white rounded-t-3xl -mt-6 shadow-lg">

        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-blue-500 animate-spin drop-shadow-md" />
            <p className="text-base text-gray-600 text-center font-medium">
              {statusMessage || "Processando..."}
            </p>
          </div>
        ) : (
          <>
            {statusMessage && (
              <p className="text-sm text-gray-500 text-center px-4 leading-relaxed">
                {statusMessage}
              </p>
            )}

            <p className="text-base text-gray-500 text-center">
              Como você quer buscar seu medicamento?
            </p>

            {/* BOTÕES */}
            <div className="flex items-center justify-center gap-12">

              {/* CAMERA */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleCameraClick}
                  disabled={isProcessing}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl flex items-center justify-center
                  hover:scale-110 hover:shadow-2xl
                  active:scale-95
                  transition-all duration-200 disabled:opacity-50"
                >
                  <Camera size={40} />
                </button>
                <span className="text-sm text-gray-600">Câmera</span>
              </div>

              {/* MICROFONE */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleMicClick}
                  disabled={isProcessing}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl flex items-center justify-center
                  hover:scale-110 hover:shadow-2xl
                  active:scale-95
                  transition-all duration-200 disabled:opacity-50"
                >
                  <Mic size={40} />
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