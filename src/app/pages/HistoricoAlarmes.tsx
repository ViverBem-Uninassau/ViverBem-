import { useNavigate } from "react-router";
import { Clock, ChevronRight, Plus } from "lucide-react";

const alarmes = [
  { id: 1, hora: "08:00", frequencia: "Diário", remedio: "Dipirona", ativo: true },
  { id: 2, hora: "12:00", frequencia: "Diário", remedio: "Amoxicilina", ativo: true },
  { id: 3, hora: "14:30", frequencia: "Segunda a Sexta", remedio: "Paracetamol", ativo: false },
  { id: 4, hora: "18:00", frequencia: "Diário", remedio: "Losartana", ativo: true },
  { id: 5, hora: "20:00", frequencia: "Segunda, Quarta e Sexta", remedio: "Omeprazol", ativo: false },
  { id: 6, hora: "22:00", frequencia: "Diário", remedio: "Ibuprofeno", ativo: true },
];

export function HistoricoAlarmes() {
  const navigate = useNavigate();

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 relative">
      <div className="max-w-md mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-6 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Seus Alarmes</h1>
        </div>

        {/* Lista de Alarmes */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {alarmes.map((alarme) => (
            <button
              key={alarme.id}
              onClick={() => navigate(`/alarmes/${alarme.id}`)}
              className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alarme.ativo ? "bg-orange-100" : "bg-gray-200"
                }`}>
                  <Clock size={24} className={alarme.ativo ? "text-orange-600" : "text-gray-400"} strokeWidth={2} />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className={`text-2xl font-bold ${alarme.ativo ? "text-gray-800" : "text-gray-400"}`}>
                      {alarme.hora}
                    </span>
                    <span className={`text-sm ${alarme.ativo ? "text-gray-500" : "text-gray-400"}`}>
                      {alarme.frequencia}
                    </span>
                  </div>
                  <span className={`text-base font-medium ${alarme.ativo ? "text-gray-700" : "text-gray-400"}`}>
                    {alarme.remedio}
                  </span>
                  <div className="mt-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      alarme.ativo 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {alarme.ativo ? "Ativado" : "Desativado"}
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

      {/* Botão Flutuante - Novo Alarme */}
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
