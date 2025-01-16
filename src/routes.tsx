import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import StatsTotales from './pages/stats-totales/StatsTotales';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/statstotales" element={<StatsTotales />} />
        </Routes>
    </Router>
);

export default AppRoutes;