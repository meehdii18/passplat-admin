import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';



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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get<Stats>('http://localhost:8080/stats');
                setStats(response.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>{error}</Typography>;
    }

    if (!stats) {
        return <Typography>No data available</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Stats Totales
            </Typography>
            <Grid container spacing={3}>
                {[
                    { label: "Nombre d'Utilisateurs", value: stats.nombreUtilisateur },
                    { label: "Nombre de Diffuseurs", value: stats.nombreDiffuseur },
                    { label: "Nombre de Collecteurs", value: stats.nombreCollecteur },
                    { label: "Nombre de Diffuseurs Collecteurs", value: stats.nombreDiffuseurCollecteur },
                    { label: "Nombre d'Emprunts Total", value: stats.nombreEmpruntTotal },
                    { label: "Nombre d'Emprunts Rendus", value: stats.nombreEmpruntRendu },
                    { label: "Nombre d'Emprunts En Cours", value: stats.nombreEmpruntEnCours },
                ].map((stat, index) => (
                    <Grid key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{stat.label}</Typography>
                                <Typography variant="body1">{stat.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                <Grid>
                    <Paper elevation={3} style={{ padding: "1rem" }}>
                        <Typography variant="h6">Nombre Emprunt Par Contenant</Typography>
                        <Typography variant="body1">S: {stats.nombreEmpruntParContenant.S}</Typography>
                        <Typography variant="body1">XL: {stats.nombreEmpruntParContenant.XL}</Typography>
                        <Typography variant="body1">M: {stats.nombreEmpruntParContenant.M}</Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper elevation={3} style={{ padding: "1rem" }}>
                        <Typography variant="h6">Stock Contenant Total</Typography>
                        <Typography variant="body1">{stats.stockContenantTotal}</Typography>
                    </Paper>
                </Grid>
                <Grid>
                    <Paper elevation={3} style={{ padding: "1rem" }}>
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