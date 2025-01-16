import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#44e8b6',
        },
        secondary: {
            main: '#41bf56',
        },
        background: {
            default: 'rgba(27,27,27,0.89)',
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
        },
    },
});

export default theme;