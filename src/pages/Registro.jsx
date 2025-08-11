// src/pages/Registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import db from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    clave: '' // solo se usará si es master
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const esMaster = formData.telefono === '635480407'; // Cambia este número por el del master

  const generarClave = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let clave = '';
    for (let i = 0; i < 6; i++) {
      clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return clave;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const claveFinal = esMaster ? formData.clave : generarClave();

    if (esMaster && !claveFinal) {
      Swal.fire('Error', 'Debes escribir una clave para el usuario master', 'error');
      return;
    }

    try {
      await setDoc(doc(db, 'registros', `${formData.telefono}_${formData.apellido}`), {
        ...formData,
        clave: claveFinal,
        primerAcceso: null,
        expiracion: null,
        creadoEn: serverTimestamp(),
        master: esMaster // útil para validaciones futuras
      });

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        html: `
          <p><strong>Tu clave es: <span style="font-size: 1.2em;">${claveFinal}</span></strong></p>
          ${
            esMaster
              ? `<p>✅ Esta clave no caduca.</p>`
              : `<p>⚠️ Esta clave dura 3 días <u>desde tu primer inicio de sesión</u>.</p>
                 <p>Guárdala bien. No podrás volver a verla.</p>`
          }
        `,
        confirmButtonText: 'Ir a iniciar sesión'
      }).then(() => navigate('/login'));
    } catch (error) {
      console.error('Error al registrar:', error);
      Swal.fire('Error', 'No se pudo registrar. Intenta de nuevo.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#e0e7ff] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#002c54]">Registro</h2>
        <input name="nombre" type="text" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="apellido" type="text" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="telefono" type="tel" placeholder="Número de teléfono" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="correo" type="email" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} className="w-full p-2 border rounded" required />

        {/* Mostrar campo de clave solo si es el teléfono del master */}
        {esMaster && (
          <input
            name="clave"
            type="text"
            placeholder="Clave para el usuario master"
            value={formData.clave}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 max-w-[160px] bg-[#002c54] text-white px-6 py-2 rounded hover:bg-[#004080] transition"
          >
            Registrarse
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 max-w-[160px] bg-gray-200 text-[#002c54] px-6 py-2 rounded hover:bg-gray-300 transition"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}



