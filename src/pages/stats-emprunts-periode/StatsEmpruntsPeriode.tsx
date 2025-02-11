import React, { useState } from 'react';
import axios from 'axios';
import {Container, TextField, Button, Typography, Card, CardContent, Paper} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface Stats {
    nombreEmpruntTotal: number;
    nombreEmpruntParType: {
        S: number;
        XL: number;
        M: number;
    };
}

const StatsEmpruntsPeriode: React.FC = () => {
    const [dateDebut, setDateDebut] = useState<Dayjs | null>(dayjs());
    const [dateFin, setDateFin] = useState<Dayjs | null>(dayjs());
    const [stats, setStats] = useState<Stats | null>(null);
    {/* const [loading, setLoading] = useState<boolean>(false); */}
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const fetchStats = async (dateDebut: string, dateFin: string) => {
        { /* setLoading(true); */}
        setError(null);
        try {
            const response = await axios.get<Stats>(`http://localhost:8080/stats/date?dateDebut=${dateDebut}&dateFin=${dateFin}`);
            setStats(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    if (err.response.status === 400) {
                        setError('Veuillez entrer des dates valides.');
                    }
                } else if (err.request) {
                    setError('Impossible de contacter le serveur, veuillez vérifier votre réseau');
                }
            } else {
                setError('Erreur interne, veuillez réessayer plus tard');
            }
            setStats(null);
        } finally {
            { /* setLoading(false); */ }
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (dateDebut && dateFin) {
            fetchStats(dateDebut.format('YYYY-MM-DD'), dateFin.format('YYYY-MM-DD'));
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', margin: '20px' }}>
                    Stats Emprunts par Période
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 'bold', margin: '20px' }}>
                    Veuillez entrer les dates de début et de fin pour afficher les statistiques
                </Typography>
                <form onSubmit={handleSubmit}>
                    <DatePicker
                        label="Date de Début"
                        value={dateDebut}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setDateDebut(newValue)}
                        textField={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <DatePicker
                        label="Date de Fin"
                        value={dateFin}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setDateFin(newValue)}
                        textField={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <br></br>
                    <Button type="submit" variant="contained" sx={{margin: "20px"}}>
                        Afficher données
                    </Button>
                </form>

                {error && <Typography color="error">{error}</Typography>}

                {stats && (
                    <div>
                        { /*{loading && <CircularProgress />} Possiblité d'ajouter un chargement mais clignotement car trop court*/ }
                        <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', margin: '20px' }}>
                            Stats pour la période sélectionnée
                        </Typography>
                        <Grid container spacing={2.5}>
                            <Grid>
                                <Card sx={{ backgroundColor: theme.palette.secondary.main }}>
                                    <CardContent>
                                        <Typography variant="h6">Nombre d'Emprunts Total</Typography>
                                        <Typography variant="body1">{stats.nombreEmpruntTotal}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid>
                                <Paper style={{ padding: "1rem", backgroundColor: theme.palette.secondary.main }}>
                                    <Typography variant="h6">Nombre Emprunt Par Type</Typography>
                                    <Typography variant="body1">S: {stats.nombreEmpruntParType.S}</Typography>
                                    <Typography variant="body1">XL: {stats.nombreEmpruntParType.XL}</Typography>
                                    <Typography variant="body1">M: {stats.nombreEmpruntParType.M}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                )}
            </Container>
        </LocalizationProvider>
    );
};

export default StatsEmpruntsPeriode;