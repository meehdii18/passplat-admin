import React, { useState } from 'react';
import axios from 'axios';
import {Container, TextField, Button, Typography, Card, CardContent, Paper} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

interface StatsDiffuseur {
    nomDiffuseur: string;
    nombreEmpruntTotal: number;
    nombreEmpruntEnCours: number;
    stockContenantTotal: number;
    nombreEmpruntParType: {
        S: number;
        XL: number;
        M: number;
    };
    stockContenantParType: {
        S: number;
        XL: number;
        M: number;
    };
}

const StatsDiffuseur: React.FC = () => {
    const [id, setId] = useState<string>('');
    const [stats, setStats] = useState<StatsDiffuseur | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const fetchStats = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<StatsDiffuseur>(`http://localhost:8080/stats/${id}`);
            setStats(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) { // On spécifie qu'il s'agit d'erreurs axios
                if (err.response) {
                    if (err.response.status === 404) {
                        setError('Diffuseur introuvable');
                    }
                } else if (err.request) {
                    setError('Impossible de contacter le serveur, veuillez vérifier votre réseau');
                }
            } else {
                setError('Erreur interne, veuillez réessayer plus tard');
            }
            setStats(null); // On supprime l'affichage précédent en cas d'erreur
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchStats(id);
    };

    return (

        <Container>
            {/* {loading && <CircularProgress />} */} {/* On peut ajouter un loading mais ça fait clignoter car temps trop court */}

            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', margin: '20px' }}>
                Stats Diffuseur
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 'bold', margin: '20px' }}>
                Veuillez entrer l'ID du diffuseur pour afficher ses statistiques
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="ID Diffuseur"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? 'Loading...' : 'Fetch Stats'}
                </Button>
            </form>

            {error && <Typography color="error">{error}</Typography>}

            {stats && ( // N'affiche les statistiques qu'une fois qu'elles ont été fetch
                <div>
                    <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', margin: '20px' }}>
                        {stats.nomDiffuseur}
                    </Typography>
                    <Grid container spacing={2.5}>
                        {[
                            { label: "Nombre d'Emprunts Total", value: stats.nombreEmpruntTotal },
                            { label: "Nombre d'Emprunts En Cours", value: stats.nombreEmpruntEnCours },
                            { label: "Stock Contenants Total", value: stats.stockContenantTotal }
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
                                <Typography variant="h6">Nombre Emprunt Par Type</Typography>
                                <Typography variant="body1">S: {stats.nombreEmpruntParType.S}</Typography>
                                <Typography variant="body1">XL: {stats.nombreEmpruntParType.XL}</Typography>
                                <Typography variant="body1">M: {stats.nombreEmpruntParType.M}</Typography>
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
                </div>
            )}
        </Container>
    );
};

export default StatsDiffuseur;