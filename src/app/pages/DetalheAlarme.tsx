import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Power, Trash2, AlertCircle } from "lucide-react";

const alarmesData = {
  "1": { hora: "08:00", frequencia: "Diário", remedio: "Dipirona", ativo: true },
  "2": { hora: "12:00", frequencia: "Diário", remedio: "Amoxicilina", ativo: true },
  "3": { hora: "14:30", frequencia: "Segunda a Sexta", remedio: "Paracetamol", ativo: false },
  "4": { hora: "18:00", frequencia: "Diário", remedio: "Losartana", ativo: true },
  "5": { hora: "20:00", frequencia: "Segunda, Quarta e Sexta", remedio: "Omeprazol", ativo: false },
  "6": { hora: "22:00", frequencia: "Diário", remedio: "Ibuprofeno", ativo: true },
};

export function DetalheAlarme() {
  const navigate = useNavigate();
  const { id } = useParams();
  const alarmeInicial = alarmesData[id as keyof typeof alarmesData];
  
  const [ativo, setAtivo] = useState(alarmeInicial?.ativo || false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const handleToggleAtivo = () => {
    setAtivo(!ativo);
    console.log(ativo ? "Desativando alarme" : "Ativando alarme", id);
  };

  const handleExcluir = () => {
    setMostrarConfirmacao(true);
  };

  const confirmarExclusao = () => {
    console.log("Excluir alarme confirmado", id);
    navigate("/alarmes");
  };

  const cancelarExclusao = () => {
    setMostrarConfirmacao(false);
  };

  if (!alarmeInicial) {
    return (
      <div className="size-full flex items-center justify-center">
        <p className="text-gray-500">Alarme não encontrado</p>
      </div>
    );
  }

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/alarmes")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Detalhes do Alarme</h1>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Horário</p>
              <p className="text-4xl font-bold text-gray-800">{alarmeInicial.hora}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Medicamento</p>
              <p className="text-2xl font-semibold text-gray-800">{alarmeInicial.remedio}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Frequência</p>
              <p className="text-lg text-gray-700">{alarmeInicial.frequencia}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                ativo 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                <div className={`w-2 h-2 rounded-full ${ativo ? "bg-green-600" : "bg-gray-400"}`}></div>
                {ativo ? "Ativado" : "Desativado"}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="bg-white border-t border-gray-200 p-6 space-y-4">
          {/* Botão Ativar/Desativar */}
          <button
            onClick={handleToggleAtivo}
            className={`w-full rounded-full py-5 px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
              ativo
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200"
            }`}
          >
            <Power size={22} strokeWidth={2.5} />
            <span className="text-lg font-bold">
              {ativo ? "Desativar Alarme" : "Ativar Alarme"}
            </span>
          </button>

          {/* Botão Excluir */}
          <button
            onClick={handleExcluir}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full py-5 px-8 shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Trash2 size={22} strokeWidth={2.5} />
            <span className="text-lg font-bold">Excluir Alarme</span>
          </button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {mostrarConfirmacao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-600" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Tem certeza?
              </h2>
              <p className="text-base text-gray-600 text-center">
                Deseja realmente excluir este alarme? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmarExclusao}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full py-4 px-6 shadow-lg shadow-red-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
              >
                Sim, Excluir
              </button>
              <button
                onClick={cancelarExclusao}
                className="w-full bg-gray-200 text-gray-700 rounded-full py-4 px-6 hover:bg-gray-300 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
