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
    Checkbox,
    Chip,
    Avatar,
    Backdrop,
    CircularProgress,
    Tooltip,
    TablePagination,
    Card,
    CardContent,
    Divider,
    useMediaQuery
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PasswordIcon from '@mui/icons-material/Password';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';

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

const getRoleIcon = (role: number) => {
    switch (role) {
        case ROLES.USER:
            return <PersonIcon />;
        case ROLES.ADMIN:
            return <AdminPanelSettingsIcon sx={{ color: '#8E24AA' }} />;
        case ROLES.DIFFUSEUR:
            return <StorefrontIcon sx={{ color: '#1976D2' }} />;
        case ROLES.COLLECTEUR:
            return <LocalShippingIcon sx={{ color: '#2E7D32' }} />;
        case ROLES.BOTH:
            return <SwapHorizIcon sx={{ color: '#F57C00' }} />;
        default:
            return <PersonIcon />;
    }
};

const getRoleColor = (role: number) => {
    switch (role) {
        case ROLES.USER:
            return '#757575'; // Gris
        case ROLES.ADMIN:
            return '#8E24AA'; // Violet
        case ROLES.DIFFUSEUR:
            return '#1976D2'; // Bleu
        case ROLES.COLLECTEUR:
            return '#2E7D32'; // Vert
        case ROLES.BOTH:
            return '#F57C00'; // Orange
        default:
            return '#757575';
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
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nom', direction: 'asc' });
    const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [roleFilter, setRoleFilter] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/account/getAll');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showSnackbar('Erreur lors de la récupération des utilisateurs', 'error');
        } finally {
            setLoading(false);
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
                console.error('Error deleting user:', error);
                showSnackbar('Erreur lors de la suppression', 'error');
            }
        }
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };
    
    const handleBack = () => {
        navigate('/');
    };

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
            console.error('Error saving user:', error);
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
        const matchesSearch = searchQuery === '' || 
            user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.mail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getRoleName(user.role).toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.tel.includes(searchQuery);
            
        const matchesRole = roleFilter === null || user.role === roleFilter;
            
        return matchesSearch && matchesRole;
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
                    aValue = a.role;
                    bValue = b.role;
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

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = sortData(filteredUsers);
    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const roleStats = users.reduce((acc: { [key: number]: number }, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});

    const getRoleBadgeColor = (role: number) => {
        switch(role) {
            case ROLES.ADMIN:
                return theme.palette.secondary.main;
            case ROLES.DIFFUSEUR:
                return theme.palette.info.main;
            case ROLES.COLLECTEUR:
                return theme.palette.success.main;
            case ROLES.BOTH:
                return theme.palette.warning.main;
            default:
                return theme.palette.grey[500];
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                <VerifiedUserIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        color: theme.palette.primary.main, 
                                        fontWeight: 'bold',
                                        mb: 0.5 
                                    }}
                                >
                                    Gestion des Utilisateurs
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Administrez les comptes utilisateurs de la plateforme
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                borderRadius: '24px',
                                px: 2
                            }}
                        >
                            Retour au tableau de bord
                        </Button>
                    </Box>
                </Paper>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid xs={12} sm={6} md={3}>
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
                                    bgcolor: theme.palette.grey[500],
                                    width: '100%'
                                }}
                            />
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            bgcolor: alpha(theme.palette.grey[500], 0.1),
                                            borderRadius: '50%',
                                            p: 1,
                                            mr: 2
                                        }}
                                    >
                                        <PersonIcon sx={{ color: theme.palette.grey[700] }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {users.filter(u => u.role === ROLES.USER).length}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Utilisateurs standards
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
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
                                    bgcolor: theme.palette.info.main,
                                    width: '100%'
                                }}
                            />
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                            borderRadius: '50%',
                                            p: 1,
                                            mr: 2
                                        }}
                                    >
                                        <StorefrontIcon sx={{ color: theme.palette.info.main }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {users.filter(u => u.role === ROLES.DIFFUSEUR).length}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Diffuseurs
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
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
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            borderRadius: '50%',
                                            p: 1,
                                            mr: 2
                                        }}
                                    >
                                        <LocalShippingIcon sx={{ color: theme.palette.success.main }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {users.filter(u => u.role === ROLES.COLLECTEUR).length}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Collecteurs
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
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
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                            borderRadius: '50%',
                                            p: 1,
                                            mr: 2
                                        }}
                                    >
                                        <AdminPanelSettingsIcon sx={{ color: theme.palette.secondary.main }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {users.filter(u => u.role === ROLES.ADMIN).length}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Administrateurs
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 2,
                        overflow: 'visible',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <Box 
                        sx={{ 
                            p: 2, 
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'stretch' : 'center',
                            gap: isMobile ? 2 : 0
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'stretch' : 'center',
                            gap: 2
                        }}>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Rechercher un utilisateur..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                fullWidth={isMobile}
                                sx={{ width: isMobile ? '100%' : 300 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl 
                                size="small" 
                                variant="outlined" 
                                sx={{ 
                                    width: isMobile ? '100%' : 220,
                                }}
                            >
                                <InputLabel>Filtrer par rôle</InputLabel>
                                <Select
                                    value={roleFilter === null ? '' : roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value === '' ? null : Number(e.target.value))}
                                    label="Filtrer par rôle"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon fontSize="small" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="">Tous les rôles</MenuItem>
                                    <MenuItem value={ROLES.USER}>Utilisateurs</MenuItem>
                                    <MenuItem value={ROLES.ADMIN}>Administrateurs</MenuItem>
                                    <MenuItem value={ROLES.DIFFUSEUR}>Diffuseurs</MenuItem>
                                    <MenuItem value={ROLES.COLLECTEUR}>Collecteurs</MenuItem>
                                    <MenuItem value={ROLES.BOTH}>Diffuseurs/Collecteurs</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            flexDirection: isMobile ? 'column' : 'row'
                        }}>
                            <Button
                                variant="outlined"
                                startIcon={<EmailIcon />}
                                onClick={() => setContactDialogOpen(true)}
                                fullWidth={isMobile}
                                sx={{
                                    borderRadius: '8px',
                                }}
                            >
                                Contact multiple
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<PersonAddIcon />}
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
                                fullWidth={isMobile}
                                sx={{
                                    borderRadius: '8px',
                                    boxShadow: 2
                                }}
                            >
                                Ajouter un utilisateur
                            </Button>
                        </Box>
                    </Box>

                    <Divider />
                    
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell 
                                        onClick={() => handleSort('nom')} 
                                        sx={{ 
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        Nom {sortConfig.key === 'nom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('prenom')} 
                                        sx={{ 
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        Prénom {sortConfig.key === 'prenom' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('username')} 
                                        sx={{ 
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        Identifiant {sortConfig.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('mail')} 
                                        sx={{ 
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        Email {sortConfig.key === 'mail' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('tel')} 
                                        sx={{ 
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        Téléphone {sortConfig.key === 'tel' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('role')} 
                                        sx={{ 
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        Rôle {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell 
                                        align="center"
                                        sx={{ 
                                            fontWeight: 'bold',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((user) => (
                                    <TableRow 
                                        key={user.id}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                bgcolor: alpha(theme.palette.action.hover, 0.05),
                                            },
                                            '&:last-child td, &:last-child th': {
                                                border: 0,
                                            },
                                        }}
                                    >
                                        <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar 
                                                    sx={{ 
                                                        bgcolor: alpha(getRoleColor(user.role), 0.15),
                                                        color: getRoleColor(user.role),
                                                        mr: 1.5,
                                                        width: 36, 
                                                        height: 36
                                                    }}
                                                >
                                                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                                                </Avatar>
                                                <Typography fontWeight="medium">{user.nom}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.prenom}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.mail}</TableCell>
                                        <TableCell>{user.tel}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={getRoleIcon(user.role)}
                                                label={getRoleName(user.role)}
                                                size="small"
                                                sx={{ 
                                                    bgcolor: alpha(getRoleBadgeColor(user.role), 0.1),
                                                    color: getRoleBadgeColor(user.role),
                                                    fontWeight: 'medium',
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                <Tooltip title="Modifier">
                                                    <IconButton 
                                                        onClick={() => handleEdit(user)}
                                                        size="small"
                                                        sx={{ 
                                                            color: theme.palette.primary.main,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.2)
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Supprimer">
                                                    <IconButton 
                                                        onClick={() => handleDeleteClick(user.id)}
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
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {paginatedData.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                Aucun utilisateur trouvé avec ces critères
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <Divider />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                        <TablePagination
                            component="div"
                            count={filteredUsers.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Lignes par page :"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                        />
                    </Box>
                </Card>
            </Container>
            
            {/* Formulaire d'ajout/modification */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
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
                        {selectedUser ? (
                            <>
                                <EditIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    Modifier l'utilisateur
                                </Typography>
                            </>
                        ) : (
                            <>
                                <PersonAddIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    Ajouter un utilisateur
                                </Typography>
                            </>
                        )}
                    </Box>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers sx={{ py: 3 }}>
                        <Grid container spacing={3}>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    label="Nom"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    label="Prénom"
                                    value={formData.prenom}
                                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    label="Nom d'utilisateur"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <FormControl fullWidth margin="dense" variant="outlined">
                                    <InputLabel>Rôle</InputLabel>
                                    <Select
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: Number(e.target.value)})}
                                        label="Rôle"
                                        required
                                    >
                                        <MenuItem value={ROLES.USER}>Utilisateur</MenuItem>
                                        <MenuItem value={ROLES.ADMIN}>Administrateur</MenuItem>
                                        <MenuItem value={ROLES.DIFFUSEUR}>Diffuseur</MenuItem>
                                        <MenuItem value={ROLES.COLLECTEUR}>Collecteur</MenuItem>
                                        <MenuItem value={ROLES.BOTH}>Diffuseur/Collecteur</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    label="Adresse email"
                                    value={formData.mail}
                                    onChange={(e) => setFormData({...formData, mail: e.target.value})}
                                    fullWidth
                                    required
                                    type="email"
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    label="Téléphone"
                                    value={formData.tel}
                                    onChange={(e) => setFormData({...formData, tel: e.target.value})}
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    label="Nombre de prolongations"
                                    type="number"
                                    value={formData.nbProlong}
                                    onChange={(e) => setFormData({...formData, nbProlong: Number(e.target.value)})}
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    label="Adresse postale"
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>
                            {!selectedUser && (
                                <Grid xs={12}>
                                    <TextField
                                        label="Mot de passe"
                                        value={formData.mdp}
                                        onChange={(e) => setFormData({...formData, mdp: e.target.value})}
                                        fullWidth
                                        required
                                        type="password"
                                        variant="outlined"
                                        margin="dense"
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                        <Button 
                            onClick={handleCloseDialog} 
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            startIcon={selectedUser ? <EditIcon /> : <PersonAddIcon />}
                            sx={{ borderRadius: '8px', boxShadow: 2 }}
                        >
                            {selectedUser ? 'Mettre à jour' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Dialog de suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
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
                        Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)} 
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        variant="contained" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: '8px', boxShadow: 2 }}
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de contact multiple */}
            <Dialog
                open={contactDialogOpen}
                onClose={() => setContactDialogOpen(false)}
                maxWidth="md"
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
                        <EmailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" component="div" fontWeight="bold">
                            Contacter plusieurs utilisateurs
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Sélectionnez les utilisateurs que vous souhaitez contacter. 
                        Les adresses email seront copiées dans le presse-papier.
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedEmails.length > 0 && selectedEmails.length < filteredUsers.length}
                                            checked={selectedEmails.length > 0 && selectedEmails.length === filteredUsers.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedEmails(filteredUsers.map(u => u.id));
                                                } else {
                                                    setSelectedEmails([]);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Prénom</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Rôle</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow 
                                        key={user.id}
                                        hover
                                        selected={selectedEmails.includes(user.id)}
                                    >
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
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={getRoleName(user.role)}
                                                sx={{ 
                                                    bgcolor: alpha(getRoleBadgeColor(user.role), 0.1),
                                                    color: getRoleBadgeColor(user.role),
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                        {selectedEmails.length} utilisateur{selectedEmails.length > 1 ? 's' : ''} sélectionné{selectedEmails.length > 1 ? 's' : ''}
                    </Typography>
                    <Button 
                        onClick={() => setContactDialogOpen(false)} 
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleCopyEmails} 
                        variant="contained" 
                        disabled={selectedEmails.length === 0}
                        startIcon={<EmailIcon />}
                        sx={{ borderRadius: '8px', boxShadow: 2 }}
                    >
                        Copier les emails
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alerte de succès/erreur */}
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
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default AdminUserPage;