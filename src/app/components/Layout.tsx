import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, Menu, Clock } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      {/* Bottom Tab Bar */}
      <nav className="bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around h-20 max-w-md mx-auto px-4">
          {/* Histórico de Bulas */}
          <button
            onClick={() => navigate("/bulas")}
            className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-all ${
              isActive("/bulas")
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Histórico de Bulas"
          >
            <Menu size={28} strokeWidth={2} />
            <span className="text-xs font-medium">Bulas</span>
          </button>

          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center gap-1 px-8 py-2 rounded-lg transition-all ${
              isActive("/") && location.pathname === "/"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Página Principal"
          >
            <Home size={32} strokeWidth={2.5} />
            <span className="text-xs font-bold">Início</span>
          </button>

          {/* Histórico de Alarmes */}
          <button
            onClick={() => navigate("/alarmes")}
            className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-all ${
              isActive("/alarmes")
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Histórico de Alarmes"
          >
            <Clock size={28} strokeWidth={2} />
            <span className="text-xs font-medium">Alarmes</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
