// src/components/RutaProtegida.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function RutaProtegida({ children, soloMaster = false }) {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const local = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');

      setIsAuthed(!!user);

      // Acepta cualquiera de las dos banderas por compatibilidad,
      // pero estandariza a `master` en tu flujo de login.
      setIsMaster(Boolean(local?.master || local?.esMaster));

      setChecking(false);
    });

    return () => unsub();
  }, []);

  if (checking) {
    // Loader minimalista mientras Firebase restaura la sesión
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Cargando…
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (soloMaster && !isMaster) {
    return <Navigate to="/" replace />;
  }

  return children;
}


