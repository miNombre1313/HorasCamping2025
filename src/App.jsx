import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida';
import Configuracion from './pages/Configuracion';
import Rondas from './pages/Rondas';
import Clasificacion from './pages/Clasificacion';
import PartidasGuardadas from './pages/PartidasGuardadas'; 
import ModificarNombres from './pages/ModificarNombres';
import Resumen from './pages/Resumen';
import LayoutConFooter from './components/LayoutConFooter';

function App() {
  return (
    <Routes>
      <Route element={<LayoutConFooter />}>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/rondas" element={<Rondas />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/partidasguardadas" element={<PartidasGuardadas />} /> 
        <Route path="/modificarnombres" element={<ModificarNombres />} />
        <Route path="/resumen" element={<Resumen />} />
      </Route>
    </Routes>
  );
}

export default App;

