import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { alarmes } from "../services/api";

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const unidades = ["comprimido(s)", "ml", "mg", "gota(s)", "cápsula(s)"];

export function NovoAlarme() {
  const navigate = useNavigate();

  const [hora, setHora] = useState("08:00");
  const [remedio, setRemedio] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [unidade, setUnidade] = useState("comprimido(s)");

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [frequenciaTipo, setFrequenciaTipo] = useState("8");
  const [frequenciaCustom, setFrequenciaCustom] = useState("");

  const [tipoDias, setTipoDias] = useState("todos");
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDia = (index: number) => {
    setDiasSelecionados((prev) =>
      prev.includes(index)
        ? prev.filter((d) => d !== index)
        : [...prev, index]
    );
  };

  const handleSalvar = async () => {
    const frequencia =
      frequenciaTipo === "custom"
        ? frequenciaCustom
        : frequenciaTipo;

    if (!remedio.trim()) return setErro("Informe o medicamento");
    if (!dosagem.trim()) return setErro("Informe a dosagem");
    if (!frequencia) return setErro("Informe a frequência");

    setSalvando(true);
    setErro(null);

    try {
      await alarmes.criar({
        medication: remedio.trim(),
        time: hora,
        frequency: `${frequencia}h`,
        dosage_value: dosagem,
        dosage_unit: unidade,
        days: tipoDias === "custom" ? diasSelecionados : tipoDias,
      });

      navigate("/alarmes");
    } catch (e: any) {
      setErro(e.message || "Erro ao criar alarme");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      <div className="max-w-md mx-auto w-full h-full flex flex-col">

        {/* HEADER */}
        <div className="bg-white shadow-sm border-b px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/alarmes")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Novo Alarme
          </h1>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">

            {erro && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            {/* HORÁRIO */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Horário
              </label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            {/* MEDICAMENTO */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Medicamento
              </label>
              <input
                type="text"
                placeholder="Ex: Dipirona"
                value={remedio}
                onChange={(e) => setRemedio(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>

            {/* DOSAGEM */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Dosagem
              </label>

              <div className="flex gap-3">
                {/* INPUT CONTROLADO */}
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1"
                  value={dosagem}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value !== "") {
                      let num = Number(value);
                      if (num > 100) num = 100;
                      if (num < 1) num = 1;
                      value = String(num);
                    }
                    setDosagem(value);
                  }}
                  className="w-24 px-4 py-3 border-2 border-gray-200 rounded-xl text-center focus:border-blue-500 outline-none"
                />

                {/* DROPDOWN CUSTOM */}
                <div className="relative flex-1" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-left 
                    hover:border-blue-400 hover:shadow-sm transition flex items-center justify-between"
                  >
                    <span>{unidade}</span>
                    <span className={`transition ${openDropdown ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>

                  {openDropdown && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {unidades.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setUnidade(item);
                            setOpenDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition
                          hover:bg-blue-50 hover:text-blue-600
                          ${unidade === item ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600"}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* INTERVALO */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Intervalo de uso
              </label>

              <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
                {["6", "8", "12", "custom"].map((h) => (
                  <button
                    key={h}
                    onClick={() => setFrequenciaTipo(h)}
                    className={`px-4 py-2 text-sm rounded-lg transition ${
                      frequenciaTipo === h
                        ? "bg-white shadow text-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {h === "custom" ? "Personalizado" : `${h}h`}
                  </button>
                ))}
              </div>

              {frequenciaTipo === "custom" && (
                <input
                  type="number"
                  placeholder="Ex: 10"
                  value={frequenciaCustom}
                  onChange={(e) => setFrequenciaCustom(e.target.value)}
                  className="mt-3 w-28 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                />
              )}
            </div>

            {/* DIAS */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Dias
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Todos", value: "todos" },
                  { label: "Seg-Sex", value: "semana" },
                  { label: "Fim de semana", value: "fds" },
                  { label: "Personalizado", value: "custom" },
                ].map((op) => (
                  <button
                    key={op.value}
                    onClick={() => setTipoDias(op.value)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      tipoDias === op.value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              {tipoDias === "custom" && (
                <div className="flex gap-2 mt-3">
                  {diasSemana.map((dia, i) => (
                    <button
                      key={dia}
                      onClick={() => toggleDia(i)}
                      className={`w-10 h-10 rounded-full text-sm border transition ${
                        diasSelecionados.includes(i)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÃO */}
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full py-4 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Plus size={20} />
              {salvando ? "Salvando..." : "Criar Alarme"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}