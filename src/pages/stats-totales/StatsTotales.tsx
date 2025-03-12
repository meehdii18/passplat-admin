import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Container, 
    Card, 
    CardContent, 
    Typography, 
    CircularProgress,
    Button,
    Box,
    Menu,
    MenuItem,
    Paper,
    IconButton,
    Tooltip,
    Divider,
    Fade,
    useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PercentIcon from '@mui/icons-material/Percent';
import NatureIcon from '@mui/icons-material/Nature';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get<Stats>('http://localhost:8080/stats');
                setStats(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        setError(err.response.status >= 500 
                            ? 'Erreur interne, veuillez réessayer plus tard'
                            : 'Serveur inaccessible ou indisponible'
                        );
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

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh',
                    bgcolor: alpha(theme.palette.primary.main, 0.03)
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2 }}>Chargement des statistiques...</Typography>
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
            </Container>
        );
    }

    if (!stats) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Typography>Erreur du chargement des données</Typography>
            </Container>
        );
    }

    const getIconForStat = (index: number) => {
        const icons = [
            <PersonIcon fontSize="large" />,
            <StorefrontIcon fontSize="large" />,
            <LocalShippingIcon fontSize="large" />,
            <SwapHorizIcon fontSize="large" />,
            <InventoryIcon fontSize="large" />,
            <CheckCircleIcon fontSize="large" />,
            <PendingIcon fontSize="large" />,
            <PercentIcon fontSize="large" />,
            <NatureIcon fontSize="large" /> 
        ];
        return icons[index];
    };

    const statsData = [
        { label: "Nombre d'Utilisateurs", value: stats.nombreUtilisateur },
        { label: "Nombre de Diffuseurs", value: stats.nombreDiffuseur },
        { label: "Nombre de Collecteurs", value: stats.nombreCollecteur },
        { label: "Nombre de Diffuseurs Collecteurs", value: stats.nombreDiffuseurCollecteur },
        { label: "Nombre d'Emprunts Total", value: stats.nombreEmpruntTotal },
        { label: "Nombre d'Emprunts Rendus", value: stats.nombreEmpruntRendu },
        { label: "Nombre d'Emprunts En Cours", value: stats.nombreEmpruntEnCours },
        { 
            label: "Ratio Emprunts Rendus/Total", 
            value: stats.nombreEmpruntTotal > 0 
                ? `${(stats.nombreEmpruntRendu / stats.nombreEmpruntTotal * 100).toFixed(2)}%` 
                : 'N/A' 
        },
        { label: "Émission carbone évitée au total", value: "TBD" }
    ];

    const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const exportToCSV = () => {
        const headers = ['Métrique', 'Valeur'];
        const rows = statsData.map(stat => [stat.label, stat.value]);
        
        rows.push(['Nombre Emprunt Contenant S', stats.nombreEmpruntParContenant?.S || 0]);
        rows.push(['Nombre Emprunt Contenant M', stats.nombreEmpruntParContenant?.M || 0]);
        rows.push(['Nombre Emprunt Contenant XL', stats.nombreEmpruntParContenant?.XL || 0]);
        rows.push(['Stock Contenant S', stats.stockContenantParType?.S || 0]);
        rows.push(['Stock Contenant M', stats.stockContenantParType?.M || 0]);
        rows.push(['Stock Contenant XL', stats.stockContenantParType?.XL || 0]);
    
        const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n');
        downloadFile(csvContent, 'statistiques.csv', 'text/csv');
    };

    const exportToXLS = () => {
        const xlsContent = statsData.map(stat => `${stat.label}\t${stat.value}`).join('\n');
        downloadFile(xlsContent, 'statistiques.xls', 'application/vnd.ms-excel');
    };
    
    const exportToTXT = () => {
        const txtContent = statsData.map(stat => `${stat.label}: ${stat.value}`).join('\n');
        downloadFile(txtContent, 'statistiques.txt', 'text/plain');
    };

    const downloadFile = (content: string, fileName: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        handleClose();
    };

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
                                Statistiques Globales
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Vue d'ensemble des données du système
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportClick}
                            sx={{
                                borderRadius: '24px',
                                px: 3,
                                boxShadow: 2
                            }}
                        >
                            Exporter
                        </Button>
                    </Box>
                </Paper>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                    elevation={3}
                >
                    <MenuItem onClick={exportToCSV}>
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Format CSV
                    </MenuItem>
                    <MenuItem onClick={exportToXLS}>
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Format XLS
                    </MenuItem>
                    <MenuItem onClick={exportToTXT}>
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Format TXT
                    </MenuItem>
                </Menu>
                
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 3, 
                        ml: 1, 
                        color: theme.palette.text.secondary,
                        fontWeight: 'medium'
                    }}
                >
                    Statistiques Générales
                </Typography>
                
                <Grid container spacing={3}>
                    {statsData.map((stat, index) => (
                        <Grid key={index} xs={12} sm={6} md={4}>
                            <Card 
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
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
                                        bgcolor: theme.palette.primary.main,
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
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                borderRadius: '50%',
                                                p: 1.5,
                                                mr: 2
                                            }}
                                        >
                                            {getIconForStat(index)}
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mt: 6, 
                        mb: 3, 
                        ml: 1, 
                        color: theme.palette.text.secondary,
                        fontWeight: 'medium'
                    }}
                >
                    Détails par Type de Contenant
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <InventoryIcon 
                                        sx={{ 
                                            fontSize: 28, 
                                            color: theme.palette.secondary.main,
                                            mr: 1.5
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight="bold">
                                        Nombre d'Emprunts Par Contenant
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    {['S', 'M', 'XL'].map((size) => (
                                        <Grid key={size} xs={4}>
                                            <Paper
                                                elevation={0}
                                                sx={{ 
                                                    p: 2, 
                                                    textAlign: 'center',
                                                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                                    borderRadius: 2
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="bold" color="secondary">
                                                    {stats.nombreEmpruntParContenant[size as keyof typeof stats.nombreEmpruntParContenant] || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                    {size}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid xs={12} md={6}>
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
                                    bgcolor: theme.palette.success.main,
                                    width: '100%'
                                }}
                            />
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <StorefrontIcon 
                                        sx={{ 
                                            fontSize: 28, 
                                            color: theme.palette.success.main,
                                            mr: 1.5
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight="bold">
                                        Stock de Contenants Par Type
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    {['S', 'M', 'XL'].map((size) => (
                                        <Grid key={size} xs={4}>
                                            <Paper
                                                elevation={0}
                                                sx={{ 
                                                    p: 2, 
                                                    textAlign: 'center',
                                                    bgcolor: alpha(theme.palette.success.main, 0.05),
                                                    borderRadius: 2
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="bold" color="success.dark">
                                                    {stats.stockContenantParType[size as keyof typeof stats.stockContenantParType] || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                    {size}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default StatsTotales;