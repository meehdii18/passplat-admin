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
    Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
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
}

interface Stock {
    id: number;
    diffuseur: Diffuseur;
    contenant: Contenant;
    quantite: number;
    idDiffuseur: number;
    idContenant: number;
}

const AdminStockPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [diffuseurs, setDiffuseurs] = useState<Diffuseur[]>([]);
    const [contenants, setContenants] = useState<Contenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [selectedDiffuseur, setSelectedDiffuseur] = useState<Diffuseur | null>(null);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
        open: false,
        idStock: 0
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

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleDeleteConfirmOpen = (idStock: number) => {
        setDeleteConfirmDialog({
            open: true,
            idStock
        });
    };
    
    const handleDelete = async () => {
        try {
            await axios.delete(
                `http://localhost:8080/stock/delete/${deleteConfirmDialog.idStock}`
            );
            showSnackbar('Stock supprimé avec succès', 'success');
            setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false });
            if (selectedDiffuseur) {
                fetchData(selectedDiffuseur.id);
            }
        } catch (error) {
            console.error('Error deleting stock:', error);
            showSnackbar('Erreur lors de la suppression du stock', 'error');
        }
    };
    
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4,
                position: 'relative'
            }}>
                <Button
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ minWidth: 100 }}
                >
                    Retour
                </Button>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: theme.palette.primary.main, 
                        position: 'absolute', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold'
                    }}
                >
                    Gestion des Stocks
                </Typography>
            </Box>
    
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Sélectionner un diffuseur</InputLabel>
                    <Select
                        value={selectedDiffuseur?.id || ''}
                        onChange={(e) => {
                            const diffuseur = diffuseurs.find(d => d.id === e.target.value);
                            handleDiffuseurChange(diffuseur || null);
                        }}
                    >
                        {diffuseurs.map((diffuseur) => (
                            <MenuItem key={diffuseur.id} value={diffuseur.id}>
                                {diffuseur.nom}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
    
            {selectedDiffuseur && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    {/* Info du diffuseur */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ color: theme.palette.secondary.main, mb: 2 }}>
                            {selectedDiffuseur.nom}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">Contact</Typography>
                                <Typography variant="body2">
                                    {selectedDiffuseur.account.nom} {selectedDiffuseur.account.prenom}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                                <Typography variant="body2">{selectedDiffuseur.account.mail}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">Téléphone</Typography>
                                <Typography variant="body2">{selectedDiffuseur.account.tel}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Bouton d'ajout */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    idDiffuseur: selectedDiffuseur.id
                                });
                                setOpenDialog(true);
                            }}
                            sx={{ 
                                bgcolor: theme.palette.secondary.main,
                                '&:hover': {
                                    bgcolor: theme.palette.secondary.dark,
                                }
                            }}
                        >
                            Ajouter un stock
                        </Button>
                    </Box>

                    {/* Tableau */}
                    <TableContainer sx={{ boxShadow: 2, borderRadius: 1 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Contenant</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Quantité</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stocks.map((stock) => (
                                    <TableRow 
                                        key={stock.id}
                                        sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}
                                    >
                                        <TableCell>
                                            <Typography variant="body1">{stock.contenant.nom}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="medium">
                                                {stock.quantite}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteConfirmOpen(stock.id)}
                                                size="small"
                                                sx={{ 
                                                    '&:hover': { 
                                                        bgcolor: theme.palette.error.light 
                                                    }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
    
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        {selectedStock ? 'Modifier un stock' : 'Ajouter un stock'}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Contenant</InputLabel>
                            <Select
                                value={formData.idContenant}
                                onChange={(e) => setFormData({...formData, idContenant: Number(e.target.value)})}
                                required
                            >
                                {contenants.map((contenant) => (
                                    <MenuItem key={contenant.id} value={contenant.id}>
                                        {contenant.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
    
                        <TextField
                            fullWidth
                            label="Quantité"
                            type="number"
                            value={formData.quantite}
                            onChange={(e) => setFormData({...formData, quantite: Number(e.target.value)})}
                            margin="normal"
                            required
                            inputProps={{ min: 0 }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Button onClick={() => setOpenDialog(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            {selectedStock ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
    
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    Confirmer la suppression
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography>
                        Êtes-vous sûr de vouloir supprimer ce stock ?
                        Cette action est irréversible.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Button 
                        onClick={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        color="error" 
                        variant="contained"
                        sx={{ 
                            '&:hover': { 
                                bgcolor: theme.palette.error.dark 
                            }
                        }}
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
    
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    severity={snackbar.severity} 
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );

};

export default AdminStockPage;