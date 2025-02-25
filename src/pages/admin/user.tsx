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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

interface UserFormData {
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

const ROLES = {
    USER: 1,
    ADMIN: 2,
    DIFFUSEUR: 3,
    COLLECTEUR: 4,
    BOTH: 5
};

const getRoleName = (role: number): string => {
    switch (role) {
        case ROLES.USER: return 'Utilisateur';
        case ROLES.ADMIN: return 'Administrateur';
        case ROLES.DIFFUSEUR: return 'Diffuseur';
        case ROLES.COLLECTEUR: return 'Collecteur';
        case ROLES.BOTH: return 'Diffuseur/Collecteur';
        default: return 'Inconnu';
    }
};

const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [formData, setFormData] = useState<UserFormData>({
        tel: '',
        mail: '',
        adresse: '',
        nom: '',
        prenom: '',
        username: '',
        role: ROLES.USER,
        nbProlong: 0,
        mdp: '',
        estSupprime: 0
    });
    const theme = useTheme();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/getAll');
            setUsers(response.data);
        } catch (error) {
            showSnackbar('Erreur lors de la récupération des utilisateurs', 'error');
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            tel: user.tel || '',
            mail: user.mail || '',
            adresse: user.adresse || '',
            nom: user.nom || '',
            prenom: user.prenom || '',
            username: user.username || '',
            role: user.role,
            nbProlong: user.nbProlong,
            mdp: user.mdp || '',
            estSupprime: user.estSupprime
        });
        setOpenDialog(true);
    };

    const handleDeleteClick = (userId: number) => {
        setUserToDelete(userId);
        setDeleteDialogOpen(true);
    };
    
    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                await axios.patch(`http://localhost:8080/account/delete/${userToDelete}`);
                fetchUsers();
                showSnackbar('Utilisateur supprimé avec succès', 'success');
            } catch (error) {
                showSnackbar('Erreur lors de la suppression', 'error');
            }
        }
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };
    
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleBack = () => {
        navigate('/');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await axios.put(`http://localhost:8080/account/updateAccountDetails/${selectedUser.id}`, formData);
                showSnackbar('Utilisateur modifié avec succès', 'success');
            } else {
                await axios.post('http://localhost:8080/account/add', formData);
                showSnackbar('Utilisateur créé avec succès', 'success');
            }
            setOpenDialog(false);
            fetchUsers();
        } catch (error) {
            showSnackbar('Erreur lors de la sauvegarde', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setFormData({
            tel: '',
            mail: '',
            adresse: '',
            nom: '',
            prenom: '',
            username: '',
            role: ROLES.USER,
            nbProlong: 0,
            mdp: '',
            estSupprime: 0
        });
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
            Gestion des Utilisateurs
            </Typography>

        </Box>
            

            
            <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
                setSelectedUser(null); 
                setFormData({          
                    tel: '',
                    mail: '',
                    adresse: '',
                    nom: '',
                    prenom: '',
                    username: '',
                    role: ROLES.USER,
                    nbProlong: 0,
                    mdp: '',
                    estSupprime: 0
                });
                setOpenDialog(true);  
            }}
            sx={{ mb: 2 }}
            >
                Ajouter un utilisateur
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Rôle</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.nom}</TableCell>
                                <TableCell>{user.prenom}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.mail}</TableCell>
                                <TableCell>{user.tel}</TableCell>
                                <TableCell>{getRoleName(user.role)}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleEdit(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteClick(user.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {selectedUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Nom"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Prénom"
                            value={formData.prenom}
                            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.mail}
                            onChange={(e) => setFormData({...formData, mail: e.target.value})}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Téléphone"
                            value={formData.tel}
                            onChange={(e) => setFormData({...formData, tel: e.target.value})}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Adresse"
                            value={formData.adresse}
                            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                            margin="normal"
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Rôle</InputLabel>
                            <Select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: Number(e.target.value)})}
                                required
                            >
                                <MenuItem value={ROLES.USER}>Utilisateur</MenuItem>
                                <MenuItem value={ROLES.ADMIN}>Administrateur</MenuItem>
                                <MenuItem value={ROLES.DIFFUSEUR}>Diffuseur</MenuItem>
                                <MenuItem value={ROLES.COLLECTEUR}>Collecteur</MenuItem>
                                <MenuItem value={ROLES.BOTH}>Diffuseur/Collecteur</MenuItem>
                            </Select>
                        </FormControl>
                        {!selectedUser && (
                            <TextField
                                fullWidth
                                label="Mot de passe"
                                type="password"
                                value={formData.mdp}
                                onChange={(e) => setFormData({...formData, mdp: e.target.value})}
                                margin="normal"
                                required
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Annuler</Button>
                        <Button type="submit" variant="contained">Sauvegarder</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>
                    Confirmer la suppression
                </DialogTitle>
                <DialogContent>
                    Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>
                        Annuler
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Supprimer
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

export default AdminPage;