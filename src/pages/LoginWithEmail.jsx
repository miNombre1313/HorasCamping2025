import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDocs, query, collection, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginWithEmail() {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [password, setPassword] = useState('');
  const [isMaster, setIsMaster] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate();

  const handleCorreoChange = async (e) => {
    const value = e.target.value;
    setEmail(value);

    // Consultar Firestore para ver si el correo es master
    const q = query(collection(db, 'registros'), where('correo', '==', value));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      setIsMaster(data.esMaster === true);
    } else {
      setIsMaster(false);
    }
  };

  const handleLogin = async () => {
    if (!email || (isMaster ? !clave : !password)) {
      Swal.fire('Error', 'Debes rellenar todos los campos', 'error');
      return;
    }

    try {
      if (isMaster) {
        // Buscar el usuario por correo
        const userQuery = query(collection(db, 'registros'), where('correo', '==', email));
        const userSnap = await getDocs(userQuery);

        if (userSnap.empty) {
          Swal.fire('Error', 'No se encontró información del usuario en Firestore', 'error');
          return;
        }

        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();

        if (userData.clave !== clave) {
          Swal.fire('Error', 'Clave incorrecta', 'error');
          return;
        }

        // Iniciar sesión con contraseña vacía si es master (se espera que ya tenga cuenta)
        const fakePassword = 'master_placeholder'; // Evita el bloqueo de Firebase
        await signInWithEmailAndPassword(auth, email, fakePassword).catch(() => {});

        localStorage.setItem('usuarioActivo', JSON.stringify({
          uid: userDoc.id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.correo,
          telefono: userData.telefono,
          master: true,
        }));

        Swal.fire({
          icon: 'success',
          title: `Bienvenido, ${userData.nombre}`,
          html: '<strong>Acceso como MASTER</strong>',
          confirmButtonText: 'Continuar'
        }).then(() => {
          navigate('/configuracion');
        });

      } else {
        // Usuario normal: iniciar sesión con email y password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userQuery = query(collection(db, 'registros'), where('correo', '==', email));
        const userSnap = await getDocs(userQuery);

        if (userSnap.empty) {
          Swal.fire('Error', 'No se encontró información del usuario en Firestore', 'error');
          return;
        }

        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();

        localStorage.setItem('usuarioActivo', JSON.stringify({
          uid: userDoc.id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.correo,
          telefono: userData.telefono,
          master: false,
        }));

        Swal.fire({
          icon: 'success',
          title: `Bienvenido, ${userData.nombre}`,
          confirmButtonText: 'Continuar'
        }).then(() => {
          navigate('/configuracion');
        });
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error.code, error.message);
      Swal.fire('Error al iniciar sesión', error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f4] to-[#e0e7ff] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#002c54]">Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={handleCorreoChange}
        />

        {/* Campo CLAVE para master */}
        {isMaster ? (
          <div className="relative">
            <input
              type={mostrarClave ? 'text' : 'password'}
              placeholder="Clave"
              className="w-full px-4 py-2 border rounded pr-10"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
            <div
              className="absolute right-2 top-2 cursor-pointer text-gray-500"
              onClick={() => setMostrarClave(!mostrarClave)}
            >
              {mostrarClave ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        ) : (
          // Campo CONTRASEÑA para usuarios normales
          <div className="relative">
            <input
              type={mostrarPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute right-2 top-2 cursor-pointer text-gray-500"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        )}

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





