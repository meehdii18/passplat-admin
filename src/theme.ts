import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#AECB36',
        },
        secondary: {
            main: '#41aebf',
        },
        background: {
            default: '#F4F3F2',
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
        },
    },
});

export default theme;