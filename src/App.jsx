// src/App.jsx
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
import Registro from './pages/Registro';
import Login from './pages/Login';
import PerfilMaster from './pages/PerfilMaster';
import RutaProtegida from './components/RutaProtegida';

function App() {
  return (
    <Routes>
      {/* Páginas con layout */}
      <Route element={<LayoutConFooter />}>
        <Route path="/" element={<Bienvenida />} />

        {/* 🔒 Protegidas */}
        <Route
          path="/configuracion"
          element={
            <RutaProtegida>
              <Configuracion />
            </RutaProtegida>
          }
        />
        <Route
          path="/rondas"
          element={
            <RutaProtegida>
              <Rondas />
            </RutaProtegida>
          }
        />
        <Route
          path="/clasificacion"
          element={
            <RutaProtegida>
              <Clasificacion />
            </RutaProtegida>
          }
        />
        <Route
          path="/partidasguardadas"
          element={
            <RutaProtegida>
              <PartidasGuardadas />
            </RutaProtegida>
          }
        />
        <Route
          path="/modificarnombres"
          element={
            <RutaProtegida>
              <ModificarNombres />
            </RutaProtegida>
          }
        />
        <Route
          path="/resumen"
          element={
            <RutaProtegida>
              <Resumen />
            </RutaProtegida>
          }
        />
        <Route
          path="/perfil-master"
          element={
            <RutaProtegida soloMaster>
              <PerfilMaster />
            </RutaProtegida>
          }
        />
      </Route>

      {/* Páginas sin layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  );
}

export default App;


