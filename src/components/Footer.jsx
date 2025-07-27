// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} Desarrollado por <span className="font-semibold">Susana Ros Sastre</span> — Todos los derechos reservados.
      </p>
    </footer>
  );
}
