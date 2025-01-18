import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import StatsTotales from './pages/stats-totales/StatsTotales';
import GrapheEmprunts from "./pages/graphe-emprunts/GrapheEmprunts.tsx";
import StatsDiffuseur from "./pages/stats-diffuseur/StatsDiffuseur.tsx";
import StatsEmpruntsPeriode from "./pages/stats-emprunts-periode/StatsEmpruntsPeriode.tsx";

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/statstotales" element={<StatsTotales />} />
            <Route path="/grapheemprunts" element={<GrapheEmprunts />} />
            <Route path="/statsdiffuseur" element={<StatsDiffuseur />} />
            <Route path="/statsempruntsperiode" element={<StatsEmpruntsPeriode />} />
        </Routes>
    </Router>
);

export default AppRoutes;