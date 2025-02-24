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
interface LoginResponse {
    id: number;
    mail: string;
    username: string;
    role: number;
}

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
            const response = await axios.post<LoginResponse>('http://localhost:8080/account/loginAdmin', { 
                email, 
                password 
            });
            
            if (response.data && response.data.role === 2) {
                const token = btoa(JSON.stringify({
                    id: response.data.id,
                    mail: response.data.mail,
                    username: response.data.username,
                    role: response.data.role
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
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center">
                        Connexion
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