import './App.css';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { useAuth } from './contexts/AuthContext';
import StatsTotales from "./pages/stats-totales/StatsTotales";
import GrapheEmprunts from "./pages/graphe-emprunts/GrapheEmprunts";
import StatsDiffuseur from "./pages/stats-diffuseur/StatsDiffuseur";
import StatsEmpruntsPeriode from "./pages/stats-emprunts-periode/StatsEmpruntsPeriode";
import Connexion from './pages/connexion/Connexion';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { authService } from './services/auth.service.ts';

function App() {
    const [selectedTab, setSelectedTab] = React.useState(1);
    const { isAuthenticated, logout, user } = useAuth();

    function handleTabChange(_event: React.SyntheticEvent, newTabValue: number) {
        setSelectedTab(newTabValue);
    }

    if (!isAuthenticated) {
        return <Connexion />;
    }

    return (
        <>
            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider', 
                marginBottom: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Stats totales" value={1}/>
                    <Tab label="Graphe des emprunts" value={2}/>
                    <Tab label="Stats diffuseurs" value={3}/>
                    <Tab label="Stats emprunts par période" value={4}/>
                </Tabs>
                <Typography variant="subtitle1">
                        {user?.prenom && user?.nom 
                            ? `Bonjour ${user.prenom} ${user.nom}`
                            : 'Bonjour'}
                    </Typography>
                <Button 
                    onClick={() => {
                        logout();
                        window.location.href = '/';
                    }}
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 2 }} 
                >
                    Déconnexion
                </Button>
            </Box>

            {selectedTab === 1 && <ProtectedRoute><StatsTotales /></ProtectedRoute>}
            {selectedTab === 2 && <ProtectedRoute><GrapheEmprunts /></ProtectedRoute>}
            {selectedTab === 3 && <ProtectedRoute><StatsDiffuseur /></ProtectedRoute>}
            {selectedTab === 4 && <ProtectedRoute><StatsEmpruntsPeriode /></ProtectedRoute>}
        </>
    );
}

export default App;