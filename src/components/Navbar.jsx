import React from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Navbar() {
  const { usuario } = useAuth() || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('usuarioActivo');
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        confirmButtonText: 'OK'
      });
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Swal.fire('Error', 'No se pudo cerrar la sesión', 'error');
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <span className="font-bold">🏆 Torneo Petanca</span>

      <div className="flex items-center gap-4">
        {usuario && <span className="text-sm">👤 {usuario.email}</span>}
        {usuario && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
