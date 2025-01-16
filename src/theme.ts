import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#369828',
        },
        secondary: {
            main: '#41bf56',
        },
        background: {
            default: 'rgba(28,28,28,0.89)',
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
        },
    },
});

export default theme;