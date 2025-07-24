// src/pages/Clasificacion.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function Clasificacion() {
  const [clasificacion, setClasificacion] = useState([]);
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('rondas');
    const clasif = {};
    const historial = {};

    if (data) {
      let rondas = JSON.parse(data);

      // Aplanar si es un array de arrays
      if (Array.isArray(rondas) && Array.isArray(rondas[0])) {
        rondas = rondas.flat();
      }

      rondas.forEach((enf) => {
        const { equipoA, equipoB, resultadoA, resultadoB } = enf;

        if (!clasif[equipoA]) clasif[equipoA] = { nombre: equipoA, jugados: 0, ganados: 0, empatados: 0, perdidos: 0, puntosAFavor: 0, puntosEnContra: 0 };
        if (!clasif[equipoB]) clasif[equipoB] = { nombre: equipoB, jugados: 0, ganados: 0, empatados: 0, perdidos: 0, puntosAFavor: 0, puntosEnContra: 0 };

        if (typeof resultadoA === 'number' && typeof resultadoB === 'number') {
          clasif[equipoA].jugados++;
          clasif[equipoB].jugados++;
          clasif[equipoA].puntosAFavor += resultadoA;
          clasif[equipoA].puntosEnContra += resultadoB;
          clasif[equipoB].puntosAFavor += resultadoB;
          clasif[equipoB].puntosEnContra += resultadoA;

          const key = [equipoA, equipoB].sort().join('-');
          if (!historial[key]) historial[key] = {};

          if (resultadoA > resultadoB) {
            clasif[equipoA].ganados++;
            clasif[equipoB].perdidos++;
            historial[key].ganador = equipoA;
          } else if (resultadoB > resultadoA) {
            clasif[equipoB].ganados++;
            clasif[equipoA].perdidos++;
            historial[key].ganador = equipoB;
          } else {
            clasif[equipoA].empatados++;
            clasif[equipoB].empatados++;
            historial[key].empate = true;
          }
        }
      });

      const lista = Object.values(clasif).map((equipo) => ({
        ...equipo,
        puntos: equipo.ganados * 3 + equipo.empatados,
        diferencial: equipo.puntosAFavor - equipo.puntosEnContra,
        alias: equipo.nombre,
      }));

      lista.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.diferencial !== a.diferencial) return b.diferencial - a.diferencial;

        const key = [a.nombre, b.nombre].sort().join('-');
        const h = historial[key];

        if (h?.ganador === a.nombre) return -1;
        if (h?.ganador === b.nombre) return 1;
        return 0;
      });

      setClasificacion(lista);
    }

    const handleScroll = () => {
      setMostrarBotonSubir(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilaEstilo = (idx) => {
    if (idx === 0) return 'bg-yellow-500 text-black font-bold';
    if (idx === 1) return 'bg-gray-300 text-black font-semibold';
    if (idx === 2) return 'bg-orange-300 text-black font-semibold';
    return 'odd:bg-white even:bg-gray-100';
  };

  const getPosicionIcono = (idx) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return idx + 1;
  };

  return (
    <div className="p-4 font-[Poppins]">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Clasificación</h2>

      {clasificacion.length === 0 ? (
        <p className="text-gray-600">No hay datos suficientes para mostrar la clasificación.</p>
      ) : (
        <>
          <table className="min-w-full border text-center mb-6 shadow-lg rounded overflow-hidden">
            <thead>
              <tr className="bg-green-200 text-gray-800">
                <th className="px-2 py-1 border">#</th>
                <th className="px-2 py-1 border">Equipo</th>
                <th className="px-2 py-1 border">Jugados</th>
                <th className="px-2 py-1 border">Ganados</th>
                <th className="px-2 py-1 border">Perdidos</th>
                <th className="px-2 py-1 border">Empatados</th>
                <th className="px-2 py-1 border">A favor</th>
                <th className="px-2 py-1 border">En contra</th>
                <th className="px-2 py-1 border">+/-</th>
                <th className="px-2 py-1 border">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {clasificacion.map((equipo, idx) => (
                <tr
                  key={equipo.nombre}
                  className={`${getFilaEstilo(idx)} ${idx < 3 ? 'animate-top3' : ''}`}
                >
                  <td className="border px-2 py-1">{getPosicionIcono(idx)}</td>
                  <td className="border px-2 py-1">{equipo.alias}</td>
                  <td className="border px-2 py-1">{equipo.jugados}</td>
                  <td className="border px-2 py-1">{equipo.ganados}</td>
                  <td className="border px-2 py-1">{equipo.perdidos}</td>
                  <td className="border px-2 py-1">{equipo.empatados}</td>
                  <td className="border px-2 py-1">{equipo.puntosAFavor}</td>
                  <td className="border px-2 py-1">{equipo.puntosEnContra}</td>
                  <td className="border px-2 py-1">{equipo.diferencial}</td>
                  <td className="border px-2 py-1">{equipo.puntos}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/rondas')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
            >
              Volver a Enfrentamientos
            </button>
          
          <button
            onClick={() => navigate('/resumen')}
            className="ml-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Ver Resumen del Torneo
          </button>
          </div>
        </>
      )}

      {mostrarBotonSubir && (
        <button
          onClick={volverArriba}
          className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-300 transition"
          aria-label="Volver arriba"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}






