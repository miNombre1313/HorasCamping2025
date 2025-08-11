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
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f4] to-[#e0e7ff] flex items-center justify-center text-center px-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-xl w-full flex flex-col items-center animate-fade-in">
        <img
          src="/img/logo-camping.png"
          alt="Camping El Pla de Mar"
          className="w-32 h-auto mb-4 animate-fade-zoom"
        />

        <h1 className="text-4xl md:text-5xl font-bold text-[#002c54] mb-4" style={{ fontFamily: 'Merriweather' }}>
          Torneo de Petanca
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6" style={{ fontFamily: 'Poppins' }}>
          Bienvenido al organizador digital del torneo de las horas de petanca del "Camping El Pla de Mar".
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            onClick={inicio}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transform transition-all duration-300 hover:bg-green-700 hover:scale-110 hover:shadow-xl"
            style={{ fontFamily: 'Poppins' }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={registro}
            className="bg-[#002c54] text-white px-6 py-3 rounded-lg font-semibold shadow-md transform transition-all duration-300 hover:bg-[#004080] hover:scale-110 hover:shadow-xl"
            style={{ fontFamily: 'Poppins' }}
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}

