import { Camera, Mic } from "lucide-react";

export function Home() {
  const handleCameraClick = () => {
    console.log("Câmera acionada");
  };

  const handleMicClick = () => {
    console.log("Microfone acionado");
  };

  return (
    <div className="size-full flex flex-col">
      {/* Parte Superior - Logo e Título */}
      <div className="flex-1 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 flex flex-col items-center justify-center gap-4 px-8">
        {/* Ícone Cruz Médica */}
        <div className="w-32 h-32 bg-blue-200/40 rounded-3xl flex items-center justify-center backdrop-blur-sm">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="30" y="10" width="20" height="60" rx="4" fill="white" />
            <rect x="10" y="30" width="60" height="20" rx="4" fill="white" />
          </svg>
        </div>
        
        {/* Título */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">MedCare</h1>
          <p className="text-lg text-white/90">Seu assistente de medicamentos</p>
        </div>
      </div>

      {/* Parte Inferior - Botões */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 bg-white">
        {/* Texto Pergunta */}
        <p className="text-lg text-gray-500">Como deseja consultar a bula?</p>
        
        {/* Botões */}
        <div className="flex items-center gap-12">
          {/* Botão Câmera */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleCameraClick}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-300 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
              aria-label="Tirar foto da bula"
            >
              <Camera size={48} strokeWidth={2.5} />
            </button>
            <span className="text-base text-gray-600 font-medium">Câmera</span>
          </div>

          {/* Botão Microfone (Voz) */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleMicClick}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl shadow-green-300 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
              aria-label="Falar por voz"
            >
              <Mic size={48} strokeWidth={2.5} />
            </button>
            <span className="text-base text-gray-600 font-medium">Voz</span>
          </div>
        </div>
      </div>
    </div>
  );
}