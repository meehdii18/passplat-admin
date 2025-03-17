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
    MenuItem,
    Chip,
    Tooltip,
    InputAdornment,
    TablePagination,
    Divider,
    Grid,
    Card,
    Avatar,
    Backdrop,
    CircularProgress,
    useMediaQuery
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import DoneIcon from '@mui/icons-material/Done';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
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
    quantiteRetournee: number;
    dateRenduPrevu: string;
    dateRenduReel: string | null;
    collecteur: DiffuseurCollecteur | null;
}

interface EmpruntFormData {
    id?: number;
    IdUser: number;
    IdContenant: number;
    IdDiffuseur: number;
    dateEmprunt: string;
    quantite: number;
    dateRenduPrevu: string;
    dateRenduReel: string | null;
    IdCollecteur: number;
}

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

const AdminEmpruntPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<Map<number, User>>(new Map());
    const [diffuseurs, setDiffuseurs] = useState<Map<number, DiffuseurCollecteur>>(new Map());
    const [prolongDialogOpen, setProlongDialogOpen] = useState(false);
    const [empruntToProlong, setEmpruntToProlong] = useState<number | null>(null);
    const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
    const [empruntToTerminate, setEmpruntToTerminate] = useState<Emprunt | null>(null);
    const [collecteurs, setCollecteurs] = useState<Map<number, DiffuseurCollecteur>>(new Map());
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'dateEmprunt', direction: 'desc' });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'returned'>('all');
    const [partialReturnDialogOpen, setPartialReturnDialogOpen] = useState(false);
    const [empruntToPartialReturn, setEmpruntToPartialReturn] = useState<Emprunt | null>(null);
    const [partialReturnQuantity, setPartialReturnQuantity] = useState(1);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchEmprunts(), fetchData()]);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const fetchEmprunts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/emprunt/getAll');
            setEmprunts(response.data);
        } catch (error) {
            console.error('Error fetching emprunts:', error);
            showSnackbar('Erreur lors de la récupération des emprunts', 'error');
        }
    };

    const fetchData = async () => {
        try {
            const [usersRes, diffuseursRes, collecteursRes] = await Promise.all([
                axios.get('http://localhost:8080/account/getAll'),
                axios.get('http://localhost:8080/diffuseur/getAll'),
                axios.get('http://localhost:8080/collecteur/getAll')
            ]);
            
            const usersMap: Map<number, User> = new Map(usersRes.data.map((user: User): [number, User] => [user.id, user]));
            const diffuseursMap: Map<number, DiffuseurCollecteur> = new Map(diffuseursRes.data.map((diff: DiffuseurCollecteur): [number, DiffuseurCollecteur] => [diff.id, diff]));
            const collecteursMap: Map<number,DiffuseurCollecteur>  = new Map(collecteursRes.data.map((coll: DiffuseurCollecteur) => [coll.id, coll]));
            
            setUsers(usersMap);
            setDiffuseurs(diffuseursMap);
            setCollecteurs(collecteursMap);
        } catch (error) {
            console.error('Error fetching users:', error);
            showSnackbar('Erreur lors de la récupération des données', 'error');
        }
    };
    
    const getCollecteurs = () => {
        const collecteursArray = Array.from(collecteurs.values()).filter(
            collecteur => collecteur.account.role === 4 || collecteur.account.role === 5
        );
        
        collecteursArray.sort((a, b) => a.nom.localeCompare(b.nom));
        
        return collecteursArray;
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

    const getFilteredEmprunts = () => {
        let filtered = [...emprunts];
        
        // Filtre par statut
        if (statusFilter === 'active') {
            filtered = filtered.filter(emprunt => !emprunt.dateRenduReel);
        } else if (statusFilter === 'returned') {
            filtered = filtered.filter(emprunt => emprunt.dateRenduReel);
        }
        
        // Filtre de recherche
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(emprunt => {
                const fullName = `${emprunt?.user?.prenom} ${emprunt?.user?.nom}`.toLowerCase();
                
                return (
                    fullName.includes(searchLower) ||
                    (emprunt.collecteur?.nom?.toLowerCase() || '').includes(searchLower) ||
                    (emprunt.diffuseur?.nom?.toLowerCase() || '').includes(searchLower) ||
                    (emprunt.contenant?.nom?.toLowerCase() || '').includes(searchLower) ||
                    (new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')).toLowerCase().includes(searchLower) ||
                    (new Date(emprunt.dateRenduPrevu).toLocaleDateString('fr-FR')).toLowerCase().includes(searchLower) ||
                    (emprunt.dateRenduReel && new Date(emprunt.dateRenduReel).toLocaleDateString('fr-FR').toLowerCase().includes(searchLower)) ||
                    (emprunt.quantite.toString()).includes(searchLower) 
                );
            });
        }
        
        return filtered;
    };

    const handleTerminate = (emprunt: Emprunt) => {
        if (isOverdue(emprunt.dateRenduPrevu)) {
            showSnackbar(
                "Impossible de terminer l'emprunt : la date de retour prévue est dépassée. Le contenant appartient désormais à l'utilisateur.",
                'error'
            );
            return;
        }
        
        setEmpruntToTerminate(emprunt);
        setTerminateDialogOpen(true); 
        setFormData({
            ...formData,
            IdUser: emprunt.user.id,
            IdContenant: emprunt.contenant.id,
            IdDiffuseur: emprunt.diffuseur.id,
            quantite: emprunt.quantite,
            IdCollecteur: 0
        });
    };

    const handleTerminateConfirm = async () => {
        if (empruntToTerminate) {
            try {
                const empruntData = {
                    idUser: formData.IdUser,
                    ListeRendu: {
                        [formData.IdContenant]: formData.quantite
                    },
                    idCollecteur: formData.IdCollecteur
                };
                await axios.post('http://localhost:8080/emprunt/finishEmprunt', empruntData);
                showSnackbar('Emprunt terminé avec succès', 'success');
                fetchEmprunts();
            } catch (error) {
                console.error('Error:', error);
                showSnackbar('Erreur lors de la terminaison', 'error');
            }
            setTerminateDialogOpen(false);
            setEmpruntToTerminate(null);
        }
    };

    const sortData = (data: Emprunt[]) => {
        if (!sortConfig.key) return data;
    
        return [...data].sort((a, b) => {
            let aValue: any;
            let bValue: any;
    
            switch (sortConfig.key) {
                case 'id':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'user':
                    aValue = `${a.user?.prenom} ${a.user?.nom}`;
                    bValue = `${b.user?.prenom} ${b.user?.nom}`;
                    break;
                case 'contenant':
                    aValue = a.contenant?.nom;
                    bValue = b.contenant?.nom;
                    break;
                case 'diffuseur':
                    aValue = a.diffuseur?.nom;
                    bValue = b.diffuseur?.nom;
                    break;
                case 'dateEmprunt':
                    aValue = new Date(a.dateEmprunt).getTime();
                    bValue = new Date(b.dateEmprunt).getTime();
                    break;
                case 'quantite':
                    aValue = a.quantite;
                    bValue = b.quantite;
                    break;
                case 'quantiteRetournee':
                    aValue = a.quantiteRetournee;
                    bValue = b.quantiteRetournee;
                    break;
                case 'dateRenduPrevu':
                    aValue = new Date(a.dateRenduPrevu).getTime();
                    bValue = new Date(b.dateRenduPrevu).getTime();
                    break;
                case 'dateRenduReel':
                    aValue = a.dateRenduReel ? new Date(a.dateRenduReel).getTime() : null;
                    bValue = b.dateRenduReel ? new Date(b.dateRenduReel).getTime() : null;
                    break;
                case 'collecteur':
                    aValue = a.collecteur?.nom;
                    bValue = b.collecteur?.nom;
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
    
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Tri et pagination
    const filteredEmprunts = getFilteredEmprunts();
    const sortedEmprunts = sortData(filteredEmprunts);
    const paginatedEmprunts = sortedEmprunts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Pour déterminer si la date prévue est dépassée
    const isOverdue = (datePrevu: string) => {
        const now = new Date();
        const datePrevuObj = new Date(datePrevu);
        return !datePrevu ? false : datePrevuObj < now;
    };

    // Statistiques des emprunts
    const totalEmprunts = filteredEmprunts.length;
    const activeEmprunts = filteredEmprunts.filter(e => !e.dateRenduReel).length;
    const returnedEmprunts = filteredEmprunts.filter(e => e.dateRenduReel).length;
    const overdueEmprunts = filteredEmprunts.filter(e => !e.dateRenduReel && isOverdue(e.dateRenduPrevu)).length;
    const partialReturnedEmprunts = filteredEmprunts.filter(e => 
        !e.dateRenduReel && e.quantiteRetournee > 0 && e.quantiteRetournee < e.quantite
    ).length;
    
    // Formatage des dates
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        });
    };

    const handlePartialReturn = (emprunt: Emprunt) => {
        setEmpruntToPartialReturn(emprunt);
        setPartialReturnQuantity(1);  // Valeur par défaut
        setPartialReturnDialogOpen(true);
        setFormData({
            ...formData,
            IdCollecteur: 0
        });
    };

    const handlePartialReturnConfirm = async () => {
        if (empruntToPartialReturn && formData.IdCollecteur) {
            try {
                await axios.post(
                    'http://localhost:8080/emprunt/retournerContenant',
                    null,
                    {
                        params: {
                            empruntId: empruntToPartialReturn.id,
                            quantite: partialReturnQuantity,
                            collecteurId: formData.IdCollecteur
                        }
                    }
                );
                showSnackbar('Contenants retournés avec succès', 'success');
                fetchEmprunts();
                setPartialReturnDialogOpen(false);
                setEmpruntToPartialReturn(null);
            } catch (error: any) {
                console.error('Error:', error);
                if (error.status === 409 || error?.response?.status === 409) {
                    showSnackbar(
                        "Impossible de faire un retour partiel : la date de retour prévue est dépassée. Le contenant appartient désormais à l'utilisateur.",
                        'error'
                    );
                } else {
                    showSnackbar('Erreur lors du retour des contenants', 'error');
                }
                setPartialReturnDialogOpen(false);
                setEmpruntToPartialReturn(null);
            }
        }
    };

    const getContenantColor = (type: string) => {
        switch(type) {
            case 'S': return theme.palette.info.main;
            case 'M': return theme.palette.warning.main;
            case 'XL': return theme.palette.error.main;
            default: return theme.palette.primary.main;
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
            <Backdrop
                sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
    
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
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    color: theme.palette.primary.main, 
                                    fontWeight: 'bold'
                                }}
                            >
                                Gestion des Emprunts
                            </Typography>
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
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card 
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                height: '100%'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2
                                }}
                            >
                                <Avatar
                                    sx={{ 
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        mr: 2
                                    }}
                                >
                                    <InventoryIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {totalEmprunts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total des emprunts
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card 
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                height: '100%'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2
                                }}
                            >
                                <Avatar
                                    sx={{ 
                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                        color: theme.palette.warning.main,
                                        mr: 2
                                    }}
                                >
                                    <ScheduleIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {activeEmprunts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Emprunts actifs
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card 
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                height: '100%'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2
                                }}
                            >
                                <Avatar
                                    sx={{ 
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        color: theme.palette.success.main,
                                        mr: 2
                                    }}
                                >
                                    <DoneIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {returnedEmprunts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Emprunts rendus
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card 
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                height: '100%'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2
                                }}
                            >
                                <Avatar
                                    sx={{ 
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        color: theme.palette.error.main,
                                        mr: 2
                                    }}
                                >
                                    <HistoryIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {overdueEmprunts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Emprunts en retard
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card 
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                height: '100%'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    p: 2
                                }}
                            >
                                <Avatar
                                    sx={{ 
                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                        color: theme.palette.warning.main,
                                        mr: 2
                                    }}
                                >
                                    <ArrowBackIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {partialReturnedEmprunts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Retours partiels
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
                
                <Paper 
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 2,
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ 
                                minWidth: '240px',
                                bgcolor: 'white',
                                borderRadius: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleNewEmprunt}
                                    sx={{
                                        borderRadius: '24px',
                                        px: 3,
                                        boxShadow: 2
                                    }}
                                >
                                    Nouvel emprunt
                            </Button>
                            <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'white', borderRadius: 1 }}>
                                <InputLabel id="status-filter-label">Statut</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    value={statusFilter}
                                    label="Statut"
                                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'returned')}
                                    startAdornment={
                                        <FilterListIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    }
                                >
                                    <MenuItem value="all">Tous</MenuItem>
                                    <MenuItem value="active">En cours</MenuItem>
                                    <MenuItem value="returned">Rendus</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'white', borderRadius: 1 }}>
                                <InputLabel id="sort-by-label">Trier par</InputLabel>
                                <Select
                                    labelId="sort-by-label"
                                    value={sortConfig.key}
                                    label="Trier par"
                                    onChange={(e) => handleSort(e.target.value)}
                                    startAdornment={
                                        <SortIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                    }
                                    endAdornment={
                                        <Box component="span" sx={{ ml: 0.5, color: theme.palette.text.secondary }}>
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </Box>
                                    }
                                >
                                    <MenuItem value="dateEmprunt">Date d'emprunt</MenuItem>
                                    <MenuItem value="dateRenduPrevu">Date prévue</MenuItem>
                                    <MenuItem value="user">Utilisateur</MenuItem>
                                    <MenuItem value="diffuseur">Diffuseur</MenuItem>
                                    <MenuItem value="contenant">Contenant</MenuItem>
                                    <MenuItem value="quantite">Quantité</MenuItem>
                                    <MenuItem value="quantiteRetournee">Quantité retournée</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
    
                    <TableContainer sx={{ 
                        overflowX: 'auto', 
                        maxWidth: '100%', 
                        '& .MuiTable-root': {
                            width: '100%'  
                        }
                    }}>                        
                    <Table sx={{ width: '100%', minWidth: 850 }} size="small">
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: '13%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
                                        Utilisateur
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '7%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <InventoryIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <StorefrontIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
                                        Diffuseur
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
                                        {isMobile ? 'Emprunt' : 'Date emprunt'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '5%' }}>Qté</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '6%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isMobile ? 'Ret.' : 'Retourné'}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ScheduleIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
                                        {isMobile ? 'Prévue' : 'Date prévue'}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <DoneIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
                                        {isMobile ? 'Rendu' : 'Date rendu'}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocalShippingIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 18 }} />
                                        Collecteur
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                            <TableBody>
                                {paginatedEmprunts.length > 0 ? (
                                    paginatedEmprunts.map((emprunt) => (
                                        <TableRow 
                                            key={emprunt.id}
                                            hover
                                            sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                bgcolor: emprunt.dateRenduReel ? 
                                                    'transparent' : 
                                                    (isOverdue(emprunt.dateRenduPrevu) ? 
                                                        alpha(theme.palette.error.main, 0.05) : 
                                                        'transparent')
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            width: 28, 
                                                            height: 28, 
                                                            bgcolor: theme.palette.primary.main,
                                                            fontSize: '0.85rem',
                                                            mr: 1
                                                        }}
                                                    >
                                                        {emprunt.user?.prenom?.charAt(0)}{emprunt.user?.nom?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {emprunt.user?.prenom} {emprunt.user?.nom}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ID: {emprunt.user?.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={emprunt.contenant?.nom} 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: alpha(getContenantColor(emprunt.contenant?.nom), 0.1),
                                                        color: getContenantColor(emprunt.contenant?.nom),
                                                        fontWeight: 'medium'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={`ID: ${emprunt.diffuseur?.id}`}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <StorefrontIcon 
                                                            fontSize="small" 
                                                            sx={{ 
                                                                mr: 0.5, 
                                                                color: theme.palette.text.secondary,
                                                                fontSize: 16
                                                            }} 
                                                        />
                                                        <Typography variant="body2">
                                                            {emprunt.diffuseur?.nom}
                                                        </Typography>
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {formatDate(emprunt.dateEmprunt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={emprunt.quantite} 
                                                    size="small" 
                                                    sx={{ 
                                                        minWidth: 36,
                                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                        color: theme.palette.secondary.main,
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                            
                                            <TableCell align="center">
                                                <Chip 
                                                    label={emprunt.quantiteRetournee} 
                                                    size="small" 
                                                    sx={{ 
                                                        minWidth: 36,
                                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                        color: theme.palette.warning.main,
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                                {emprunt.quantiteRetournee > 0 && emprunt.quantiteRetournee < emprunt.quantite && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                        Partiel
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            
                                            <TableCell>
                                                <Box sx={{ 
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <Typography 
                                                        variant="body2"
                                                        sx={{ 
                                                            color: !emprunt.dateRenduReel && isOverdue(emprunt.dateRenduPrevu) 
                                                                ? theme.palette.error.main 
                                                                : 'inherit'
                                                        }}
                                                    >
                                                        {formatDate(emprunt.dateRenduPrevu)}
                                                    </Typography>
                                                    {!emprunt.dateRenduReel && isOverdue(emprunt.dateRenduPrevu) && (
                                                        <Tooltip title="En retard">
                                                            <HistoryIcon 
                                                                color="error" 
                                                                sx={{ ml: 0.5, fontSize: 18 }} 
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            
                                            {/* Autres cellules existantes */}
                                            <TableCell>
                                                {emprunt.dateRenduReel ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <DoneIcon 
                                                            color="success" 
                                                            fontSize="small" 
                                                            sx={{ mr: 0.5 }} 
                                                        />
                                                        <Typography variant="body2">
                                                            {formatDate(emprunt.dateRenduReel)}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {emprunt.collecteur ? (
                                                    <Tooltip title={`ID: ${emprunt.collecteur?.id}`}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <LocalShippingIcon 
                                                                fontSize="small" 
                                                                sx={{ 
                                                                    mr: 0.5, 
                                                                    color: theme.palette.text.secondary,
                                                                    fontSize: 16
                                                                }} 
                                                            />
                                                            <Typography variant="body2">
                                                                {emprunt.collecteur?.nom}
                                                            </Typography>
                                                        </Box>
                                                    </Tooltip>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ 
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: 1,
                                                    justifyContent: 'center',
                                                    width: 'fit-content',
                                                    margin: '0 auto'
                                                }}>
                                                    <Tooltip title="Modifier">
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => handleEdit(emprunt)}
                                                            sx={{ 
                                                                color: theme.palette.primary.main,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                '&:hover': {
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                }
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    
                                                    {!emprunt.dateRenduReel && (
                                                        <>
                                                            <Tooltip title="Prolonger">
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={() => handleProlongClick(emprunt.id)}
                                                                    sx={{ 
                                                                        color: theme.palette.info.main,
                                                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.info.main, 0.2),
                                                                        }
                                                                    }}
                                                                >
                                                                    <ScheduleIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={
                                                                isOverdue(emprunt.dateRenduPrevu) 
                                                                    ? "Retour partiel impossible : date dépassée" 
                                                                    : "Retour partiel"
                                                            }>
                                                                <span>
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handlePartialReturn(emprunt)}
                                                                        disabled={isOverdue(emprunt.dateRenduPrevu)}
                                                                        sx={{ 
                                                                            color: theme.palette.warning.main,
                                                                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                                            '&:hover': {
                                                                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                                                                            },
                                                                            '&.Mui-disabled': {
                                                                                bgcolor: alpha(theme.palette.action.disabled, 0.1),
                                                                                color: theme.palette.action.disabled
                                                                            }
                                                                        }}
                                                                    >
                                                                        <ArrowBackIcon fontSize="small" />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                            <Tooltip title={
                                                                isOverdue(emprunt.dateRenduPrevu) 
                                                                    ? "Impossible de terminer : date dépassée" 
                                                                    : "Terminer l'emprunt"
                                                            }>
                                                                <span>
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleTerminate(emprunt)}
                                                                        disabled={isOverdue(emprunt.dateRenduPrevu)}
                                                                        sx={{ 
                                                                            color: theme.palette.success.main,
                                                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                            '&:hover': {
                                                                                bgcolor: alpha(theme.palette.success.main, 0.2),
                                                                            },
                                                                            '&.Mui-disabled': {
                                                                                bgcolor: alpha(theme.palette.action.disabled, 0.1),
                                                                                color: theme.palette.action.disabled
                                                                            }
                                                                        }}
                                                                    >
                                                                        <DoneIcon fontSize="small" />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                {emprunts.length === 0 ? 
                                                    'Aucun emprunt enregistré' : 
                                                    'Aucun résultat correspondant à votre recherche'
                                                }
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={filteredEmprunts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Lignes par page:"
                        labelDisplayedRows={({ from, to, count }) => 
                            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                        }
                    />
                </Paper>
                
                {/* Dialogue de création/édition d'emprunt */}
                <Dialog 
                    open={openDialog} 
                    onClose={() => setOpenDialog(false)}
                    fullWidth
                    maxWidth="md"
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        pb: 1
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {selectedEmprunt ? (
                                <EditIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            ) : (
                                <AddIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            )}
                            <Typography variant="h6" fontWeight="bold">
                                {selectedEmprunt ? 'Modifier l\'emprunt' : 'Nouvel emprunt'}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ pt: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid xs={12} md={6}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel id="user-label">Utilisateur</InputLabel>
                                        <Select
                                            labelId="user-label"
                                            value={formData.IdUser}
                                            onChange={(e) => setFormData({...formData, IdUser: Number(e.target.value)})}
                                            required
                                            label="Utilisateur"
                                            startAdornment={
                                                <PersonIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                            }
                                        >
                                            {Array.from(users.values())
                                                .filter(user => !user.estSupprime)
                                                .sort((a, b) => a.nom.localeCompare(b.nom))
                                                .map(user => (
                                                    <MenuItem key={user.id} value={user.id}>
                                                        {user.prenom} {user.nom}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel id="contenant-label">Contenant</InputLabel>
                                        <Select
                                            labelId="contenant-label"
                                            value={formData.IdContenant}
                                            onChange={(e) => setFormData({...formData, IdContenant: Number(e.target.value)})}
                                            required
                                            label="Contenant"
                                            startAdornment={
                                                <InventoryIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                            }
                                        >
                                            <MenuItem value={1}>XL</MenuItem>
                                            <MenuItem value={2}>M</MenuItem>
                                            <MenuItem value={3}>S</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel id="diffuseur-label">Diffuseur</InputLabel>
                                        <Select
                                            labelId="diffuseur-label"
                                            value={formData.IdDiffuseur}
                                            onChange={(e) => setFormData({...formData, IdDiffuseur: Number(e.target.value)})}
                                            required
                                            label="Diffuseur"
                                            startAdornment={
                                                <StorefrontIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                            }
                                        >
                                            {Array.from(diffuseurs.values())
                                                .filter(diff => diff.account.role === 3 || diff.account.role === 5)
                                                .sort((a, b) => a.nom.localeCompare(b.nom))
                                                .map(diffuseur => (
                                                    <MenuItem key={diffuseur.id} value={diffuseur.id}>
                                                        {diffuseur.nom}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Quantité"
                                        type="number"
                                        value={formData.quantite}
                                        onChange={(e) => setFormData({...formData, quantite: parseInt(e.target.value) || 1})}
                                        required
                                        InputProps={{
                                            inputProps: { min: 1 },
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <InventoryIcon sx={{ color: theme.palette.text.secondary }} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Date d'emprunt"
                                        type="date"
                                        value={formData.dateEmprunt}
                                        onChange={(e) => setFormData({...formData, dateEmprunt: e.target.value})}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarTodayIcon sx={{ color: theme.palette.text.secondary }} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Date de retour prévue"
                                        type="date"
                                        value={formData.dateRenduPrevu}
                                        onChange={(e) => setFormData({...formData, dateRenduPrevu: e.target.value})}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ScheduleIcon sx={{ color: theme.palette.text.secondary }} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                {selectedEmprunt && (
                                    <>
                                        <Grid xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                margin="dense"
                                                label="Date de retour réelle"
                                                type="date"
                                                value={formData.dateRenduReel || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData, 
                                                    dateRenduReel: e.target.value ? e.target.value : null
                                                })}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <DoneIcon sx={{ color: theme.palette.text.secondary }} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <FormControl fullWidth margin="dense">
                                                <InputLabel id="collecteur-label">Collecteur</InputLabel>
                                                <Select
                                                    labelId="collecteur-label"
                                                    value={formData.IdCollecteur}
                                                    onChange={(e) => setFormData({...formData, IdCollecteur: Number(e.target.value)})}
                                                    label="Collecteur"
                                                    startAdornment={
                                                        <LocalShippingIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                                    }
                                                >
                                                    <MenuItem value={0}>Non défini</MenuItem>
                                                    {getCollecteurs().map(collecteur => (
                                                        <MenuItem key={collecteur.id} value={collecteur.id}>
                                                            {collecteur.nom}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button 
                            onClick={() => setOpenDialog(false)}
                            variant="outlined"
                        >
                            Annuler
                        </Button>
                        <Button 
                            onClick={handleSubmit}
                            variant="contained"
                            startIcon={selectedEmprunt ? <EditIcon /> : <AddIcon />}
                        >
                            {selectedEmprunt ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialogue de prolongation */}
                <Dialog 
                    open={prolongDialogOpen} 
                    onClose={() => setProlongDialogOpen(false)}
                    fullWidth
                    maxWidth="xs"
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    <DialogTitle sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                            <Typography variant="h6" fontWeight="medium">
                                Prolonger l'emprunt
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Typography variant="body1">
                            Êtes-vous sûr de vouloir prolonger cet emprunt d'une semaine?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button 
                            onClick={() => setProlongDialogOpen(false)}
                            variant="outlined"
                        >
                            Annuler
                        </Button>
                        <Button 
                            onClick={handleProlongConfirm}
                            variant="contained"
                            color="info"
                            startIcon={<ScheduleIcon />}
                        >
                            Prolonger
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialogue pour terminer un emprunt */}
                <Dialog 
                    open={terminateDialogOpen} 
                    onClose={() => setTerminateDialogOpen(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    <DialogTitle sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DoneIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                            <Typography variant="h6" fontWeight="medium">
                                Terminer l'emprunt
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Veuillez sélectionner le collecteur pour finaliser le retour des contenants:
                        </Typography>
                        
                        {empruntToTerminate && (
                            <Box sx={{ 
                                mb: 3,
                                p: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                borderRadius: 1,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Utilisateur:</b> {empruntToTerminate.user?.prenom} {empruntToTerminate.user?.nom}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Contenant:</b> {empruntToTerminate.contenant?.nom}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Quantité:</b> {empruntToTerminate.quantite}
                                </Typography>
                            </Box>
                        )}
                        
                        <FormControl fullWidth margin="dense" required>
                            <InputLabel id="collecteur-terminate-label">Collecteur</InputLabel>
                            <Select
                                labelId="collecteur-terminate-label"
                                value={formData.IdCollecteur}
                                onChange={(e) => setFormData({...formData, IdCollecteur: Number(e.target.value)})}
                                label="Collecteur"
                                startAdornment={
                                    <LocalShippingIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                }
                            >
                                {getCollecteurs().map(collecteur => (
                                    <MenuItem key={collecteur.id} value={collecteur.id}>
                                        {collecteur.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button 
                            onClick={() => setTerminateDialogOpen(false)}
                            variant="outlined"
                        >
                            Annuler
                        </Button>
                        <Button 
                            onClick={handleTerminateConfirm}
                            variant="contained"
                            color="success"
                            startIcon={<DoneIcon />}
                            disabled={!formData.IdCollecteur}
                        >
                            Confirmer le retour
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialogue pour le retour partiel des contenants */}
                <Dialog 
                    open={partialReturnDialogOpen} 
                    onClose={() => setPartialReturnDialogOpen(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    <DialogTitle sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowBackIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                            <Typography variant="h6" fontWeight="medium">
                                Retour partiel de contenants
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Veuillez spécifier le nombre de contenants à retourner:
                        </Typography>
                        
                        {empruntToPartialReturn && (
                            <Box sx={{ 
                                mb: 3,
                                p: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                borderRadius: 1,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Utilisateur:</b> {empruntToPartialReturn.user?.prenom} {empruntToPartialReturn.user?.nom}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Contenant:</b> {empruntToPartialReturn.contenant?.nom}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Quantité totale empruntée:</b> {empruntToPartialReturn.quantite}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Quantité déjà retournée:</b> {empruntToPartialReturn.quantiteRetournee}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <b>Quantité restante à retourner:</b> {empruntToPartialReturn.quantite - empruntToPartialReturn.quantiteRetournee}
                                </Typography>
                            </Box>
                        )}
                        
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Quantité à retourner"
                            type="number"
                            value={partialReturnQuantity}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (empruntToPartialReturn) {
                                    const maxReturn = empruntToPartialReturn.quantite - empruntToPartialReturn.quantiteRetournee;
                                    if (value > 0 && value <= maxReturn) {
                                        setPartialReturnQuantity(value);
                                    }
                                }
                            }}
                            required
                            InputProps={{
                                inputProps: { 
                                    min: 1, 
                                    max: empruntToPartialReturn ? 
                                        (empruntToPartialReturn.quantite - empruntToPartialReturn.quantiteRetournee) : 1 
                                }
                            }}
                            helperText={empruntToPartialReturn ? 
                                `Doit être entre 1 et ${empruntToPartialReturn.quantite - empruntToPartialReturn.quantiteRetournee}` : 
                                "Veuillez spécifier une quantité valide"}
                        />
                        
                        <FormControl fullWidth margin="dense" required>
                            <InputLabel id="collecteur-partial-return-label">Collecteur</InputLabel>
                            <Select
                                labelId="collecteur-partial-return-label"
                                value={formData.IdCollecteur}
                                onChange={(e) => setFormData({...formData, IdCollecteur: Number(e.target.value)})}
                                label="Collecteur"
                                startAdornment={
                                    <LocalShippingIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                                }
                            >
                                {getCollecteurs().map(collecteur => (
                                    <MenuItem key={collecteur.id} value={collecteur.id}>
                                        {collecteur.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button 
                            onClick={() => setPartialReturnDialogOpen(false)}
                            variant="outlined"
                        >
                            Annuler
                        </Button>
                        <Button 
                            onClick={handlePartialReturnConfirm}
                            variant="contained"
                            color="warning"
                            startIcon={<ArrowBackIcon />}
                            disabled={!formData.IdCollecteur || partialReturnQuantity <= 0 || 
                                (empruntToPartialReturn && partialReturnQuantity > 
                                    (empruntToPartialReturn.quantite - empruntToPartialReturn.quantiteRetournee))}
                        >
                            Confirmer le retour partiel
                        </Button>
                    </DialogActions>
                </Dialog>
                
                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={6000} 
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={() => setSnackbar({...snackbar, open: false})} 
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default AdminEmpruntPage;