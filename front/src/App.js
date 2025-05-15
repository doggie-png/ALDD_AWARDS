import { Routes, Route } from "react-router-dom"
import ALDD from "./ALDD.jsx"
import Perfil from "./Perfil.jsx"
import Votaciones from "./Votaciones.jsx"
import EditarPerfil from "./EditarPerfil.jsx"
import Categorias from "./Categorias.jsx"

function App() {
  return (
      <Routes>
        <Route path="/" element={ <ALDD /> } />
        <Route path="/Perfil" element={ <Perfil /> } />
        <Route path="/Votaciones" element={ <Votaciones /> } />
        <Route path="/EditarPerfil" element={ <EditarPerfil /> } />
        <Route path="/Categorias" element={ <Categorias /> } />
      </Routes>
  );
}

export default App;
