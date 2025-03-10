import React, { useState, useRef } from 'react';
import axios from 'axios';
import {Container, TextField, Button, Typography, Box} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns';
import DownloadIcon from '@mui/icons-material/Download';

ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    const [graphData, setGraphData] = useState(null);
    const chartRef = useRef<ChartJS>(null);

    const fetchStats = async (dateDebut: string, dateFin: string) => {
        { /* setLoading(true); */}
        setError(null);
        try {
            const [statsResponse, empruntsResponse] = await Promise.all([
                axios.get<Stats>(`http://localhost:8080/stats/date?dateDebut=${dateDebut}&dateFin=${dateFin}`),
                axios.get(`http://localhost:8080/emprunt/getAll`)
            ]);
    
            setStats(statsResponse.data);
    
            const dateDebutObj = new Date(dateDebut);
            const dateFinObj = new Date(dateFin);
            
            const empruntsFiltres = empruntsResponse.data.filter((emprunt: { dateEmprunt: string | number | Date; }) => {
                const dateEmprunt = new Date(emprunt.dateEmprunt);
                return dateEmprunt >= dateDebutObj && dateEmprunt <= dateFinObj;
            });
    
            const empruntsRefactored = empruntsFiltres.reduce((acc: { [x: string]: any; }, curr: { dateEmprunt: string | number | Date; quantite: any; }) => {
                const date = new Date(curr.dateEmprunt).toISOString().split("T")[0];
                acc[date] = (acc[date] || 0) + curr.quantite;
                return acc;
            }, {});
    
            const dates = Object.keys(empruntsRefactored).sort();
            const nbEmprunts = dates.map((date) => empruntsRefactored[date]);
    
            setGraphData({
                labels: dates,
                datasets: [
                    {
                        label: "Nombre d'emprunts par jour",
                        data: nbEmprunts,
                        borderColor: theme.palette.secondary.main,
                    },
                ],
            });
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

    const handleDownload = () => {
        const chart = chartRef.current;
        
        if (chart && chart.canvas) {
            try {
                const canvas = chart.canvas;
                chart.update();
                const link = document.createElement('a');
                link.download = `graphique-emprunts-periode-${dateDebut?.format('YYYY-MM-DD')}-${dateFin?.format('YYYY-MM-DD')}.png`;
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Erreur lors du téléchargement:', error);
            }
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
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid xs={12} md={4}>
                            <Box sx={{ 
                                p: 3, 
                                bgcolor: theme.palette.secondary.main,
                                borderRadius: 1,
                                boxShadow: 1
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    Emprunts Totaux
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {stats.nombreEmpruntTotal}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid xs={12} md={8}>
                            <Box sx={{ 
                                p: 3, 
                                bgcolor: theme.palette.secondary.main,
                                borderRadius: 1,
                                boxShadow: 1
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    Répartition par Type
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid xs={4}>
                                        <Typography variant="subtitle1">
                                            Type S
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            {stats.nombreEmpruntParType.S}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography variant="subtitle1">
                                            Type M
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            {stats.nombreEmpruntParType.M}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography variant="subtitle1">
                                            Type XL
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            {stats.nombreEmpruntParType.XL}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                )}

                {stats && graphData && (
                    <Box sx={{ mt: 4 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 3 
                        }}>
                            <Typography variant="h5" color={theme.palette.primary.main}>
                                Graphique des emprunts sur la période
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownload}
                            >
                                Télécharger
                            </Button>
                        </Box>
                        
                        <Line
                            ref={chartRef}
                            data={graphData}
                            redraw={true}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                        labels: {
                                            color: theme.palette.primary.main,
                                        }
                                    },
                                },
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                day: 'dd MMM yyyy',
                                            },
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            callback: function(value) {
                                                return Number.isInteger(value) ? value : null;
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </Box>
                )}
            </Container>
        </LocalizationProvider>
    );
};

export default StatsEmpruntsPeriode;