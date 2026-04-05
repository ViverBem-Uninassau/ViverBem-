import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Power, Trash2, AlertCircle } from "lucide-react";
import { alarmes, type Alarme } from "../services/api";

const FREQ_MAP: Record<string, string> = {
  daily: "Diário",
  weekdays: "Segunda a Sexta",
  weekend: "Fim de Semana",
  "mon-wed-fri": "Segunda, Quarta e Sexta",
  "tue-thu": "Terça e Quinta",
};

export function DetalheAlarme() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [alarme, setAlarme] = useState<Alarme | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    alarmes.listar()
      .then((lista) => {
        const encontrado = lista.find((a) => a.id === id) ?? null;
        setAlarme(encontrado);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  const handleToggleAtivo = async () => {
    if (!alarme) return;
    setProcessando(true);
    try {
      await alarmes.atualizar(alarme.id, { active: !alarme.active });
      setAlarme({ ...alarme, active: !alarme.active });
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao atualizar alarme");
    } finally {
      setProcessando(false);
    }
  };

  const confirmarExclusao = async () => {
    if (!alarme) return;
    setProcessando(true);
    try {
      await alarmes.remover(alarme.id);
      navigate("/alarmes");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir alarme");
      setMostrarConfirmacao(false);
    } finally {
      setProcessando(false);
    }
  };

  if (carregando) {
    return (
      <div className="size-full flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (!alarme) {
    return (
      <div className="size-full flex items-center justify-center">
        <p className="text-gray-500">Alarme não encontrado</p>
      </div>
    );
  }

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto h-full flex flex-col w-full">
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

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            {erro && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {erro}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Horário</p>
              <p className="text-4xl font-bold text-gray-800">{alarme.time}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Medicamento</p>
              <p className="text-2xl font-semibold text-gray-800">{alarme.medication}</p>
            </div>

            {alarme.dosage && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Dosagem</p>
                <p className="text-lg text-gray-700">{alarme.dosage}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Frequência</p>
              <p className="text-lg text-gray-700">{FREQ_MAP[alarme.frequency] ?? alarme.frequency}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                alarme.active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                <div className={`w-2 h-2 rounded-full ${alarme.active ? "bg-green-600" : "bg-gray-400"}`}></div>
                {alarme.active ? "Ativado" : "Desativado"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-6 space-y-4">
          <button
            onClick={handleToggleAtivo}
            disabled={processando}
            className={`w-full rounded-full py-5 px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:scale-100 ${
              alarme.active
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200"
            }`}
          >
            <Power size={22} strokeWidth={2.5} />
            <span className="text-lg font-bold">
              {alarme.active ? "Desativar Alarme" : "Ativar Alarme"}
            </span>
          </button>

          <button
            onClick={() => setMostrarConfirmacao(true)}
            disabled={processando}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full py-5 px-8 shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:scale-100"
          >
            <Trash2 size={22} strokeWidth={2.5} />
            <span className="text-lg font-bold">Excluir Alarme</span>
          </button>
        </div>
      </div>

      {mostrarConfirmacao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-600" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Tem certeza?</h2>
              <p className="text-base text-gray-600 text-center">
                Deseja realmente excluir este alarme? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmarExclusao}
                disabled={processando}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full py-4 px-6 shadow-lg shadow-red-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all font-bold disabled:opacity-60"
              >
                {processando ? "Excluindo..." : "Sim, Excluir"}
              </button>
              <button
                onClick={() => setMostrarConfirmacao(false)}
                disabled={processando}
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
