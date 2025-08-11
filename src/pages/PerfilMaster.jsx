// src/pages/PerfilMaster.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // ✅ Corrección aquí
import { useNavigate } from 'react-router-dom';

export default function PerfilMaster() {
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPartidas = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'partidas'));
        const partidasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPartidas(partidasData);
      } catch (error) {
        console.error('Error al cargar partidas:', error);
      }
    };

    cargarPartidas();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] p-4">
      <h1 className="text-3xl font-bold text-center text-[#002c54] mb-6">Partidas guardadas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partidas.map((partida) => (
          <div key={partida.id} className="bg-white rounded-lg shadow-lg p-4 border hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-[#002c54] mb-2">{partida.titulo || 'Partida sin título'}</h2>
            <p><strong>ID:</strong> {partida.id}</p>
            <p><strong>Fecha:</strong> {partida.creadoEn?.seconds ? new Date(partida.creadoEn.seconds * 1000).toLocaleDateString() : 'Desconocida'}</p>
            <p><strong>Equipos:</strong> {partida.equipos?.length || 0}</p>
            <p><strong>Pistas:</strong> {partida.pistas || 'No especificadas'}</p>
            <button
              className="mt-3 px-4 py-2 bg-[#002c54] text-white rounded hover:bg-[#004080]"
              onClick={() => navigate(`/partida/${partida.id}`)}
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


