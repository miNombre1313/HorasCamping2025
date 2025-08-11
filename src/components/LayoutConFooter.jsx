// src/components/LayoutConFooter.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';  // 👈 asegúrate de que esta ruta es correcta
import Footer from './Footer';

export default function LayoutConFooter() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar /> {/* 👈 Añadimos el navbar aquí */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

