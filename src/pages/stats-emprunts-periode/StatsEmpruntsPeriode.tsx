import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Container, 
    Button, 
    Typography, 
    Box, 
    Paper, 
    Card, 
    CardContent, 
    Divider,
    IconButton,
    Tooltip,
    CircularProgress,
    useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    TimeScale,
    Filler
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InventoryIcon from '@mui/icons-material/Inventory';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    TimeScale, 
    PointElement, 
    LineElement, 
    Title, 
    ChartTooltip, 
    Legend,
    Filler
);

interface Stats {
    nombreEmpruntTotal: number;
    nombreEmpruntParType: {
        S: number;
        XL: number;
        M: number;
    };
}

const StatsEmpruntsPeriode: React.FC = () => {
    const [dateDebut, setDateDebut] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
    const [dateFin, setDateFin] = useState<Dayjs | null>(dayjs());
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const [graphData, setGraphData] = useState<any>(null);
    const chartRef = useRef<ChartJS>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showResults, setShowResults] = useState<boolean>(false);

    useEffect(() => {
        fetchStats(
            dateDebut!.format('YYYY-MM-DD'), 
            dateFin!.format('YYYY-MM-DD')
        );
    }, []);

    const fetchStats = async (dateDebut: string, dateFin: string) => {
        setLoading(true);
        setError(null);
        try {
            const [statsResponse, empruntsResponse] = await Promise.all([
                axios.get<Stats>(`http://localhost:8080/stats/date?dateDebut=${dateDebut}&dateFin=${dateFin}`),
                axios.get(`http://localhost:8080/emprunt/getAll`)
            ]);
    
            setStats(statsResponse.data);
            setShowResults(true);
    
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
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        borderWidth: 2,
                        pointBackgroundColor: theme.palette.secondary.main,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: theme.palette.secondary.main,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.3,
                        fill: true
                    },
                ],
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    if (err.response.status === 400) {
                        setError('Veuillez entrer des dates valides.');
                    } else if (err.response.status >= 500) {
                        setError('Erreur interne du serveur');
                    }
                } else if (err.request) {
                    setError('Impossible de contacter le serveur, veuillez vérifier votre réseau');
                }
            } else {
                setError('Erreur interne, veuillez réessayer plus tard');
            }
            setStats(null);
            setShowResults(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (dateDebut && dateFin) {
            fetchStats(dateDebut.format('YYYY-MM-DD'), dateFin.format('YYYY-MM-DD'));
        }
    };

    const handleReset = () => {
        // Réinitialiser aux 30 derniers jours
        const newDateDebut = dayjs().subtract(30, 'day');
        const newDateFin = dayjs();
        setDateDebut(newDateDebut);
        setDateFin(newDateFin);
        fetchStats(newDateDebut.format('YYYY-MM-DD'), newDateFin.format('YYYY-MM-DD'));
    };

    const handleDownload = () => {
        const chart = chartRef.current;
        
        if (chart && chart.canvas) {
            try {
                const canvas = chart.canvas;
                chart.update();
                const link = document.createElement('a');
                link.download = `graphique-emprunts-${dateDebut?.format('YYYY-MM-DD')}-${dateFin?.format('YYYY-MM-DD')}.png`;
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

    const handleDownloadCSV = () => {
        if (!graphData) return;
        
        const headers = ['Date', 'Nombre d\'emprunts'];
        const csvData = graphData.labels.map((date: any, index: number) => 
            [date, graphData.datasets[0].data[index]]
        );
        
        const csvContent = [
            headers.join(';'),
            ...csvData.map((row: any[]) => row.join(';'))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `statistiques-emprunts-${dateDebut?.format('YYYY-MM-DD')}-${dateFin?.format('YYYY-MM-DD')}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const formatDate = (date: Dayjs | null) => {
        if (!date) return '';
        return date.format('DD MMMM YYYY');
    };

    const ContainerSize = [
        { type: 'S', color: theme.palette.info.main, icon: <SquareFootIcon sx={{ fontSize: '1rem' }} /> },
        { type: 'M', color: theme.palette.warning.main, icon: <SquareFootIcon sx={{ fontSize: '1.25rem' }} /> },
        { type: 'XL', color: theme.palette.error.main, icon: <SquareFootIcon sx={{ fontSize: '1.5rem' }} /> }
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <Box 
                sx={{ 
                    minHeight: '100vh',
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    py: 4
                }}
            >
                <Container>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? 2 : 0
                        }}>
                            <Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        color: theme.palette.primary.main, 
                                        fontWeight: 'bold',
                                        mb: 1 
                                    }}
                                >
                                    Statistiques par Période
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Analysez les emprunts sur une période spécifique
                                </Typography>
                            </Box>
                            <Tooltip title="Réinitialiser aux 30 derniers jours">
                                <IconButton 
                                    onClick={handleReset} 
                                    color="primary"
                                    sx={{ border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>

                    <Card 
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 3, 
                                color: theme.palette.text.secondary,
                                fontWeight: 'medium',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <DateRangeIcon sx={{ mr: 1 }} /> 
                            Sélectionnez une période
                        </Typography>
                        
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={5}>
                                    <DatePicker
                                        label="Date de début"
                                        value={dateDebut}
                                        format="DD/MM/YYYY"
                                        maxDate={dayjs()}
                                        onChange={(newValue) => setDateDebut(newValue)}
                                        slotProps={{ 
                                            textField: { 
                                                fullWidth: true,
                                                variant: 'outlined',
                                                InputProps: {
                                                    startAdornment: (
                                                        <CalendarTodayIcon 
                                                            sx={{ 
                                                                mr: 1, 
                                                                color: theme.palette.text.secondary 
                                                            }} 
                                                        />
                                                    )
                                                }
                                            } 
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} md={5}>
                                    <DatePicker
                                        label="Date de fin"
                                        value={dateFin}
                                        format="DD/MM/YYYY"
                                        maxDate={dayjs()}
                                        onChange={(newValue) => setDateFin(newValue)}
                                        slotProps={{ 
                                            textField: { 
                                                fullWidth: true,
                                                variant: 'outlined',
                                                InputProps: {
                                                    startAdornment: (
                                                        <CalendarTodayIcon 
                                                            sx={{ 
                                                                mr: 1, 
                                                                color: theme.palette.text.secondary 
                                                            }} 
                                                        />
                                                    )
                                                }
                                            } 
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} md={2}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        disabled={loading || !dateDebut || !dateFin}
                                        fullWidth
                                        sx={{
                                            height: '56px',
                                            borderRadius: '8px',
                                            boxShadow: 2
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Analyser'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

                        {error && (
                            <Box sx={{ 
                                mt: 3, 
                                p: 2, 
                                bgcolor: alpha(theme.palette.error.main, 0.05),
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.error.light}`
                            }}>
                                <Typography color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ mr: 1 }}>⚠️</Box> 
                                    {error}
                                </Typography>
                            </Box>
                        )}
                    </Card>

                    {showResults && (
                        <>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 4,
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: isMobile ? 'column' : 'row',
                                    justifyContent: 'space-between', 
                                    alignItems: isMobile ? 'flex-start' : 'center',
                                }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        mb: isMobile ? 2 : 0
                                    }}>
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                color: theme.palette.secondary.main,
                                                borderRadius: '50%',
                                                p: 1.5,
                                                mr: 2,
                                                boxShadow: `0 0 0 4px ${alpha(theme.palette.secondary.main, 0.05)}`
                                            }}
                                        >
                                            <DateRangeIcon fontSize="large" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" fontWeight="bold">
                                                Période analysée
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Du {dateDebut?.locale('fr').format('DD MMMM YYYY')} au {dateFin?.locale('fr').format('DD MMMM YYYY')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1 
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 4,
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                        }}>
                                            <SwapHorizIcon 
                                                fontSize="small" 
                                                sx={{ 
                                                    color: theme.palette.success.main,
                                                    mr: 0.5
                                                }} 
                                            />
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: theme.palette.success.main,
                                                    fontWeight: 'medium'
                                                }}
                                            >
                                                {stats?.nombreEmpruntTotal || 0} emprunts au total
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>

                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {ContainerSize.map((size) => (
                                    <Grid key={size.type} xs={12} sm={4}>
                                        <Card 
                                            elevation={0}
                                            sx={{
                                                height: '100%',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                position: 'relative',
                                                transition: 'trans 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                                }
                                            }}
                                        >
                                            <Box 
                                                sx={{ 
                                                    height: 8, 
                                                    bgcolor: size.color,
                                                    width: '100%'
                                                }}
                                            />
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Box 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            bgcolor: alpha(size.color, 0.1),
                                                            color: size.color,
                                                            borderRadius: '50%',
                                                            p: 1.5,
                                                            mr: 2
                                                        }}
                                                    >
                                                        <InventoryIcon fontSize="large" />
                                                    </Box>
                                                    <Typography variant="h4" fontWeight="bold" sx={{ color: size.color }}>
                                                        {stats?.nombreEmpruntParType[size.type as keyof typeof stats.nombreEmpruntParType] || 0}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {size.icon}
                                                    <Typography variant="subtitle1" sx={{ ml: 1, color: theme.palette.text.secondary }}>
                                                        Emprunts de taille {size.type}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {graphData && (
                                <Card 
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        mb: 3,
                                        flexDirection: isMobile ? 'column' : 'row',
                                        gap: isMobile ? 2 : 0
                                    }}>
                                        <Typography variant="h6" fontWeight="medium">
                                            Évolution journalière des emprunts
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<FileDownloadIcon />}
                                                onClick={handleDownloadCSV}
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                CSV
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<DownloadIcon />}
                                                onClick={handleDownload}
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                Image
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 3 }} />
                                    
                                    <Box sx={{ 
                                        height: 400, 
                                        position: 'relative',
                                        '& canvas': {
                                            maxWidth: '100%'
                                        }
                                    }}>
                                        <Line
                                            ref={chartRef}
                                            data={graphData}
                                            redraw={false}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: "top",
                                                        align: "end",
                                                        labels: {
                                                            color: theme.palette.text.primary,
                                                            usePointStyle: true,
                                                            padding: 20,
                                                            font: {
                                                                size: 12,
                                                                weight: 'bold'
                                                            }
                                                        }
                                                    },
                                                    tooltip: {
                                                        backgroundColor: 'white',
                                                        titleColor: theme.palette.text.primary,
                                                        bodyColor: theme.palette.text.secondary,
                                                        bodyFont: {
                                                            size: 13
                                                        },
                                                        titleFont: {
                                                            size: 14,
                                                            weight: 'bold'
                                                        },
                                                        padding: 12,
                                                        boxPadding: 4,
                                                        usePointStyle: true,
                                                        borderWidth: 1,
                                                        borderColor: theme.palette.divider,
                                                        // Ajoutez ces callbacks
                                                        callbacks: {
                                                            title: function(context) {
                                                                if (!context.length) return 'Date inconnue';
                                                                
                                                                const rawDate = context[0].parsed.x;
                                                                
                                                                if (rawDate) {
                                                                    const date = new Date(rawDate);
                                                                    return date.toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    });
                                                                }
                                                                return 'Date non disponible';
                                                            },
                                                            label: function(context) {
                                                                return `Nombre d'emprunts: ${context.parsed.y}`;
                                                            }
                                                        }
                                                    }
                                                },
                                                scales: {
                                                    x: {
                                                        type: 'time',
                                                        time: {
                                                            unit: 'day',
                                                            displayFormats: {
                                                                day: 'dd MMM yyyy',
                                                            },
                                                            adapters: {
                                                                date: {
                                                                    locale: fr
                                                                }
                                                            }
                                                        },
                                                        grid: {
                                                            display: false
                                                        },
                                                        border: {
                                                            color: theme.palette.divider
                                                        },
                                                        ticks: {
                                                            color: theme.palette.text.secondary
                                                        }
                                                    },
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            color: theme.palette.text.secondary,
                                                            callback: function(value) {
                                                                return Number.isInteger(value) ? value : null;
                                                            },
                                                        },
                                                        grid: {
                                                            color: theme.palette.divider,
                                                            drawBorder: false
                                                        },
                                                        border: {
                                                            display: false
                                                        }
                                                    },
                                                },
                                                animation: {
                                                    duration: 1000,
                                                    easing: 'easeOutQuart'
                                                },
                                                elements: {
                                                    line: {
                                                        tension: 0.4
                                                    }
                                                },
                                                interaction: {
                                                    mode: 'index',
                                                    intersect: false
                                                },
                                                hover: {
                                                    mode: 'index',
                                                    intersect: false
                                                }
                                            }}
                                        />
                                    </Box>
                                </Card>
                            )}
                        </>
                    )}
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default StatsEmpruntsPeriode;