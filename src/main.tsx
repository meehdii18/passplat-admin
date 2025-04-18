import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import theme from './theme';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <GlobalStyles styles={{ 
                        body: { backgroundColor: theme.palette.background.default },
                        '.MuiContainer-root': {
                            maxWidth: '85% !important', 
                            paddingLeft: '0 !important', 
                            paddingRight: '0 !important',
                        },
                         }} />
                    <AppRoutes /> 
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);