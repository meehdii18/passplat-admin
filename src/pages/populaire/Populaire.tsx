import { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
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

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 'bold',
                    mb: 4
                }}
            >
                Statistiques Populaires
            </Typography>

            <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ 
                            height: '100%', 
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: 3,
                            '&:hover': {
                                boxShadow: 6
                            }
                        }}>
                            <CardContent>
                                <Typography 
                                    variant="h6" 
                                    gutterBottom 
                                    sx={{ 
                                        color: theme.palette.secondary.main,
                                        borderBottom: `2px solid ${theme.palette.secondary.main}`,
                                        pb: 1,
                                        mb: 3
                                    }}
                                >
                                    Top Emprunteurs
                                </Typography>
                                {topEmprunteurs.map((emprunteur, index) => (
                                    <Box 
                                        key={emprunteur.id} 
                                        sx={{ 
                                            mb: 2,
                                            p: 1.5,
                                            backgroundColor: index === 0 ? theme.palette.secondary.light : 'transparent',
                                            borderRadius: 1,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: index === 0 ? 'bold' : 'regular',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box 
                                                component="span" 
                                                sx={{ 
                                                    mr: 1,
                                                    backgroundColor: theme.palette.secondary.main,
                                                    color: 'white',
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                            {emprunteur.prenom} {emprunteur.nom}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: theme.palette.text.secondary,
                                                pl: 4
                                            }}
                                        >
                                            {emprunteur.totalEmprunte} emprunt{emprunteur.totalEmprunte > 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                {/* Top Diffuseurs */}
                    <Grid item xs={12} md={4}>
                            <Card sx={{ 
                                height: '100%', 
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6
                                }
                            }}>
                                <CardContent>
                                    <Typography 
                                        variant="h6" 
                                        gutterBottom 
                                        sx={{ 
                                            color: theme.palette.secondary.main,
                                            borderBottom: `2px solid ${theme.palette.secondary.main}`,
                                            pb: 1,
                                            mb: 3
                                        }}
                                    >
                                        Top Diffuseurs
                                    </Typography>
                                    {topDiffuseurs.map((diffuseur, index) => (
                                        <Box 
                                            key={diffuseur.id} 
                                            sx={{ 
                                                mb: 2,
                                                p: 1.5,
                                                backgroundColor: index === 0 ? theme.palette.secondary.light : 'transparent',
                                                borderRadius: 1
                                            }}
                                        >
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    fontWeight: index === 0 ? 'bold' : 'regular',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Box 
                                                    component="span" 
                                                    sx={{ 
                                                        mr: 1,
                                                        backgroundColor: theme.palette.secondary.main,
                                                        color: 'white',
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                                {diffuseur.nom}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: theme.palette.text.secondary,
                                                    pl: 4
                                                }}
                                            >
                                                {diffuseur.totalBoitesEmpruntees} diffusion{diffuseur.totalBoitesEmpruntees > 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                    </Grid>

                    {/* Top Contenant */}
                    <Grid item xs={12} md={4}>
                            <Card sx={{ 
                                height: '100%', 
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6
                                }
                            }}>
                                <CardContent>
                                    <Typography 
                                        variant="h6" 
                                        gutterBottom 
                                        sx={{ 
                                            color: theme.palette.secondary.main,
                                            borderBottom: `2px solid ${theme.palette.secondary.main}`,
                                            pb: 1,
                                            mb: 3
                                        }}
                                    >
                                        Top Contenants
                                    </Typography>
                                    {topContenants.map((contenant, index) => (
                                        <Box 
                                            key={contenant.id} 
                                            sx={{ 
                                                mb: 2,
                                                p: 1.5,
                                                backgroundColor: index === 0 ? theme.palette.secondary.light : 'transparent',
                                                borderRadius: 1
                                            }}
                                        >
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    fontWeight: index === 0 ? 'bold' : 'regular',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Box 
                                                    component="span" 
                                                    sx={{ 
                                                        mr: 1,
                                                        backgroundColor: theme.palette.secondary.main,
                                                        color: 'white',
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                                {contenant.type}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: theme.palette.text.secondary,
                                                    pl: 4
                                                }}
                                            >
                                                {contenant.totalQuantite} emprunt{contenant.totalQuantite > 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                    </Grid>
            </Grid>

        </Container>
    );
};

export default Populaire;