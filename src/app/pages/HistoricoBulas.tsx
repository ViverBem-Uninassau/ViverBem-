import { useNavigate } from "react-router";
import { FileText, ChevronRight } from "lucide-react";

const bulas = [
  { id: 1, nome: "Dipirona" },
  { id: 2, nome: "Amoxicilina" },
  { id: 3, nome: "Paracetamol" },
  { id: 4, nome: "Ibuprofeno" },
  { id: 5, nome: "Losartana" },
  { id: 6, nome: "Omeprazol" },
];

export function HistoricoBulas() {
  const navigate = useNavigate();

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-md mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-6 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Histórico de Bulas</h1>
        </div>

        {/* Lista de Bulas */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {bulas.map((bula) => (
            <button
              key={bula.id}
              onClick={() => navigate(`/bulas/${bula.id}`)}
              className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" strokeWidth={2} />
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  Bula do Remédio {bula.nome}
                </span>
              </div>
              <ChevronRight
                size={24}
                className="text-gray-400 group-hover:text-blue-600 transition-colors"
                strokeWidth={2.5}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
