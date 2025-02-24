import './App.css';
import { Box, Button, Tab, Tabs, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
    const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

    function handleTabChange(_event: React.SyntheticEvent, newTabValue: number) {
        setSelectedTab(newTabValue);
    }

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        window.location.href = '/';
        setOpenLogoutDialog(false);
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
    };

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
                    onClick={handleLogoutClick}
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 2 }} 
                >
                    Déconnexion
                </Button>
            </Box>

            <Dialog
                open={openLogoutDialog}
                onClose={handleLogoutCancel}
                aria-labelledby="logout-dialog-title"
            >
                <DialogTitle id="logout-dialog-title">
                    Confirmation de déconnexion
                </DialogTitle>
                <DialogContent>
                    Êtes-vous sûr de vouloir vous déconnecter ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} variant="outlined" color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleLogoutConfirm} variant="contained" color="error" autoFocus>
                        Déconnexion
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedTab === 1 && <ProtectedRoute><StatsTotales /></ProtectedRoute>}
            {selectedTab === 2 && <ProtectedRoute><GrapheEmprunts /></ProtectedRoute>}
            {selectedTab === 3 && <ProtectedRoute><StatsDiffuseur /></ProtectedRoute>}
            {selectedTab === 4 && <ProtectedRoute><StatsEmpruntsPeriode /></ProtectedRoute>}
        </>
    );
}

export default App;