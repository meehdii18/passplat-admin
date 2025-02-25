import { Routes, Route } from 'react-router-dom';
import App from './App';
import AdminPage from './pages/admin/user';
import Connexion from './pages/connexion/Connexion';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route 
            path="/admin/user" 
            element={
                <ProtectedRoute>
                    <AdminPage />
                </ProtectedRoute>
            } 
        />
    </Routes>
);

export default AppRoutes;