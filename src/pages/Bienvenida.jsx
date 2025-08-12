// src/pages/Bienvenida.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Bienvenida() {
  const navigate = useNavigate();

  const inicio = () => {
    Swal.fire({
      title: '¡Bienvenido!',
      text: 'Primero debes iniciar sesión para continuar.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    }).then(() => navigate('/login'));
  };

  const registro = () => {
    Swal.fire({
      title: '¡Bienvenido!',
      text: 'Primero debes registrarte para continuar.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    }).then(() => navigate('/registro'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 bg-gradient-to-br from-[#fef9f4] to-[#e0e7ff]">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-xl w-full flex flex-col items-center">
        <img
          src="/img/logo-camping.png"
          alt="Camping El Pla de Mar"
          className="w-32 h-auto mb-4"
        />

        <h1 className="text-4xl md:text-5xl font-bold text-[#002c54] mb-4">
          Torneo de Petanca
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Bienvenido al organizador digital del torneo de las horas de petanca del "Camping El Pla de Mar".
        </p>

        <div className="flex flex-col md:flex-row items-stretch gap-4 w-full">
          <button
            onClick={inicio}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition hover:bg-green-700 hover:shadow-xl"
          >
            Iniciar Sesión
          </button>

          <button
            onClick={registro}
            className="flex-1 bg-[#002c54] text-white px-6 py-3 rounded-lg font-semibold shadow-md transition hover:bg-[#004080] hover:shadow-xl"
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}


