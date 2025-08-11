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
import RegisterWithEmail from './pages/RegisterWithEmail';
import LoginWithEmail from './pages/LoginWithEmail';
import PerfilMaster from './pages/PerfilMaster';
import RutaProtegida from './components/RutaProtegida';

function App() {
  return (
    <Routes>
      {/* Páginas que SÍ llevan Layout con footer */}
      <Route element={<LayoutConFooter />}>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/rondas" element={<Rondas />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/partidasguardadas" element={<PartidasGuardadas />} />
        <Route path="/modificarnombres" element={<ModificarNombres />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/perfil-master" element={<PerfilMaster />} />
        <Route path="/configuracion" element={
          <RutaProtegida>
            <Configuracion />
          </RutaProtegida>
        } />

        <Route path="/rondas" element={
          <RutaProtegida>
            <Rondas />
          </RutaProtegida>
        } />
      </Route>

      {/* Páginas que NO llevan Layout con footer */}
      <Route path="/login" element={<LoginWithEmail />} />
      <Route path="/registro" element={<RegisterWithEmail />} />
    </Routes>
  );
}

export default App;

