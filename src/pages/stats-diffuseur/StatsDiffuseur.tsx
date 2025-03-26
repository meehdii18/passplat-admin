import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, TextField, Button, Typography, Card, CardContent, Paper, Autocomplete,
    Box, CircularProgress, Divider, Fade, useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

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

interface Diffuseur {
    id: number;
    nom: string;
}

const StatsDiffuseur: React.FC = () => {
    const [id, setId] = useState<string>('');
    const [stats, setStats] = useState<StatsDiffuseur | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const [diffuseurs, setDiffuseurs] = useState<Diffuseur[]>([]);
    const [selectedDiffuseur, setSelectedDiffuseur] = useState<Diffuseur | null>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchDiffuseurs();
    }, []);

    const fetchStats = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<StatsDiffuseur>(`http://localhost:8080/stats/${id}`);
            setStats(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    if (err.response.status === 404) {
                        setError('Diffuseur introuvable');
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
        } finally {
            setLoading(false);
        }
    };
    
    const fetchDiffuseurs = async () => {
        setSearchLoading(true);
        try {
            const response = await axios.get<Diffuseur[]>('http://localhost:8080/diffuseur/getAll');
            setDiffuseurs(response.data);
        } catch (err) {
            console.error('Erreur lors du chargement des diffuseurs:', err);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedDiffuseur) {
            fetchStats(selectedDiffuseur.id.toString());
        }
    };

    const handleReset = () => {
        setSelectedDiffuseur(null);
        setStats(null);
        setError(null);
    };

    const getIconForStat = (index: number) => {
        const icons = [
            <LocalShippingIcon fontSize="large" />,
            <PendingIcon fontSize="large" />,
            <InventoryIcon fontSize="large" />
        ];
        return icons[index];
    };

    const ContainerSize = [
        { type: 'S', color: theme.palette.info.main, icon: <SquareFootIcon sx={{ fontSize: '1rem' }} /> },
        { type: 'M', color: theme.palette.warning.main, icon: <SquareFootIcon sx={{ fontSize: '1.25rem' }} /> },
        { type: 'XL', color: theme.palette.error.main, icon: <SquareFootIcon sx={{ fontSize: '1.5rem' }} /> }
    ];

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
                                Statistiques par Diffuseur
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Consultez les données spécifiques à chaque diffuseur
                            </Typography>
                        </Box>
                        {stats && (
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleReset}
                                sx={{
                                    borderRadius: '24px',
                                    px: 3
                                }}
                            >
                                Nouvelle recherche
                            </Button>
                        )}
                    </Box>
                </Paper>

                <Fade in={!stats} component="div" style={{ display: stats ? 'none' : 'block' }}>
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
                            <StorefrontIcon sx={{ mr: 1 }} /> 
                            Sélectionnez un diffuseur
                        </Typography>
                        
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ 
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'stretch' : 'center',
                                gap: 2
                            }}>
                                <Autocomplete
                                    value={selectedDiffuseur}
                                    onChange={(event: any, newValue: Diffuseur | null) => {
                                        setSelectedDiffuseur(newValue);
                                    }}
                                    options={diffuseurs}
                                    getOptionLabel={(option) => option.nom}
                                    loading={searchLoading}
                                    sx={{ flex: 1 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nom du diffuseur"
                                            fullWidth
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {searchLoading ? <CircularProgress size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                />
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    disabled={loading || !selectedDiffuseur}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                    sx={{
                                        borderRadius: isMobile ? 1 : '24px',
                                        px: 4,
                                        py: isMobile ? 1.5 : 1.25,
                                        minWidth: isMobile ? '100%' : '180px',
                                        boxShadow: 2
                                    }}
                                >
                                    {loading ? 'Chargement...' : 'Rechercher'}
                                </Button>
                            </Box>
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
                </Fade>

                {stats && (
                    <Fade in={!!stats} component="div" style={{ marginTop: 0 }}>
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 4,
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    mt: 0 // Assurer qu'il n'y a pas de marge en haut
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
                                            <StorefrontIcon fontSize="large" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" fontWeight="bold">
                                                {stats.nomDiffuseur}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Profil Diffuseur
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
                                                {(stats.nombreEmpruntEnCours / stats.nombreEmpruntTotal * 100 || 0).toFixed(1)}% d'emprunts actifs
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>

                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 3, 
                                    ml: 1, 
                                    color: theme.palette.text.secondary,
                                    fontWeight: 'medium'
                                }}
                            >
                                Statistiques Principales
                            </Typography>
                            
                            <Grid container spacing={3} sx={{ mb: 4, justifyContent:'space-between', alignItems:'center' }}>
                                {[
                                    { label: "Nombre d'Emprunts Total", value: stats.nombreEmpruntTotal },
                                    { label: "Nombre d'Emprunts En Cours", value: stats.nombreEmpruntEnCours },
                                    { label: "Stock Contenants Total", value: stats.stockContenantTotal }
                                ].map((stat, index) => (
                                    <Grid key={index} xs={12} sm={6} md={6}>
                                        <Card 
                                            elevation={0}
                                            sx={{
                                                height: '100%',
                                                width:'100%',
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
                                    mb: 3, 
                                    ml: 1, 
                                    color: theme.palette.text.secondary,
                                    fontWeight: 'medium'
                                }}
                            >
                                Détails par Type de Contenant
                            </Typography>
                            
                            <Grid container spacing={3}
                            sx={{justifyContent:'space-between', alignItems:'center'}}>
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
                                                <LocalShippingIcon 
                                                    sx={{ 
                                                        fontSize: 28, 
                                                        color: theme.palette.secondary.main,
                                                        mr: 1.5
                                                    }}
                                                />
                                                <Typography variant="h6" fontWeight="bold">
                                                    Nombre d'Emprunts Par Type
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ mb: 3 }} />
                                            <Grid container spacing={2}
                                                sx={{justifyContent:'space-between', alignItems:'center'}}>
                                                {ContainerSize.map((size) => (
                                                    <Grid key={size.type} xs={4}>
                                                        <Paper
                                                            elevation={0}
                                                            sx={{ 
                                                                p: 2, 
                                                                textAlign: 'center',
                                                                bgcolor: alpha(size.color, 0.05),
                                                                borderRadius: 2,
                                                                border: `1px solid ${alpha(size.color, 0.2)}`,
                                                            }}
                                                        >
                                                            <Typography variant="h5" fontWeight="bold" sx={{ color: size.color }}>
                                                                {stats.nombreEmpruntParType[size.type as keyof typeof stats.nombreEmpruntParType] || 0}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {size.icon}
                                                                <Typography variant="body2" color="text.secondary" fontWeight="medium" sx={{ ml: 0.5 }}>
                                                                    {size.type}
                                                                </Typography>
                                                            </Box>
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
                                                <InventoryIcon 
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
                                            <Divider sx={{ mb: 3 }} />
                                            <Grid container spacing={2}
                                            sx={{justifyContent:'space-between', alignItems:'center'}}>
                                                {ContainerSize.map((size) => (
                                                    <Grid key={size.type} xs={4}>
                                                        <Paper
                                                            elevation={0}
                                                            sx={{ 
                                                                p: 2, 
                                                                textAlign: 'center',
                                                                bgcolor: alpha(size.color, 0.05),
                                                                borderRadius: 2,
                                                                border: `1px solid ${alpha(size.color, 0.2)}`,
                                                            }}
                                                        >
                                                            <Typography variant="h5" fontWeight="bold" sx={{ color: size.color }}>
                                                                {stats.stockContenantParType[size.type as keyof typeof stats.stockContenantParType] || 0}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {size.icon}
                                                                <Typography variant="body2" color="text.secondary" fontWeight="medium" sx={{ ml: 0.5 }}>
                                                                    {size.type}
                                                                </Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export default StatsDiffuseur;