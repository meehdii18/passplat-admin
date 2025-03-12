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
        <Container>
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
        }}>
            <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            >
            Retour
            </Button>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            Gestion des Stocks
            </Typography>

        </Box>

    
            {/* Sélection du diffuseur */}
            <Box sx={{ mb: 4 }}>
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
            </Box>
    
            {/* Affichage du stock seulement si un diffuseur est sélectionné */}
            {selectedDiffuseur && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" color="secondary">
                            Stock de {selectedDiffuseur.nom}
                        </Typography>
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
                        >
                            Ajouter un stock
                        </Button>
                    </Box>
    
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Diffuseur</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Contenant</TableCell>
                                    <TableCell>Quantité</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stocks.map((stock) => (
                                    <TableRow key={stock.id}>
                                        <TableCell>
                                            <Typography variant="body1">{stock.diffuseur.nom}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {stock.diffuseur.account.nom} {stock.diffuseur.account.prenom}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{stock.diffuseur.account.mail}</Typography>
                                            <Typography variant="body2">{stock.diffuseur.account.tel}</Typography>
                                        </TableCell>
                                        <TableCell>{stock.contenant.nom}</TableCell>
                                        <TableCell>{stock.quantite}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteConfirmOpen(stock.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {selectedStock ? 'Modifier un stock' : 'Ajouter un stock'}
                    </DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Diffuseur</InputLabel>
                            <Select
                                value={formData.idDiffuseur}
                                onChange={(e) => setFormData({...formData, idDiffuseur: Number(e.target.value)})}
                                required
                            >
                                {diffuseurs.map((diffuseur) => (
                                    <MenuItem key={diffuseur.id} value={diffuseur.id}>
                                        {diffuseur.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {selectedStock ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <Typography>
                        Êtes-vous sûr de vouloir supprimer ce stock ?
                        Cette action est irréversible.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        color="error" 
                        variant="contained"
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
    
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    severity={snackbar.severity} 
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminStockPage;