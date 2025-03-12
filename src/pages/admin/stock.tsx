import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Alert,
    Snackbar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Avatar,
    CircularProgress,
    Tooltip,
    Backdrop,
    useMediaQuery,
    Autocomplete
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { useNavigate } from 'react-router-dom';

interface Account {
    id: number;
    tel: string;
    mail: string;
    adresse: string;
    nom: string;
    prenom: string;
    username: string;
    role: number;
    nbProlong: number;
    mdp: string;
    estSupprime: number;
}

interface Diffuseur {
    id: number;
    nom: string;
    account: Account;
}

interface Contenant {
    id: number;
    nom: string;
    type: string;
}

interface Stock {
    id: number;
    diffuseur: Diffuseur;
    contenant: Contenant;
    quantite: number;
    dateAjout: string | null;
    idDiffuseur: number;
    idContenant: number;
}

const AdminStockPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [diffuseurs, setDiffuseurs] = useState<Diffuseur[]>([]);
    const [contenants, setContenants] = useState<Contenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [selectedDiffuseur, setSelectedDiffuseur] = useState<Diffuseur | null>(null);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
        open: false,
        idStock: 0,
        contenantNom: ''
    });
    const [formData, setFormData] = useState({
        idDiffuseur: 0,
        idContenant: 0,
        quantite: 0
    });
    const [snackbar, setSnackbar] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' as 'success' | 'error' 
    });
    
    // Statistiques totales
    const [totalItems, setTotalItems] = useState(0);
    const [stockByType, setStockByType] = useState<{[key: string]: number}>({});

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Calculate statistics when stocks change
        if (stocks.length > 0) {
            const total = stocks.reduce((sum, stock) => sum + stock.quantite, 0);
            setTotalItems(total);
            
            // Group by contenant type
            const byType: {[key: string]: number} = {};
            stocks.forEach(stock => {
                const type = stock.contenant.type || 'Non défini';
                byType[type] = (byType[type] || 0) + stock.quantite;
            });
            setStockByType(byType);
        } else {
            setTotalItems(0);
            setStockByType({});
        }
    }, [stocks]);

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };
    
    const fetchData = async (diffuseurId?: number) => {
        setLoading(true);
        try {
            // Toujours charger la liste des diffuseurs et contenants
            const [diffuseursResponse, contenantsResponse] = await Promise.all([
                axios.get<Diffuseur[]>('http://localhost:8080/diffuseur/getAll'),
                axios.get<Contenant[]>('http://localhost:8080/contenant/getAll')
            ]);
    
            setDiffuseurs(diffuseursResponse.data);
            setContenants(contenantsResponse.data);
    
            // Charger les stocks seulement si un diffuseur est sélectionné
            if (diffuseurId) {
                const stockResponse = await axios.get<Stock[]>(
                    `http://localhost:8080/stock/getByDiffuseur/${diffuseurId}`
                );
                
                if (Array.isArray(stockResponse.data)) {
                    setStocks(stockResponse.data);
                } else {
                    setStocks([]);
                }
            } else {
                setStocks([]);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.status === 404 
                    ? 'Aucun stock trouvé'
                    : 'Erreur lors de la récupération des données';
                showSnackbar(message, 'error');
            } else {
                showSnackbar('Erreur inattendue', 'error');
            }
            console.error('Erreur détaillée:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDiffuseurChange = (diffuseur: Diffuseur | null) => {
        setSelectedDiffuseur(diffuseur);
        if (diffuseur) {
            fetchData(diffuseur.id);
        } else {
            setStocks([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedDiffuseurData = diffuseurs.find(d => d.id === formData.idDiffuseur);
            const selectedContenant = contenants.find(c => c.id === formData.idContenant);
    
            if (!selectedDiffuseurData || !selectedContenant) {
                showSnackbar('Diffuseur ou contenant invalide', 'error');
                return;
            }
    
            const stockData = {
                id: 0, 
                diffuseur: selectedDiffuseurData,
                contenant: selectedContenant,
                quantite: formData.quantite,
                idDiffuseur: formData.idDiffuseur,
                idContenant: formData.idContenant
            };
    
            await axios.post('http://localhost:8080/stock/add', stockData);
            showSnackbar('Stock ajouté avec succès', 'success');
            setOpenDialog(false);
            if (selectedDiffuseur) {
                fetchData(selectedDiffuseur.id);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du stock:', error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Erreur lors de l\'ajout du stock';
                showSnackbar(message, 'error');
            } else {
                showSnackbar('Erreur inattendue lors de l\'ajout du stock', 'error');
            }
        }
    };

    const handleBack = () => {
        navigate('/');
    }

    const handleDeleteConfirmOpen = (stock: Stock) => {
        setDeleteConfirmDialog({
            open: true,
            idStock: stock.id,
            contenantNom: stock.contenant.nom
        });
    };
    
    const handleDelete = async () => {
        try {
            await axios.delete(
                `http://localhost:8080/stock/delete/${deleteConfirmDialog.idStock}`
            );
            showSnackbar('Stock supprimé avec succès', 'success');
            setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false, contenantNom: '' });
            if (selectedDiffuseur) {
                fetchData(selectedDiffuseur.id);
            }
        } catch (error) {
            console.error('Error deleting stock:', error);
            showSnackbar('Erreur lors de la suppression du stock', 'error');
        }
    };

    const getStockTypeColor = (type: string) => {
        switch(type) {
            case 'S': return theme.palette.info.main;
            case 'M': return theme.palette.warning.main;
            case 'XL': return theme.palette.error.main;
            default: return theme.palette.secondary.main;
        }
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
                                Gestion des Stocks
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Gérez les stocks par diffuseur
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            startIcon={<ArrowBackIcon />}
                            sx={{ borderRadius: '8px' }}
                        >
                            Retour au tableau de bord
                        </Button>
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
                        <StorefrontIcon sx={{ mr: 1 }} /> 
                        Sélectionnez un diffuseur
                    </Typography>
                    
                    <Autocomplete
                        options={diffuseurs}
                        getOptionLabel={(option) => option.nom}
                        value={selectedDiffuseur}
                        onChange={(event, newValue) => {
                            handleDiffuseurChange(newValue);
                        }}
                        loading={loading}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Diffuseur"
                                placeholder="Rechercher un diffuseur..."
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 32, 
                                            height: 32, 
                                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                            color: theme.palette.secondary.main,
                                            mr: 1,
                                            fontSize: '0.875rem',
                                            fontWeight: 'medium'
                                        }}
                                    >
                                        {option.nom.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1">{option.nom}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {option.account.prenom} {option.account.nom}
                                        </Typography>
                                    </Box>
                                </Box>
                            </li>
                        )}
                    />
                </Card>
    
                {selectedDiffuseur && (
                    <>
                        <Card
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
                                mb: 3
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
                                            mr: 2
                                        }}
                                    >
                                        <StorefrontIcon fontSize="large" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {selectedDiffuseur.nom}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Détails du diffuseur
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            idDiffuseur: selectedDiffuseur.id,
                                            idContenant: 0,
                                            quantite: 0
                                        });
                                        setOpenDialog(true);
                                    }}
                                    sx={{
                                        borderRadius: '24px',
                                        px: 3,
                                        boxShadow: 2
                                    }}
                                >
                                    Ajouter un stock
                                </Button>
                            </Box>
                            
                            <Divider sx={{ mb: 3 }} />
                            
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid xs={12} md={4}>
                                    <Box sx={{ 
                                        p: 2, 
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                width: 48,
                                                height: 48,
                                                mr: 2
                                            }}
                                        >
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Contact
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {selectedDiffuseur.account.prenom} {selectedDiffuseur.account.nom}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid xs={12} md={4}>
                                    <Box sx={{ 
                                        p: 2, 
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                                color: theme.palette.info.main,
                                                width: 48,
                                                height: 48,
                                                mr: 2
                                            }}
                                        >
                                            <EmailIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {selectedDiffuseur.account.mail}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid xs={12} md={4}>
                                    <Box sx={{ 
                                        p: 2, 
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                color: theme.palette.success.main,
                                                width: 48,
                                                height: 48,
                                                mr: 2
                                            }}
                                        >
                                            <PhoneIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Téléphone
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {selectedDiffuseur.account.tel || 'Non spécifié'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            {stocks.length > 0 && (
                                <Grid container spacing={4} sx={{ mb: 4 }}>
                                    <Grid xs={12} sm={6} md={3}>
                                        <Card 
                                            elevation={0}
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                                height: '100%',
                                                p: 1,
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Box 
                                                        sx={{ 
                                                            p: 1, 
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            borderRadius: 1,
                                                            mr: 2
                                                        }}
                                                    >
                                                        <InventoryIcon sx={{ color: theme.palette.primary.main }} />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Total des contenants
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                    {totalItems}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            <Card 
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        borderBottom: `1px solid ${theme.palette.divider}`
                                    }}
                                >
                                    <InventoryIcon 
                                        sx={{ 
                                            fontSize: 24, 
                                            color: theme.palette.primary.main,
                                            mr: 1.5
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight="medium">
                                        Inventaire actuel
                                    </Typography>
                                </Box>

                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : stocks.length === 0 ? (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            Aucun stock disponible pour ce diffuseur
                                        </Typography>
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<AddIcon />}
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    idDiffuseur: selectedDiffuseur.id,
                                                    idContenant: 0,
                                                    quantite: 0
                                                });
                                                setOpenDialog(true);
                                            }}
                                            sx={{ mt: 2 }}
                                        >
                                            Ajouter un stock
                                        </Button>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width="40%">Type de contenant</TableCell>
                                                    <TableCell width="20%">Quantité</TableCell>
                                                    <TableCell width="40%">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stocks.map((stock) => (
                                                    <TableRow 
                                                        key={stock.id}
                                                        hover
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            transition: 'background-color 0.2s',
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {stock.contenant.nom}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography 
                                                                variant="body2" 
                                                                fontWeight="bold"
                                                                sx={{ color: theme.palette.text.primary }}
                                                            >
                                                                {stock.quantite}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Supprimer">
                                                                <IconButton 
                                                                    onClick={() => handleDeleteConfirmOpen(stock)}
                                                                    size="small"
                                                                    sx={{ 
                                                                        color: theme.palette.error.main,
                                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.error.main, 0.2)
                                                                        }
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Card>
                        </Card>
                    </>
                )}
    
                {/* Formulaire d'ajout */}
                <Dialog 
                    open={openDialog} 
                    onClose={() => setOpenDialog(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        elevation: 8,
                        sx: { borderRadius: 2 }
                    }}
                >
                    <DialogTitle 
                        sx={{ 
                            pb: 1, 
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AddIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="h6" component="div" fontWeight="bold">
                                Ajouter un stock
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent dividers sx={{ py: 3 }}>
                            <Grid container spacing={3}>
                                <Grid xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="contenant-label">Contenant</InputLabel>
                                        <Select
                                            labelId="contenant-label"
                                            id="contenant-select"
                                            value={formData.idContenant || '1'}
                                            onChange={(e) => setFormData({...formData, idContenant: Number(e.target.value)})}
                                            label="Contenant"
                                            required
                                        >
                                            {contenants.map((contenant) => (
                                                <MenuItem key={contenant.id} value={contenant.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Chip
                                                        icon={
                                                            <SquareFootIcon 
                                                                sx={{ 
                                                                    fontSize: contenant.type === 'S' ? '0.8rem' : 
                                                                            contenant.type === 'M' ? '1rem' : '1.2rem' 
                                                                }}
                                                            />
                                                        }
                                                        label={contenant.type}
                                                        size="small"
                                                        sx={{ 
                                                            mr: 1,
                                                            bgcolor: alpha(getStockTypeColor(contenant.type), 0.1),
                                                            color: getStockTypeColor(contenant.type),
                                                            fontWeight: 'medium'
                                                        }}
                                                    />
                                                    {contenant.nom}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    label="Quantité"
                                    type="number"
                                    value={formData.quantite}
                                    onChange={(e) => setFormData({...formData, quantite: Number(e.target.value)})}
                                    fullWidth
                                    required
                                    InputProps={{ inputProps: { min: 1 } }}
                                    helperText="Entrez un nombre positif"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                        <Button 
                            onClick={() => setOpenDialog(false)} 
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: '8px', boxShadow: 2 }}
                        >
                            Ajouter
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
                PaperProps={{
                    elevation: 8,
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                    Confirmer la suppression
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Êtes-vous sûr de vouloir supprimer le stock de "{deleteConfirmDialog.contenantNom}" pour ce diffuseur ? 
                        Cette action ne peut pas être annulée.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button 
                        onClick={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        variant="contained" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: '8px', boxShadow: 2 }}
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    variant="filled"
                    elevation={6}
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Backdrop de chargement */}
            <Backdrop
                sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
                open={loading && !selectedDiffuseur}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    </Box>
);
};

export default AdminStockPage;