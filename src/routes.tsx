import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import StatsTotales from './pages/stats-totales/StatsTotales';
import GrapheEmprunts from "./pages/graphe-emprunts/GrapheEmprunts.tsx";

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/statstotales" element={<StatsTotales />} />
            <Route path="/grapheemprunts" element={<GrapheEmprunts />} />
        </Routes>
    </Router>
);

export default AppRoutes;