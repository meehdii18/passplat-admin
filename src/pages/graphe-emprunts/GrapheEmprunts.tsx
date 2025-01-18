import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from "chart.js";
import theme from "../../theme.ts";
import 'chartjs-adapter-date-fns';


ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);


const GrapheEmprunts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" color={theme.palette.primary.main} gutterBottom>
                Évolution des emprunts au fil du temps
            </Typography>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {data && (
                <Line
                    data={data}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                                labels: {
                                    color: theme.palette.primary.main,
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
