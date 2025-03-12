import './App.css';
import { Box, Button, Tab, Tabs, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import React from "react";
import { useAuth } from './contexts/AuthContext';
import StatsTotales from "./pages/stats-totales/StatsTotales";
import GrapheEmprunts from "./pages/graphe-emprunts/GrapheEmprunts";
import StatsDiffuseur from "./pages/stats-diffuseur/StatsDiffuseur";
import StatsEmpruntsPeriode from "./pages/stats-emprunts-periode/StatsEmpruntsPeriode";
import Connexion from './pages/connexion/Connexion';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Populaire from './pages/populaire/Populaire.tsx';
import { useNavigate } from 'react-router-dom';
import logoPassplat from '../public/logo-passplat.png'

function App() {
    const [selectedTab, setSelectedTab] = React.useState(1);
    const navigate = useNavigate()
    const { isAuthenticated, logout } = useAuth();
    const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

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

    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserManagement = () => {
        navigate("/admin/user");
        handleAdminMenuClose();
    };

    const handleEmprunt = () => {
        navigate("/admin/emprunt");
        handleAdminMenuClose();
    };

    return (
        <>
        <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px'
        }}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center'
            }}>
                <img 
                    src="/logo-passplat.png" 
                    alt="Logo PassPlat" 
                    style={{ 
                        height: '40px',
                        marginRight: '24px'
                    }} 
                />
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Stats totales" value={1}/>
                    <Tab label="Graphe des emprunts" value={2}/>
                    <Tab label="Stats diffuseurs" value={3}/>
                    <Tab label="Stats par période" value={4}/>
                    <Tab label="Populaire" value={5}/>
                </Tabs>
            </Box>
    
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        aria-label="admin"
                        onClick={handleAdminMenuOpen}
                        color="primary"
                        sx={{ ml: 5 }}
                        aria-controls={open ? 'admin-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <AdminPanelSettingsIcon />
                    </IconButton>
                    <Menu
                        id="admin-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleAdminMenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'admin-button',
                        }}
                    >
                        <MenuItem onClick={handleUserManagement}>Gestion des utilisateurs</MenuItem>
                        <MenuItem onClick={handleEmprunt}>Gestion des emprunts</MenuItem>
                    </Menu>
                    <Button 
                        onClick={handleLogoutClick}
                        variant="outlined"
                        color="primary"
                        sx={{ ml: 2 }} 
                    >
                        Déconnexion
                    </Button>
                </Box>
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
            {selectedTab === 5 && <ProtectedRoute><Populaire /></ProtectedRoute>}
        </>
    );
}

export default App;