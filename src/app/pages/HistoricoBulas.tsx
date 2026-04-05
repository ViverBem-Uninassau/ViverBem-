import { useState } from "react";
import { useNavigate } from "react-router";
import { FileText, ChevronRight, Search } from "lucide-react";
import { medicamentos, type Medicamento } from "../services/api";

export function HistoricoBulas() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState<Medicamento | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const sugestoes = ["Dipirona", "Amoxicilina", "Paracetamol", "Losartana", "Omeprazol"];

  const buscarMedicamento = async (nome: string) => {
    if (!nome.trim()) return;
    setBuscando(true);
    setErro(null);
    setResultado(null);
    try {
      const med = await medicamentos.buscar(nome);
      setResultado(med);
      navigate("/bulas/resultado", { state: med });
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Medicamento não encontrado");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-md mx-auto h-full flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 py-6 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Consultar Bula</h1>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Campo de busca */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nome do medicamento
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscarMedicamento(busca)}
                placeholder="Ex: Dipirona"
                className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              <button
                onClick={() => buscarMedicamento(busca)}
                disabled={buscando}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow hover:shadow-md transition-all disabled:opacity-60"
              >
                <Search size={22} />
              </button>
            </div>

            {erro && (
              <p className="mt-3 text-sm text-red-600">{erro}</p>
            )}
          </div>

          {/* Sugestões */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm font-semibold text-gray-500 mb-3">Medicamentos disponíveis</p>
            <div className="space-y-2">
              {sugestoes.map((nome) => (
                <button
                  key={nome}
                  onClick={() => buscarMedicamento(nome)}
                  className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-shadow p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText size={20} className="text-blue-600" strokeWidth={2} />
                    </div>
                    <span className="text-base font-semibold text-gray-800">{nome}</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-gray-400 group-hover:text-blue-600 transition-colors"
                    strokeWidth={2.5}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
