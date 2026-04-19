import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { HistoricoBulas } from "./pages/HistoricoBulas";
import { DetalheBula } from "./pages/DetalheBula";
import { DetalheChat } from "./pages/DetalheChat";
import { HistoricoAlarmes } from "./pages/HistoricoAlarmes";
import { DetalheAlarme } from "./pages/DetalheAlarme";
import { NovoAlarme } from "./pages/NovoAlarme";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "bulas", Component: HistoricoBulas },
      { path: "bulas/resultado", Component: DetalheBula },
      { path: "bulas/:id", Component: DetalheBula },
      { path: "chat/resultado", Component: DetalheChat },
      { path: "alarmes", Component: HistoricoAlarmes },
      { path: "alarmes/novo", Component: NovoAlarme },
      { path: "alarmes/:id", Component: DetalheAlarme },
    ],
  },
]);