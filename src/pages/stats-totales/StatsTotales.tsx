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
    MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const cardStyle = { backgroundColor: theme.palette.secondary.main };

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
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="error">{error}</Typography>
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
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
                >
                    Stats Totales
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportClick}
                >
                    Exporter
                </Button>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
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
            <Grid container spacing={3}>
                {statsData.map((stat, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                        <Card sx={cardStyle}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{stat.label}</Typography>
                                <Typography variant="body1">{stat.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                <Grid xs={12} sm={6} md={4}>
                    <Card sx={cardStyle}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Nombre Emprunt Par Contenant</Typography>
                            <Typography variant="body1">S: {stats.nombreEmpruntParContenant?.S || 0}</Typography>
                            <Typography variant="body1">XL: {stats.nombreEmpruntParContenant?.XL || 0}</Typography>
                            <Typography variant="body1">M: {stats.nombreEmpruntParContenant?.M || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <Card sx={cardStyle}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Stock Contenant Par Type</Typography>
                            <Typography variant="body1">S: {stats.stockContenantParType?.S || 0}</Typography>
                            <Typography variant="body1">XL: {stats.stockContenantParType?.XL || 0}</Typography>
                            <Typography variant="body1">M: {stats.stockContenantParType?.M || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StatsTotales;