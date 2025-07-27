// src/pages/Resumen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const colores = [
  '#FF6633', '#FF33FF', '#00B3E6', '#E6B333', '#3366E6',
  '#999966', '#99FF99', '#B34D4D', '#80B300', '#809900',
  '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A',
  '#FF1A66', '#E6331A', '#33FFCC', '#66994D', '#B366CC',
  '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF',
  '#E666FF', '#4DB3FF', '#1AB399', '#E666B3', '#33991A',
  '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980',
  '#999933', '#FF3380', '#CCCC00', '#66E64D', '#4D80CC',
  '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6',
  '#6666FF'
];

export default function Resumen() {
  const [estadisticas, setEstadisticas] = useState([]);
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('rondas');
    const stats = {};

    if (data) {
      const rondas = JSON.parse(data).flat();

      rondas.forEach(({ equipoA, equipoB, resultadoA, resultadoB }) => {
        if (!stats[equipoA]) stats[equipoA] = { nombre: equipoA, completados: 0, puntos: 0, diferencia: 0 };
        if (!stats[equipoB]) stats[equipoB] = { nombre: equipoB, completados: 0, puntos: 0, diferencia: 0 };

        if (typeof resultadoA === 'number' && typeof resultadoB === 'number') {
          stats[equipoA].completados++;
          stats[equipoB].completados++;

          if (resultadoA > resultadoB) {
            stats[equipoA].puntos += 3;
          } else if (resultadoB > resultadoA) {
            stats[equipoB].puntos += 3;
          } else {
            stats[equipoA].puntos += 1;
            stats[equipoB].puntos += 1;
          }

          stats[equipoA].diferencia += resultadoA - resultadoB;
          stats[equipoB].diferencia += resultadoB - resultadoA;
        }
      });

      setEstadisticas(Object.values(stats));
    }

    const handleScroll = () => setMostrarBoton(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cálculo del máximo diferencial para barras proporcionales
  const maxDiferencia = Math.max(...estadisticas.map(e => e.diferencia || 0), 1); // evitar división por 0

  return (
    <div className="p-4 font-[Poppins]">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Resumen del Torneo</h2>

      {estadisticas.length === 0 ? (
        <p className="text-red-600">No hay datos disponibles para mostrar el resumen.</p>
      ) : (
        <>
          {/* Puntos Totales */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Puntos Totales por Equipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadisticas}>
                <XAxis dataKey="nombre" />
                <YAxis tickCount={10} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="puntos" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Enfrentamientos Completados */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Enfrentamientos Completados</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={estadisticas}>
                <XAxis dataKey="nombre" />
                <YAxis tickCount={15} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="completados" stroke="#2196f3" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Ranking Visual */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-orange-700 mb-4">Ranking por Diferencial de Puntos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-orange-200 text-left">
                    <th className="px-4 py-2">🏆</th>
                    <th className="px-4 py-2">Equipo</th>
                    <th className="px-4 py-2">Diferencial</th>
                    <th className="px-4 py-2">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {[...estadisticas]
                    .sort((a, b) => b.diferencia - a.diferencia)
                    .map((equipo, idx) => (
                      <tr key={equipo.nombre} className="border-t">
                        <td className="px-4 py-2 text-2xl">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🎯'}
                        </td>
                        <td className="px-4 py-2 font-semibold">{equipo.nombre}</td>
                        <td className="px-4 py-2">{equipo.diferencia}</td>
                        <td className="px-4 py-2">
                          <div className="w-full bg-gray-200 rounded-full h-6 text-white text-xs font-semibold relative overflow-hidden">
                            <div
                              className="h-6 flex items-center justify-center rounded-full"
                              style={{
                                width: `${(equipo.diferencia / maxDiferencia) * 100}%`,
                                backgroundColor: colores[idx % colores.length],
                                transition: 'width 0.5s ease',
                              }}
                            >
                              {idx + 1}º clasificado
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/rondas')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow mr-4"
            >
              Volver a Enfrentamientos
            </button>
            <button
              onClick={() => navigate('/clasificacion')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded shadow"
            >
              Ver Clasificación
            </button>
          </div>
        </>
      )}

      {/* Botón flotante */}
      {mostrarBoton && (
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

