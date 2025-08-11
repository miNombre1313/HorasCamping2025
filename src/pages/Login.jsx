import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getDocs,
  query,
  collection,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import db from '../firebaseConfig';

export default function Login() {
  const [telefono, setTelefono] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!telefono || !clave) {
      Swal.fire('Error', 'Debes rellenar todos los campos', 'error');
      return;
    }

    try {
      const q = query(collection(db, 'registros'), where('correo', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Swal.fire('Error', 'Usuario no encontrado', 'error');
        return;
      }

      const userDoc = snapshot.docs[0];
      const data = userDoc.data();

      if (data.clave !== clave) {
        Swal.fire('Error', 'Clave incorrecta', 'error');
        return;
      }

      const esMaster = data.esMaster === true;

      if (!esMaster) {
        let primerAcceso = data.primerAcceso;

        if (!primerAcceso) {
          const ahora = new Date();
          const expiracion = new Date(ahora);
          expiracion.setDate(expiracion.getDate() + 3);

          // Actualiza el documento
          await updateDoc(doc(db, 'registros', userDoc.id), {
            primerAcceso: ahora.toISOString(),
            expiracion: expiracion.toISOString(),
          });

          // Vuelve a consultar el documento actualizado
          const updatedSnap = await getDocs(query(collection(db, 'registros'), where('telefono', '==', telefono)));
          const updatedData = updatedSnap.docs[0].data();

          // Sobrescribe la data anterior
          Object.assign(data, updatedData);
        }

        // Ahora data.expiracion está actualizado
        const fechaExpiracion = new Date(data.expiracion);
        if (new Date() > fechaExpiracion) {
          Swal.fire(
            'Acceso caducado',
            'Tu clave ha expirado. Contacta con soporte para renovarla.',
            'warning'
          );
          return;
        }

      }

      // Guardar usuario activo
      localStorage.setItem(
        'usuarioActivo',
        JSON.stringify({
          uid: userDoc.id,
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          master: esMaster,
        })
      );

      // Mensaje de bienvenida personalizado
      let mensajeTiempo = '';

      if (!esMaster) {
        const fechaExpiracion = new Date(data.expiracion);
        const ahora = new Date();
        const diferenciaEnMs = fechaExpiracion - ahora;

        if (diferenciaEnMs <= 24 * 60 * 60 * 1000) {
          const horasRestantes = Math.ceil(diferenciaEnMs / (1000 * 60 * 60));
          mensajeTiempo = `<strong>⚠️ Tu acceso caduca en ${horasRestantes} hora(s)</strong>`;
        } else {
          const diasRestantes = Math.ceil(diferenciaEnMs / (1000 * 60 * 60 * 24));
          mensajeTiempo = `Tu acceso es válido durante <strong>${diasRestantes} día(s)</strong> más.`;
        }
      } else {
        mensajeTiempo = `<strong>✅ Tu clave es ilimitada. Nunca perderás el acceso.</strong>`;
      }

      Swal.fire({
        icon: 'success',
        title: `Bienvenido, ${data.nombre}`,
        html: `
          <p>${mensajeTiempo}</p>
          <p>${!esMaster ? 'Después de eso, necesitarás una nueva clave.' : ''}</p>
        `,
        confirmButtonText: 'Continuar',
      }).then(() => {
        navigate('/configuracion');
      });
    } catch (e) {
      console.error('Error al iniciar sesión:', e);
      Swal.fire('Error', 'Algo salió mal al iniciar sesión', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#e0e7ff] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#002c54]">Iniciar sesión</h2>

        <input
          type="tel"
          placeholder="Número de teléfono"
          className="w-full px-4 py-2 border rounded"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <input
          type="password"
          placeholder="Clave de acceso"
          className="w-full px-4 py-2 border rounded"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleLogin}
            className="flex-1 max-w-[160px] bg-[#002c54] text-white px-6 py-2 rounded hover:bg-[#004080] transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 max-w-[160px] bg-gray-200 text-[#002c54] px-6 py-2 rounded hover:bg-gray-300 transition"
          >
            Volver
          </button>
        </div>

        <p className="text-sm text-gray-500">
          ¿No tienes una cuenta?{' '}
          <span
            onClick={() => navigate('/registro')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}




