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
    Snackbar,
    Checkbox
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
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

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
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

const AdminUserPage: React.FC = () => {
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
    const [searchQuery, setSearchQuery] = useState('');
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
    const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/getAll');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching emprunts:', error);
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
                console.error('Error fetching emprunts:', error);
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
            console.error('Error fetching emprunts:', error);
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

    const filteredUsers = users.filter((user) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            user.nom.toLowerCase().includes(searchLower) ||
            user.prenom.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower) ||
            user.mail.toLowerCase().includes(searchLower) ||
            getRoleName(user.role).toLowerCase().includes(searchLower) ||
            user.tel.includes(searchLower)
        );
    });

    const sortData = (data: User[]) => {
        if (!sortConfig.key) return data;
    
        return [...data].sort((a, b) => {
            let aValue: any;
            let bValue: any;
    
            switch (sortConfig.key) {
                case 'nom':
                    aValue = a.nom;
                    bValue = b.nom;
                    break;
                case 'prenom':
                    aValue = a.prenom;
                    bValue = b.prenom;
                    break;
                case 'username':
                    aValue = a.username;
                    bValue = b.username;
                    break;
                case 'mail':
                    aValue = a.mail;
                    bValue = b.mail;
                    break;
                case 'tel':
                    aValue = a.tel;
                    bValue = b.tel;
                    break;
                case 'role':
                    aValue = getRoleName(a.role);
                    bValue = getRoleName(b.role);
                    break;
                default:
                    return 0;
            }
    
            if (aValue === null) return 1;
            if (bValue === null) return -1;
            
            const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    };

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleCopyEmails = () => {
        const emailList = users
            .filter(user => selectedEmails.includes(user.id))
            .map(user => user.mail)
            .join('; ');
        
        navigator.clipboard.writeText(emailList)
            .then(() => {
                showSnackbar('Adresses email copiées avec succès', 'success');
                setContactDialogOpen(false);
                setSelectedEmails([]);
            })
            .catch(() => {
                showSnackbar('Erreur lors de la copie des adresses email', 'error');
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
            

            
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3 
        }}>
            <TextField
                size="small"
                variant="outlined"
                placeholder="Rechercher un utilisateur..."
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
                startIcon={<EmailIcon />}
                onClick={() => setContactDialogOpen(true)}
                sx={{ mb: 2 }}
            >
                Contact 
            </Button>
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
            }}
            >
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell onClick={() => handleSort('nom')} style={{ cursor: 'pointer' }}>
                            Nom {sortConfig.key === 'nom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell onClick={() => handleSort('prenom')} style={{ cursor: 'pointer' }}>
                            Prénom {sortConfig.key === 'prenom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>
                            Username {sortConfig.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell onClick={() => handleSort('mail')} style={{ cursor: 'pointer' }}>
                            Email {sortConfig.key === 'mail' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell onClick={() => handleSort('tel')} style={{ cursor: 'pointer' }}>
                            Téléphone {sortConfig.key === 'tel' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                            Rôle {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                    <TableBody>
                        {sortData(filteredUsers).map((user) => (
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
                        {selectedUser ? (
    <FormControl fullWidth margin="normal">
        <Button
            variant="outlined"
            color="primary"
            onClick={() => {
                setFormData({
                    ...formData,
                    mdp: '' // Réinitialiser le mot de passe
                });
                // Ouvrir un nouveau Dialog pour le changement de mot de passe
                setPasswordDialogOpen(true);
            }}
        >
            Changer le mot de passe
        </Button>
    </FormControl>
) : (
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

            <Dialog
                open={passwordDialogOpen}
                onClose={() => setPasswordDialogOpen(false)}
            >
            <DialogTitle>
                Changer le mot de passe
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Nouveau mot de passe"
                    type="password"
                    value={formData.mdp}
                    onChange={(e) => setFormData({...formData, mdp: e.target.value})}
                    margin="normal"
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPasswordDialogOpen(false)}>
                    Annuler
                </Button>
                <Button 
                    onClick={async () => {
                        try {
                            await axios.patch(
                                `http://localhost:8080/account/updateMdp/${selectedUser?.id}/${formData.mdp}`
                            );
                            showSnackbar('Mot de passe modifié avec succès', 'success');
                            setPasswordDialogOpen(false);
                        } catch (error) {
                            showSnackbar('Erreur lors de la modification du mot de passe', 'error');
                        }
                    }} 
                    color="primary" 
                    variant="contained"
                >
                    Sauvegarder
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={contactDialogOpen}
            onClose={() => {
                setContactDialogOpen(false);
                setSelectedEmails([]);
            }}
            maxWidth="md"
            fullWidth
        >
        <DialogTitle>
            Sélectionner les utilisateurs à contacter
        </DialogTitle>
        <DialogContent>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedEmails(users.map(u => u.id));
                                        } else {
                                            setSelectedEmails([]);
                                        }
                                    }}
                                    checked={selectedEmails.length === users.length}
                                    indeterminate={selectedEmails.length > 0 && selectedEmails.length < users.length}
                                />
                            </TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rôle</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedEmails.includes(user.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedEmails([...selectedEmails, user.id]);
                                            } else {
                                                setSelectedEmails(selectedEmails.filter(id => id !== user.id));
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{user.nom}</TableCell>
                                <TableCell>{user.prenom}</TableCell>
                                <TableCell>{user.mail}</TableCell>
                                <TableCell>{getRoleName(user.role)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {
                setContactDialogOpen(false);
                setSelectedEmails([]);
            }}>
                Annuler
            </Button>
            <Button 
                onClick={handleCopyEmails}
                variant="contained"
                color="primary"
                disabled={selectedEmails.length === 0}
            >
                Copier les emails ({selectedEmails.length} sélectionné{selectedEmails.length > 1 ? 's' : ''})
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

export default AdminUserPage;