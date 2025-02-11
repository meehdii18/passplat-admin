import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#369828',
        },
        secondary: {
            main: '#AECB36',
        },
        background: {
            default: 'rgba(255,255,255,0.89)',
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
        },
    },
});

export default theme;