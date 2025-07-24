// src/pages/Resumen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4', '#8bc34a', '#ff9800', '#e91e63'];

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

  return (
    <div className="p-4 font-[Poppins]">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Resumen del Torneo</h2>

      {estadisticas.length === 0 ? (
        <p className="text-red-600">No hay datos disponibles para mostrar el resumen.</p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Puntos Totales por Equipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadisticas}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="puntos" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Enfrentamientos Completados</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={estadisticas}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completados" stroke="#2196f3" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">Diferencial de Puntos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadisticas}
                  dataKey="diferencia"
                  nameKey="nombre"
                  outerRadius={120}
                  label
                >
                  {estadisticas.map((_, index) => (
                    <Cell key={index} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

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
