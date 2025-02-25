import { Routes, Route } from 'react-router-dom';
import App from './App';
import AdminUserPage from './pages/admin/user';
import AdminEmpruntPage from './pages/admin/emprunts';
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
                    <AdminUserPage />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/admin/emprunt" 
            element={
                <ProtectedRoute>
                    <AdminEmpruntPage />
                </ProtectedRoute>
            } 
        />
    </Routes>
);

export default AppRoutes;