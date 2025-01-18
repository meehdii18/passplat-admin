import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import theme from "./theme.ts";
import {Button} from "@mui/material";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <div>
                <p style={{color: theme.palette.primary.main}}>↓ Boutons temporaires pour naviguer vers les pages ↓</p>

                <Button variant="contained" onClick={() => window.location.href = '/statstotales'}>Stats totales</Button>
                <Button variant="contained" onClick={() => window.location.href = '/grapheemprunts'}>Graphe emprunts</Button>
                <Button variant="contained" onClick={() => window.location.href = '/statsdiffuseur'}>Stats diffuseur</Button>
                <Button variant="contained" onClick={() => window.location.href = '/statsempruntsperiode'}>Stats emprunts période</Button>
            </div>
        </>
    )
}

export default App
