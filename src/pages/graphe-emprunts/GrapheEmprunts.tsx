import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { 
    Box,
    CircularProgress, 
    Typography,
    Button,
    Paper,
    Container,
    Divider,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Grid,
    Menu,
    MenuItem,
    useMediaQuery
} from "@mui/material";
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
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import { alpha } from '@mui/material/styles';
import theme from "../../theme.ts";
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

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

const GrapheEmprunts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [totalEmprunts, setTotalEmprunts] = useState(0);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const chartRef = useRef<ChartJS>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchEmprunts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/emprunt/getAll");
            const emprunts = response.data;

            // Transformation des données, on associe un nombre total d'emprunts chaque date
            const empruntsRefactored = emprunts.reduce((acc: { [x: string]: any; }, curr: { dateEmprunt: string | number | Date; quantite: any; }) => {
                const date = new Date(curr.dateEmprunt).toISOString().split("T")[0]; // Format YYYY-MM-DD
                acc[date] = (acc[date] || 0) + curr.quantite;
                return acc;
            }, {});

            const dates = Object.keys(empruntsRefactored).sort(); // Trier les dates
            const nbEmprunts = dates.map((date) => empruntsRefactored[date]); // Tableau de nombres d'emprunts triés par date
            
            // Calculer le total des emprunts
            const total = nbEmprunts.reduce((sum, val) => sum + val, 0);
            setTotalEmprunts(total);
            
            // Déterminer la plage de dates
            if (dates.length > 0) {
                setDateRange({
                    start: dates[0],
                    end: dates[dates.length - 1]
                });
            }

            setData({
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

    useEffect(() => {
        fetchEmprunts();
    }, []);

    const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRefresh = () => {
        fetchEmprunts();
    };

    const handleDownloadPNG = () => {
        const chart = chartRef.current;
        
        if (chart && chart.canvas) {
            try {
                const canvas = chart.canvas;
                chart.update();
                const link = document.createElement('a');
                link.download = `graphique-emprunts-${new Date().toISOString().split('T')[0]}.png`;                
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                link.href = dataUrl;
                link.click();                
            } catch (error) {
                console.error('Erreur lors du téléchargement:', error);
            }
        } else {
            console.error('La référence au graphique est null');
        }
        handleMenuClose();
    };

    const handleDownloadCSV = () => {
        if (!data) return;
        
        const headers = ['Date', 'Nombre d\'emprunts'];
        const csvData = data.labels.map((date: any, index: number) => [date, data.datasets[0].data[index]]);
        
        const csvContent = [
            headers.join(','),
            ...csvData.map((row: any[]) => row.join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `emprunts-donnees-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        
        handleMenuClose();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = dayjs(dateString);
            if (date.isValid()) {
                return date.locale('fr').format('DD MMMM YYYY');
            }
            return 'Date non disponible';
        } catch (error) {
            console.error('Erreur de formatage de date:', error, dateString);
            return 'Date non disponible';
        }
    };

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '70vh',
                    bgcolor: alpha(theme.palette.primary.main, 0.03)
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2 }}>Chargement des données...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container 
                sx={{ 
                    textAlign: 'center', 
                    mt: 4,
                    p: 4, 
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.error.light}`
                }}
            >
                <Typography variant="h5" color="error" gutterBottom>Erreur</Typography>
                <Typography>{error}</Typography>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    sx={{ mt: 3 }}
                >
                    Réessayer
                </Button>
            </Container>
        );
    }

    return (
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
                                Évolution des Emprunts
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Visualisation des tendances d'emprunts au fil du temps
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Actualiser">
                                <IconButton onClick={handleRefresh} color="primary">
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                size="medium"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownloadClick}
                                sx={{
                                    borderRadius: '24px',
                                    px: 2,
                                    boxShadow: 2
                                }}
                            >
                                Exporter
                            </Button>
                        </Box>
                    </Box>
                </Paper>
                
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleDownloadPNG}>
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Image PNG
                    </MenuItem>
                    <MenuItem onClick={handleDownloadCSV}>
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Données CSV
                    </MenuItem>
                </Menu>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card 
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            }}
                        >
                            <Box 
                                sx={{ 
                                    height: 8, 
                                    bgcolor: theme.palette.secondary.main,
                                    width: '100%'
                                }}
                            />
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                            color: theme.palette.secondary.main,
                                            borderRadius: '50%',
                                            p: 1,
                                            mr: 2
                                        }}
                                    >
                                        <TrendingUpIcon fontSize="large" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                                            {totalEmprunts}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total des emprunts
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card 
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            }}
                        >
                            <Box 
                                sx={{ 
                                    height: 8, 
                                    bgcolor: theme.palette.primary.main,
                                    width: '100%'
                                }}
                            />
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            borderRadius: '50%',
                                            p: 1,
                                            mr: 2
                                        }}
                                    >
                                        <DateRangeIcon fontSize="large" />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Période analysée
                                        </Typography>
                                        <Typography variant="body1" color="text.primary" fontWeight="medium">
                                            {dateRange.start && dateRange.end ? (
                                                `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
                                            ) : (
                                                'Aucune donnée'
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

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
                        mb: 3
                    }}>
                        <Typography variant="h6" fontWeight="medium">
                            Évolution journalière des emprunts
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ 
                        height: 400, 
                        position: 'relative',
                        '& canvas': {
                            maxWidth: '100%'
                        }
                    }}>
                        {data && (  
                            <Line
                                ref={chartRef}
                                data={data}
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
                                                    
                                                    // Récupérer la date à partir du point sélectionné
                                                    const rawDate = context[0].parsed.x;
                                                    
                                                    // Formater la date en français
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
                                    scales : {
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
                        )}
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};

export default GrapheEmprunts;