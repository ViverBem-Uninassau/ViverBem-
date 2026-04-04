import { Camera, Mic } from "lucide-react";

export function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      
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
          <p className="text-sm text-white/90">
            Seu assistente de medicamentos
          </p>
        </div>
      </div>

      {/* PARTE DE BAIXO */}
      <div className="h-1/2 flex flex-col items-center justify-center gap-8 px-6 bg-white">
        
        <p className="text-base text-gray-500 text-center">
          Como deseja consultar a bula?
        </p>

        {/* BOTÕES LADO A LADO */}
        <div className="flex items-center justify-center gap-10">
          
          {/* Câmera */}
          <div className="flex flex-col items-center gap-2">
            <button className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl flex items-center justify-center">
              <Camera size={36} />
            </button>
            <span className="text-sm text-gray-600">Câmera</span>
          </div>

          {/* Microfone */}
          <div className="flex flex-col items-center gap-2">
            <button className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl flex items-center justify-center">
              <Mic size={36} />
            </button>
            <span className="text-sm text-gray-600">Voz</span>
          </div>

        </div>
      </div>

    </div>
  );
}