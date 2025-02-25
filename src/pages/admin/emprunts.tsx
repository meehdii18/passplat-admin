import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
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

interface Contenant {
    id: number;
    nom: string;
}

interface DiffuseurCollecteur {
    id: number;
    nom: string;
    account: User;
}

interface Emprunt {
    id: number;
    user: User;
    contenant: Contenant;
    diffuseur: DiffuseurCollecteur;
    dateEmprunt: string;
    quantite: number;
    dateRenduPrevu: string;
    dateRenduReel: string | null;
    collecteur: DiffuseurCollecteur | null;
}

interface EmpruntFormData {
    IdUser: number;
    IdContenant: number;
    IdDiffuseur: number;
    dateEmprunt: string;
    quantite: number;
    dateRenduPrevu: string;
    dateRenduReel: string | null;
    IdCollecteur: number;
}

const AdminEmpruntPage: React.FC = () => {
    const navigate = useNavigate();
    const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmprunt, setSelectedEmprunt] = useState<Emprunt | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [formData, setFormData] = useState<EmpruntFormData>({
        IdUser: 0,
        IdContenant: 0,
        IdDiffuseur: 0,
        dateEmprunt: new Date().toISOString().split('T')[0],
        quantite: 1,
        dateRenduPrevu: new Date().toISOString().split('T')[0],
        dateRenduReel: null,
        IdCollecteur: 0
    });
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<Map<number, User>>(new Map());
    const [diffuseurs, setDiffuseurs] = useState<Map<number, DiffuseurCollecteur>>(new Map());
    const [prolongDialogOpen, setProlongDialogOpen] = useState(false);
    const [empruntToProlong, setEmpruntToProlong] = useState<number | null>(null);


    useEffect(() => {
        Promise.all([fetchEmprunts(), fetchData()]);
    }, []);

    const fetchEmprunts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/emprunt/getAll');
            setEmprunts(response.data);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des emprunts', 'error');
        }
    };

    const fetchData = async () => {
        try {
            const [usersRes, diffuseursRes] = await Promise.all([
                axios.get('http://localhost:8080/account/getAll'),
                axios.get('http://localhost:8080/diffuseur/getAll')
            ]);
            
            const usersMap = new Map(usersRes.data.map((user: User) => [user.id, user]));
            const diffuseursMap = new Map(diffuseursRes.data.map((diff: DiffuseurCollecteur) => [diff.id, diff]));
            
            setUsers(usersMap);
            setDiffuseurs(diffuseursMap);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des données', 'error');
        }
    };

    const handleEdit = (emprunt: Emprunt) => {
        if (!emprunt) return;
        
        setSelectedEmprunt(emprunt);
        setFormData({
            id: emprunt.id,
            IdUser: emprunt.user?.id || 0,
            IdContenant: emprunt.contenant?.id || 0,
            IdDiffuseur: emprunt.diffuseur?.id || 0,
            dateEmprunt: emprunt.dateEmprunt ? 
                new Date(emprunt.dateEmprunt).toISOString().split('T')[0] :
                new Date().toISOString().split('T')[0],
            quantite: emprunt.quantite || 1,
            dateRenduPrevu: emprunt.dateRenduPrevu ?
                new Date(emprunt.dateRenduPrevu).toISOString().split('T')[0] :
                new Date().toISOString().split('T')[0],
            dateRenduReel: emprunt.dateRenduReel ? 
                new Date(emprunt.dateRenduReel).toISOString().split('T')[0] : 
                null,
            IdCollecteur: emprunt.collecteur?.id || 0
        });
        setOpenDialog(true);
    };

    const handleNewEmprunt = () => {
        setSelectedEmprunt(null);
        setFormData({
            IdUser: 0,
            IdContenant: 0,
            IdDiffuseur: 0,
            dateEmprunt: new Date().toISOString().split('T')[0],
            quantite: 1,
            dateRenduPrevu: new Date().toISOString().split('T')[0],
            dateRenduReel: null,
            IdCollecteur: 0
        });
        setOpenDialog(true);
    };

    const handleBack = () => {
        navigate('/');
    }

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleProlongClick = (empruntId: number) => {
        setEmpruntToProlong(empruntId);
        setProlongDialogOpen(true);
    };

    const handleProlongConfirm = async () => {
        if (empruntToProlong) {
            try {
                await axios.post(`http://localhost:8080/emprunt/prolong/${empruntToProlong}`);
                showSnackbar('Emprunt prolongé avec succès', 'success');
                fetchEmprunts();
            } catch (error) {
                console.error('Error:', error);
                showSnackbar('Erreur lors de la prolongation', 'error');
            }
        }
        setProlongDialogOpen(false);
        setEmpruntToProlong(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedEmprunt) {
                if (formData.dateRenduReel) {
                    const empruntData = {
                        idUser: formData.IdUser,
                        ListeRendu: {
                            [formData.IdContenant]: formData.quantite
                        },
                        idCollecteur: formData.IdCollecteur
                    };
                    await axios.post('http://localhost:8080/emprunt/finishEmprunt', empruntData);
                    showSnackbar('Emprunt terminé avec succès', 'success');
                } else {
                    const updatedEmprunt = {
                        id: selectedEmprunt.id,
                        user: { id: formData.IdUser },
                        contenant: { id: formData.IdContenant },
                        diffuseur: { id: formData.IdDiffuseur },
                        dateEmprunt: formData.dateEmprunt,
                        quantite: formData.quantite,
                        dateRenduPrevu: formData.dateRenduPrevu,
                        dateRenduReel: formData.dateRenduReel,
                        collecteur: formData.IdCollecteur ? { id: formData.IdCollecteur } : null
                    };
                    await axios.post('http://localhost:8080/emprunt/add', updatedEmprunt);
                    showSnackbar('Emprunt modifié avec succès', 'success');
                }
            } else {
                await axios.post(
                    'http://localhost:8080/emprunt/addEmprunt', 
                    null, 
                    { 
                        params: {
                            idUser: formData.IdUser,
                            idContenant: formData.IdContenant,
                            idDiffuseur: formData.IdDiffuseur,
                            quantiteEmpruntee: formData.quantite
                        }
                    }
                );
                showSnackbar('Emprunt créé avec succès', 'success');
            }
            setOpenDialog(false);
            fetchEmprunts();
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Erreur lors de la sauvegarde', 'error');
        }
    };

    const handleProlong = async (empruntId: number) => {
        try {
            await axios.post(`http://localhost:8080/emprunt/prolong/${empruntId}`);
            showSnackbar('Emprunt prolongé avec succès', 'success');
            fetchEmprunts();
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Erreur lors de la prolongation', 'error');
        }
    };

    const isDateOverdue = (dateRendu: string, datePrevu: string) => {
        const rendu = new Date(dateRendu);
        const prevu = new Date(datePrevu);
        return rendu > prevu;
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
            Gestion des Emprunts
            </Typography>

        </Box>
            

            
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Rechercher un emprunt..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: '300px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewEmprunt}
                >
                    Nouvel emprunt
                </Button>
            </Box>

            <TableContainer 
            component={Paper}
            sx={{ 
                border: 1,
                borderColor: 'divider',
                borderRadius: 5,
                '& .MuiTableCell-root': {
                    borderRight: 1,
                    borderColor: 'divider',
                    '&:last-child': {
                        borderRight: 0
                    }
                },
                '& .MuiTableHead-root': {
                    '& .MuiTableCell-root': {
                        backgroundColor: theme.palette.primary.main,
                        fontWeight: 'bold'
                    }
                }
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Utilisateur</TableCell>
                            <TableCell>Contenant</TableCell>
                            <TableCell>Diffuseur</TableCell>
                            <TableCell>Date d'emprunt</TableCell>
                            <TableCell>Quantité</TableCell>
                            <TableCell>Date prévue</TableCell>
                            <TableCell>Date rendu</TableCell>
                            <TableCell>Collecteur</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {emprunts.map((emprunt) => (
                            <TableRow key={emprunt?.id || 'undefined'}>
                                <TableCell>{emprunt?.id || '-'}</TableCell>
                                <TableCell>
                                    {emprunt?.user ? `${emprunt.user.prenom} ${emprunt.user.nom}` : '-'}
                                </TableCell>
                                <TableCell>{emprunt?.contenant?.nom || '-'}</TableCell>
                                <TableCell>{emprunt?.diffuseur?.nom || '-'}</TableCell>
                                <TableCell>
                                    {emprunt?.dateEmprunt ? 
                                        new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR') : 
                                        '-'}
                                </TableCell>
                                <TableCell>{emprunt?.quantite || '-'}</TableCell>
                                <TableCell>
                                    {emprunt?.dateRenduPrevu ? 
                                        new Date(emprunt.dateRenduPrevu).toLocaleDateString('fr-FR') : 
                                        '-'}
                                </TableCell>
                                <TableCell>
                                    {emprunt?.dateRenduReel ? 
                                        new Date(emprunt.dateRenduReel).toLocaleDateString('fr-FR') : 
                                        '-'}
                                </TableCell>
                                <TableCell>
                                    {emprunt?.collecteur?.nom || '-'}
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => emprunt && handleEdit(emprunt)}
                                        disabled={!emprunt}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    {emprunt && !emprunt.dateRenduReel && (
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleProlongClick(emprunt.id)}
                                        title="Prolonger l'emprunt"
                                    >
                                        <HistoryIcon />
                                    </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {selectedEmprunt ? 'Modifier emprunt' : 'Nouvel emprunt'}
                    </DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Utilisateur</InputLabel>
                            <Select
                                value={formData.IdUser}
                                onChange={(e) => setFormData({...formData, IdUser: Number(e.target.value)})}
                                required
                            >
                                {Array.from(users.values()).map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {`${user.prenom} ${user.nom}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Contenant</InputLabel>
                            <Select
                                value={formData.IdContenant}
                                onChange={(e) => setFormData({...formData, IdContenant: Number(e.target.value)})}
                                required
                            >
                                <MenuItem value={1}>XL</MenuItem>
                                <MenuItem value={2}>M</MenuItem>
                                <MenuItem value={3}>S</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Diffuseur</InputLabel>
                            <Select
                                value={formData.IdDiffuseur}
                                onChange={(e) => setFormData({...formData, IdDiffuseur: Number(e.target.value)})}
                                required
                            >
                                {Array.from(diffuseurs.values()).map((diffuseur) => (
                                    <MenuItem key={diffuseur.id} value={diffuseur.id}>
                                        {diffuseur.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Date d'emprunt"
                            type="date"
                            value={formData.dateEmprunt}
                            onChange={(e) => setFormData({...formData, dateEmprunt: e.target.value})}
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Quantité"
                            type="number"
                            value={formData.quantite}
                            onChange={(e) => setFormData({...formData, quantite: Number(e.target.value)})}
                            margin="normal"
                            required
                            inputProps={{ min: 1 }}
                        />

                        <TextField
                            fullWidth
                            label="Date prévue de rendu"
                            type="date"
                            value={formData.dateRenduPrevu}
                            onChange={(e) => setFormData({...formData, dateRenduPrevu: e.target.value})}
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        {selectedEmprunt && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Date de rendu réel"
                                    type="date"
                                    value={formData.dateRenduReel || ''}
                                    onChange={(e) => setFormData({...formData, dateRenduReel: e.target.value})}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Collecteur</InputLabel>
                                    <Select
                                        value={formData.IdCollecteur}
                                        onChange={(e) => setFormData({...formData, IdCollecteur: Number(e.target.value)})}
                                    >
                                        <MenuItem value={0}>-</MenuItem>
                                        {Array.from(diffuseurs.values()).map((diffuseur) => (
                                            <MenuItem key={diffuseur.id} value={diffuseur.id}>
                                                {diffuseur.nom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                        <Button type="submit" variant="contained">Sauvegarder</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={prolongDialogOpen}
                onClose={() => setProlongDialogOpen(false)}
            >
                <DialogTitle>Confirmation de prolongation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Voulez vous prolonger l'emprunt d'une semaine ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProlongDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleProlongConfirm} variant="contained" color="primary">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminEmpruntPage;