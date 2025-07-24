// src/pages/ModificarNombres.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { actualizarPartidaFirestore } from '../firebaseUtils';

export default function ModificarNombres() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState([]);
  const [rondas, setRondas] = useState([]);
  const partidaId = localStorage.getItem('partidaId');

  useEffect(() => {
    const nombresLocal = JSON.parse(localStorage.getItem('nombresEquipos')) || [];
    const rondasLocal = JSON.parse(localStorage.getItem('rondas')) || [];
    setNombres(nombresLocal);
    setRondas(rondasLocal);
  }, []);

  const actualizarNombre = (idx, valor) => {
    const nuevos = [...nombres];
    nuevos[idx] = valor;
    setNombres(nuevos);
  };

  const guardarCambios = async () => {
    const nombresOriginales = JSON.parse(localStorage.getItem('nombresEquipos')) || [];

    let nuevasRondasPlanas = [];

    if (Array.isArray(rondas[0])) {
      // ✅ Caso: rondas agrupadas
      nuevasRondasPlanas = rondas.flatMap((ronda, idx) =>
        ronda.map((enf) => ({
          ...enf,
          equipoA: nombresOriginales.includes(enf.equipoA)
            ? nombres[nombresOriginales.indexOf(enf.equipoA)]
            : enf.equipoA,
          equipoB: nombresOriginales.includes(enf.equipoB)
            ? nombres[nombresOriginales.indexOf(enf.equipoB)]
            : enf.equipoB,
          ronda: idx + 1,
        }))
      );
    } else {
      // ✅ Caso: rondas ya planas
      nuevasRondasPlanas = rondas.map((enf) => ({
        ...enf,
        equipoA: nombresOriginales.includes(enf.equipoA)
          ? nombres[nombresOriginales.indexOf(enf.equipoA)]
          : enf.equipoA,
        equipoB: nombresOriginales.includes(enf.equipoB)
          ? nombres[nombresOriginales.indexOf(enf.equipoB)]
          : enf.equipoB,
      }));
    }

    localStorage.setItem('nombresEquipos', JSON.stringify(nombres));
    localStorage.setItem('rondas', JSON.stringify(nuevasRondasPlanas));

    if (partidaId) {
      const datos = {
        fecha: new Date().toISOString(),
        equipos: parseInt(localStorage.getItem('numEquipos')),
        pistas: parseInt(localStorage.getItem('numPistas')),
        nombresEquipos: nombres,
        rondas: nuevasRondasPlanas,
      };

      try {
        await actualizarPartidaFirestore(partidaId, datos);
        Swal.fire('Actualizado', 'Nombres actualizados en la partida', 'success').then(() => {
          navigate('/rondas');
        });
      } catch (error) {
        Swal.fire('Error', 'No se pudo guardar en Firestore', 'error');
      }
    } else {
      Swal.fire('Guardado local', 'Nombres actualizados localmente', 'success').then(() => {
        navigate('/rondas');
      });
    }
  };



  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Modificar Nombres de Equipos</h2>

      <ul className="space-y-2 mb-6">
        {nombres.map((nombre, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <span className="w-6">{idx + 1}.</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => actualizarNombre(idx, e.target.value)}
              className="border p-1 rounded w-full"
            />
          </li>
        ))}
      </ul>

      <div className="flex gap-4">
        <button
          onClick={guardarCambios}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar y Volver
        </button>
        <button
          onClick={() => navigate('/rondas')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}


