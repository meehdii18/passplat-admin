import { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Box,
    Paper,
    IconButton,
    Tooltip,
    useMediaQuery,
    Button
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme, alpha } from "@mui/material/styles";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

interface TopEmprunteur {
    id: number;
    nom: string;
    prenom: string;
    totalEmprunte: number;
}

interface TopDiffuseur {
    id: number;
    nom: string;
    totalBoitesEmpruntees: number;
}

interface TopContenant {
    id: number;
    type: string;
    totalQuantite: number;
}

const Populaire = () => {
    const [topEmprunteurs, setTopEmprunteurs] = useState<TopEmprunteur[]>([]);
    const [topDiffuseurs, setTopDiffuseurs] = useState<TopDiffuseur[]>([]);
    const [topContenants, setTopContenants] = useState<TopContenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [emprunteursRes, diffuseursRes, contenantsRes] = await Promise.all([
                axios.get('http://localhost:8080/stats/topEmprunteur'),
                axios.get('http://localhost:8080/stats/topDiffuseur'),
                axios.get('http://localhost:8080/stats/topContenant')
            ]);

            setTopEmprunteurs(emprunteursRes.data);
            setTopDiffuseurs(diffuseursRes.data);
            setTopContenants(contenantsRes.data);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getMedalIcon = (index: number) => {
        switch(index) {
            case 0:
                return <MilitaryTechIcon sx={{ color: '#FFD700' }} />;  // Or
            case 1:
                return <MilitaryTechIcon sx={{ color: '#C0C0C0' }} />;  // Argent
            case 2:
                return <MilitaryTechIcon sx={{ color: '#CD7F32' }} />;  // Bronze
            default:
                return null;
        }
    };

    const getNumberIcon = (index: number) => {
        switch(index) {
            case 0:
                return <LooksOneIcon />;
            case 1:
                return <LooksTwoIcon />;
            case 2:
                return <Looks3Icon />;
            default:
                return `${index + 1}`;
        }
    };

    const getEmprunteurBgColor = (index: number) => {
        switch(index) {
            case 0:
                return alpha('#FFD700', 0.1); // Or
            case 1:
                return alpha('#C0C0C0', 0.1); // Argent
            case 2:
                return alpha('#CD7F32', 0.1); // Bronze
            default:
                return 'transparent';
        }
    };

    const getDiffuseurBgColor = (index: number) => {
        switch(index) {
            case 0:
                return alpha('#FFD700', 0.1);
            case 1:
                return alpha('#C0C0C0', 0.1);
            case 2:
                return alpha('#CD7F32', 0.1);
            default:
                return 'transparent';
        }
    };

    const getContenantBgColor = (index: number) => {
        switch(index) {
            case 0:
                return alpha('#FFD700', 0.1);
            case 1:
                return alpha('#C0C0C0', 0.1);
            case 2:
                return alpha('#CD7F32', 0.1);
            default:
                return 'transparent';
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
                    minHeight: '100vh',
                    bgcolor: alpha(theme.palette.primary.main, 0.03)
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2 }}>Chargement des classements...</Typography>
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
                    onClick={fetchData}
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmojiEventsIcon 
                                sx={{ 
                                    fontSize: 32, 
                                    color: theme.palette.warning.main,
                                    mr: 2
                                }} 
                            />
                            <Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        color: theme.palette.primary.main, 
                                        fontWeight: 'bold',
                                        mb: 0.5 
                                    }}
                                >
                                    Top Classements
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Les meilleurs utilisateurs et contenants de la plateforme
                                </Typography>
                            </Box>
                        </Box>
                        <Tooltip title="Actualiser les données">
                            <IconButton 
                                onClick={fetchData} 
                                color="primary"
                                sx={{ border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>

                <Grid container spacing={5}>
                    {/* TOP EMPRUNTEURS */}
                    <Grid xs={12} md={4}>
                        <Card 
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    backgroundColor: alpha(theme.palette.warning.main, 0.05)
                                }}
                            >
                                <PersonIcon 
                                    sx={{ 
                                        fontSize: 28, 
                                        color: theme.palette.warning.main,
                                        mr: 1.5
                                    }}
                                />
                                <Typography variant="h6" fontWeight="bold">
                                    Top Emprunteurs
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 0 }}>
                                {topEmprunteurs.length === 0 ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            Aucun emprunteur pour le moment
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        {topEmprunteurs.map((emprunteur, index) => (
                                            <Box 
                                                key={emprunteur.id} 
                                                sx={{ 
                                                    p: 2,
                                                    backgroundColor: getEmprunteurBgColor(index),
                                                    borderBottom: index !== topEmprunteurs.length - 1 ? 
                                                        `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.action.hover, 0.1)
                                                    }
                                                }}
                                            >
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center' 
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box 
                                                            sx={{ 
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                width: 36,
                                                                height: 36,
                                                                bgcolor: index < 3 ? 'transparent' : alpha(theme.palette.primary.main, 0.1),
                                                                borderRadius: '50%',
                                                                mr: 2,
                                                                color: theme.palette.primary.main,
                                                            }}
                                                        >
                                                            {index < 3 ? getMedalIcon(index) : getNumberIcon(index)}
                                                        </Box>
                                                        <Box>
                                                            <Typography 
                                                                variant="body1" 
                                                                fontWeight={index < 3 ? 'bold' : 'medium'}
                                                            >
                                                                {emprunteur.prenom} {emprunteur.nom}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box 
                                                        sx={{ 
                                                            px: 1.5,
                                                            py: 0.5,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            borderRadius: 5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography 
                                                            variant="body2" 
                                                            fontWeight="bold"
                                                            color="success.main"
                                                        >
                                                            {emprunteur.totalEmprunte} emprunt{emprunteur.totalEmprunte > 1 ? 's' : ''}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* TOP DIFFUSEURS */}
                    <Grid xs={12} md={4}>
                        <Card 
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    backgroundColor: alpha(theme.palette.info.main, 0.05)
                                }}
                            >
                                <StorefrontIcon 
                                    sx={{ 
                                        fontSize: 28, 
                                        color: theme.palette.info.main,
                                        mr: 1.5
                                    }}
                                />
                                <Typography variant="h6" fontWeight="bold">
                                    Top Diffuseurs
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 0 }}>
                                {topDiffuseurs.length === 0 ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            Aucun diffuseur pour le moment
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        {topDiffuseurs.map((diffuseur, index) => (
                                            <Box 
                                                key={diffuseur.id} 
                                                sx={{ 
                                                    p: 2,
                                                    backgroundColor: getDiffuseurBgColor(index),
                                                    borderBottom: index !== topDiffuseurs.length - 1 ? 
                                                        `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.action.hover, 0.1)
                                                    }
                                                }}
                                            >
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center' 
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box 
                                                            sx={{ 
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                width: 36,
                                                                height: 36,
                                                                bgcolor: index < 3 ? 'transparent' : alpha(theme.palette.info.main, 0.1),
                                                                borderRadius: '50%',
                                                                mr: 2,
                                                                color: theme.palette.info.main,
                                                            }}
                                                        >
                                                            {index < 3 ? getMedalIcon(index) : getNumberIcon(index)}
                                                        </Box>
                                                        <Box>
                                                            <Typography 
                                                                variant="body1" 
                                                                fontWeight={index < 3 ? 'bold' : 'medium'}
                                                            >
                                                                {diffuseur.nom}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box 
                                                        sx={{ 
                                                            px: 1.5,
                                                            py: 0.5,
                                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                                            borderRadius: 5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography 
                                                            variant="body2" 
                                                            fontWeight="bold"
                                                            color="info.main"
                                                        >
                                                            {diffuseur.totalBoitesEmpruntees} diffusion{diffuseur.totalBoitesEmpruntees > 1 ? 's' : ''}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* TOP CONTENANTS */}
                    <Grid xs={12} md={4}>
                        <Card 
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                width: '130%',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    backgroundColor: alpha(theme.palette.success.main, 0.05)
                                }}
                            >
                                <InventoryIcon 
                                    sx={{ 
                                        fontSize: 28, 
                                        color: theme.palette.success.main,
                                        mr: 1.5
                                    }}
                                />
                                <Typography variant="h6" fontWeight="bold">
                                    Top Contenants
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 0 }}>
                                {topContenants.length === 0 ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            Aucun contenant pour le moment
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        {topContenants.map((contenant, index) => (
                                            <Box 
                                                key={contenant.id} 
                                                sx={{ 
                                                    p: 2,
                                                    backgroundColor: getContenantBgColor(index),
                                                    borderBottom: index !== topContenants.length - 1 ? 
                                                        `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.action.hover, 0.1)
                                                    }
                                                }}
                                            >
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center' 
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box 
                                                            sx={{ 
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                width: 36,
                                                                height: 36,
                                                                bgcolor: index < 3 ? 'transparent' : alpha(theme.palette.success.main, 0.1),
                                                                borderRadius: '50%',
                                                                mr: 2,
                                                                color: theme.palette.success.main,
                                                            }}
                                                        >
                                                            {index < 3 ? getMedalIcon(index) : getNumberIcon(index)}
                                                        </Box>
                                                        <Box>
                                                            <Typography 
                                                                variant="body1" 
                                                                fontWeight={index < 3 ? 'bold' : 'medium'}
                                                            >
                                                                Taille {contenant.type}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box 
                                                        sx={{ 
                                                            px: 1.5,
                                                            py: 0.5,
                                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                                            borderRadius: 5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography 
                                                            variant="body2" 
                                                            fontWeight="bold"
                                                            color="success.main"
                                                        >
                                                            {contenant.totalQuantite} emprunt{contenant.totalQuantite > 1 ? 's' : ''}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Populaire;