import './App.css'
import {Box, Tab, Tabs} from "@mui/material";
import React from "react";
import StatsTotales from "./pages/stats-totales/StatsTotales.tsx";
import GrapheEmprunts from "./pages/graphe-emprunts/GrapheEmprunts.tsx";
import StatsDiffuseur from "./pages/stats-diffuseur/StatsDiffuseur.tsx";
import StatsEmpruntsPeriode from "./pages/stats-emprunts-periode/StatsEmpruntsPeriode.tsx";
import Connexion from './pages/connexion/Connexion.tsx';

function App() {
    const [selectedTab, setSelectedTab] = React.useState(1);

    function handleTabChange(_event: React.SyntheticEvent, newTabValue: number) {
        setSelectedTab(newTabValue);
    }

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Connexion" value={1}/>
                    <Tab label="Stats totales" value={2}/>
                    <Tab label="Graphe emprunts" value={4}/>
                    <Tab label="Stats emprunts période" value={5}/>
                </Tabs>
            </Box>

            {selectedTab == 2 && <StatsTotales></StatsTotales>}
            {selectedTab == 3 && <GrapheEmprunts></GrapheEmprunts>}
            {selectedTab == 4 && <StatsDiffuseur></StatsDiffuseur>}
            {selectedTab == 5 && <StatsEmpruntsPeriode></StatsEmpruntsPeriode>}
            {selectedTab == 1 && <Connexion></Connexion>}
        </>
    )
}

export default App