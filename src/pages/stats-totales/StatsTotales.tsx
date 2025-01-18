import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Container, Card, CardContent, Typography, Paper, CircularProgress} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';



interface Stats {
    nombreUtilisateur: number;
    nombreDiffuseur: number;
    nombreCollecteur: number;
    nombreDiffuseurCollecteur: number;
    nombreEmpruntTotal: number;
    nombreEmpruntRendu: number;
    nombreEmpruntEnCours: number;
    nombreEmpruntParContenant: {
        S: number;
        XL: number;
        M: number;
    };
    stockContenantTotal: number;
    stockContenantParType: {
        S: number;
        XL: number;
        M: number;
    };
}

const StatsTotales: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get<Stats>('http://localhost:8080/stats');
                setStats(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) { // On spécifie qu'il s'agit d'erreurs axios
                    if (err.response) {
                        if (err.response.status >= 500) {
                            setError('Erreur interne, veuillez réessayer plus tard');
                        } else {
                            setError('Serveur inaccessible ou indisponible');
                        }
                    } else if (err.request) {
                        setError('Impossible de contacter le serveur, veuillez vérifier votre réseau');
                    } else {
                        setError('Erreur interne, veuillez réessayer plus tard');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
    if (error) {
        return <Typography>{error}</Typography>;
    }

    if (!stats) {
        return <Typography>Erreur du chargement des données</Typography>
    }

    return (
        <Container>
            {loading && <CircularProgress />}
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            Stats Totales
            </Typography>
            <Grid container spacing={2}>
                {[
                    { label: "Nombre d'Utilisateurs", value: stats.nombreUtilisateur },
                    { label: "Nombre de Diffuseurs", value: stats.nombreDiffuseur },
                    { label: "Nombre de Collecteurs", value: stats.nombreCollecteur },
                    { label: "Nombre de Diffuseurs Collecteurs", value: stats.nombreDiffuseurCollecteur },
                    { label: "Nombre d'Emprunts Total", value: stats.nombreEmpruntTotal },
                    { label: "Nombre d'Emprunts Rendus", value: stats.nombreEmpruntRendu },
                    { label: "Nombre d'Emprunts En Cours", value: stats.nombreEmpruntEnCours },
                    { label: "Ratio Emprunts Rendus/Total", value: stats.nombreEmpruntTotal > 0 ? `${(stats.nombreEmpruntRendu / stats.nombreEmpruntTotal * 100).toFixed(2)}%` : 'N/A' },
                    { label: "Émission carbone évitée au total", value: "TBD" }
                ].map((stat, index) => (
                    <Grid key={index}>
                        <Card sx={{ backgroundColor: theme.palette.secondary.main }}>
                            <CardContent>
                                <Typography variant="h6">{stat.label}</Typography>
                                <Typography variant="body1">{stat.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                <Grid>
                    <Paper style={{ padding: "1rem", backgroundColor: theme.palette.secondary.main }}>
                        <Typography variant="h6">Nombre Emprunt Par Contenant</Typography>
                        <Typography variant="body1">S: {stats.nombreEmpruntParContenant.S}</Typography>
                        <Typography variant="body1">XL: {stats.nombreEmpruntParContenant.XL}</Typography>
                        <Typography variant="body1">M: {stats.nombreEmpruntParContenant.M}</Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper style={{ padding: "1rem", backgroundColor: theme.palette.secondary.main }}>
                        <Typography variant="h6">Stock Contenant Par Type</Typography>
                        <Typography variant="body1">S: {stats.stockContenantParType.S}</Typography>
                        <Typography variant="body1">XL: {stats.stockContenantParType.XL}</Typography>
                        <Typography variant="body1">M: {stats.stockContenantParType.M}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );

};

export default StatsTotales;