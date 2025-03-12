import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { 
    Box,
    CircularProgress, 
    Typography,
    Button
} from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
import DownloadIcon from '@mui/icons-material/Download';
import theme from "../../theme.ts";
import 'chartjs-adapter-date-fns';


ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);


const GrapheEmprunts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<ChartJS>(null);

    useEffect(() => {
        const fetchEmprunts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/emprunt/getAll");
                const emprunts = response.data;

                // Transformation des données, on associe un nombre total d'emprunts chaque date
                const empruntsRefactored = emprunts.reduce((acc: { [x: string]: any; }, curr: { dateEmprunt: string | number | Date; quantite: any; }) => {
                    const date = new Date(curr.dateEmprunt).toISOString().split("T")[0]; // Format YYYY-MM-DD
                    acc[date] = (acc[date] || 0) + curr.quantite;
                    return acc;
                }, {});

                const dates = Object.keys(empruntsRefactored).sort(); // Trier les dates
                const nbEmprunts = dates.map((date) => empruntsRefactored[date]); // Tableau de nombres d'emprunts triés par date

                setData({
                    labels: dates,
                    datasets: [
                        {
                            label: "Nombre d'emprunts par jour",
                            data: nbEmprunts,
                            borderColor: theme.palette.secondary.main,
                        },
                    ],
                });
            } catch (err) {
                if (axios.isAxiosError(err)) { // On spécifie qu'il s'agit d'erreurs axios
                    if (err.response) {
                        if (err.response.status >= 500) {
                            setError('Erreur interne, veuillez réessayer plus tard');
                        } else {
                            setError('Serveur inaccessible ou indisponible');
                        }
                    } else if (err.request) {
                        setError('Impossible de contacter le serveur, veuillez vérifier votre réseau');
                    } else {
                        setError('Erreur interne, veuillez réessayer plus tard');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEmprunts();
    }, []);

    const handleDownload = () => {
        const chart = chartRef.current;
        
        if (chart && chart.canvas) {
            try {
                const canvas = chart.canvas;
                chart.update();
                const link = document.createElement('a');
                link.download = `graphique-emprunts-${new Date().toISOString().split('T')[0]}.png`;                
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                link.href = dataUrl;
                link.click();                
            } catch (error) {
                console.error('Erreur lors du téléchargement:', error);
            }
        } else {
            console.error('La référence au graphique est null');
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
            }}>
                <Typography variant="h4" color={theme.palette.primary.main}>
                    Évolution des emprunts au fil du temps
                </Typography>
                {data && (
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                    >
                        Télécharger
                    </Button>
                )}
            </Box>
    
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {data && (  
                <Line
                    ref={chartRef}
                    data={data}
                    redraw={true}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                                labels: {
                                    color: theme.palette.secondary.main,
                                }
                            },
                        },
                        scales : {
                            x: {
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        day: 'dd MMM yyyy', // Format for x-axis labels
                                    },
                                },
                            },
                            y: {
                                ticks: {
                                    callback: function(value) {
                                        return Number.isInteger(value) ? value : null; // Afficher uniquement les valeurs entières de l'axe y
                                    },
                                },
                            },
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default GrapheEmprunts;
