import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
} from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const Connexion: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        
        try {
            const response = await authService.login(email, password);
            
            if (response && response.role === 2) {
                const token = btoa(JSON.stringify({
                    id: response.id,
                    prenom: response.prenom,
                    nom: response.nom,
                    username: response.username,
                    role: response.role
                }));
                
                login(token);
                navigate('/');
            } else {
                setError('Accès non autorisé');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setError('Identifiants incorrects');
                } else {
                    setError('Erreur interne, veuillez réessayer plus tard');
                }
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ textAlign: 'center' }}>
                <img 
                    src="/logo-passplat.png" 
                    alt="Logo Passplat" 
                    style={{ width: '200px', height: 'auto' }}
                />
            </Box>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h3" align="center">
                        Connexion
                    </Typography>
                    <Typography component="h1" variant="subtitle1" align="center">
                        Panneau administrateur Passplat
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresse email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Se connecter
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Connexion;