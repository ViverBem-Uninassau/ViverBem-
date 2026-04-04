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
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full pb-20">
          <Outlet />
        </div>
      </div>

      {/* Bottom Tab Bar FIXA */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around h-20 max-w-md mx-auto px-4">
          
          <button
            onClick={() => navigate("/bulas")}
            className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-all ${
              isActive("/bulas")
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            <Menu size={28} />
            <span className="text-xs">Bulas</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center gap-1 px-8 py-2 rounded-lg transition-all ${
              isActive("/") && location.pathname === "/"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500"
            }`}
          >
            <Home size={32} />
            <span className="text-xs font-bold">Início</span>
          </button>

          <button
            onClick={() => navigate("/alarmes")}
            className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-all ${
              isActive("/alarmes")
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            <Clock size={28} />
            <span className="text-xs">Alarmes</span>
          </button>

        </div>
      </nav>
    </div>
  );
}