// src/pages/Rondas.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { actualizarPartidaFirestore, obtenerPartidaPorId } from '../firebaseUtils';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function Rondas() {
  const navigate = useNavigate();
  const [rondas, setRondas] = useState([]);
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);
  const partidaId = localStorage.getItem('partidaId');

  useEffect(() => {
    const cargarRondas = async () => {
      let data = JSON.parse(localStorage.getItem('rondas'));
      if (!data && partidaId) {
        try {
          const partida = await obtenerPartidaPorId(partidaId);
          data = partida?.rondas || [];
          console.log('Datos cargados:', data);

          localStorage.setItem('rondas', JSON.stringify(data));
        } catch (e) {
          console.error('Error cargando partida de Firestore:', e);
        }
      }

      if (data && Array.isArray(data)) {
        if (Array.isArray(data[0])) {
          setRondas(data);
        } else {
          const agrupadas = data.reduce((acc, enf) => {
            const idx = enf.ronda - 1;
            if (!acc[idx]) acc[idx] = [];
            acc[idx].push(enf);
            return acc;
          }, []);
          setRondas(agrupadas);
        }
      }
    };

    cargarRondas();

    const handleScroll = () => {
      setMostrarBotonSubir(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [partidaId]);

  const guardarYSobrescribir = async () => {
    if (!partidaId) {
      Swal.fire('Error', 'No se encontró ID de la partida', 'error');
      return;
    }

    try {
      const datos = {
        fecha: new Date().toISOString(),
        equipos: parseInt(localStorage.getItem('numEquipos')),
        pistas: parseInt(localStorage.getItem('numPistas')),
        nombresEquipos: JSON.parse(localStorage.getItem('nombresEquipos')),
        rondas: rondas.flatMap((ronda, idx) =>
          ronda.map((enf) => ({ ...enf, ronda: idx + 1 }))
        ),
      };
      await actualizarPartidaFirestore(partidaId, datos);
      Swal.fire('Guardado', 'La partida ha sido actualizada en la nube', 'success').then(() => {
        navigate('/configuracion');
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar en Firestore', 'error');
    }
  };

  const modificarEnfrentamiento = (rondaIdx, enfIdx) => {
    const enf = rondas[rondaIdx][enfIdx];
    Swal.fire({
      title: `Modificar enfrentamiento R${rondaIdx + 1}`,
      html: `
        <p><strong>${enf.equipoA}</strong> vs <strong>${enf.equipoB}</strong></p>
        <input id="a" type="number" placeholder="Resultado A" class="swal2-input" value="${enf.resultadoA ?? ''}" />
        <input id="b" type="number" placeholder="Resultado B" class="swal2-input" value="${enf.resultadoB ?? ''}" />
      `,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      preConfirm: () => {
        const a = parseInt(document.getElementById('a').value) || 0;
        const b = parseInt(document.getElementById('b').value) || 0;
        return { a, b };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const nuevas = [...rondas];
        nuevas[rondaIdx][enfIdx].resultadoA = res.value.a;
        nuevas[rondaIdx][enfIdx].resultadoB = res.value.b;
        setRondas(nuevas);
        localStorage.setItem(
          'rondas',
          JSON.stringify(nuevas.flatMap((r, idx) => r.map(e => ({ ...e, ronda: idx + 1 }))))
        );
      }
    });
  };

  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Rondas del Torneo</h2>

      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={guardarYSobrescribir}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Guardar y Volver
        </button>
        <button
          onClick={() => navigate('/partidasguardadas', { state: { desdeRondas: true } })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver Partidas Guardadas
        </button>
        <button
          onClick={() => navigate('/clasificacion')}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Ir a Clasificación
        </button>
        <button
          onClick={() => navigate('/resumen')}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Ver Resumen del Torneo
        </button>
        <button
          onClick={() => navigate('/modificarnombres')}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Modificar Nombres Equipos
        </button>
        <button
          onClick={() => navigate('/configuracion')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver sin Guardar
        </button>
      </div>

      {rondas.length === 0 ? (
        <p className="text-red-600">No hay rondas cargadas. Vuelve a la configuración para generarlas o carga una partida válida.</p>
      ) : (
        rondas.map((ronda, rondaIdx) => (
          <div key={rondaIdx} className="mb-6 border p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Ronda {rondaIdx + 1}</h3>
            <ul className="space-y-3">
              {ronda.map((enf, enfIdx) => (
                <li
                  key={enfIdx}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-gray-100 p-2 rounded space-y-2 md:space-y-0"
                >
                  <div className="flex-1">
                    <strong>{enf.equipoA}</strong> vs <strong>{enf.equipoB}</strong> | Pista: {enf.pista}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="A"
                      className="w-16 p-1 border rounded text-center"
                      value={enf.resultadoA ?? ''}
                      onChange={(e) => {
                        const nuevasRondas = [...rondas];
                        nuevasRondas[rondaIdx][enfIdx].resultadoA = parseInt(e.target.value) || 0;
                        setRondas(nuevasRondas);
                        localStorage.setItem(
                          'rondas',
                          JSON.stringify(nuevasRondas.flatMap((r, idx) => r.map(e => ({ ...e, ronda: idx + 1 }))))
                        );
                      }}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="B"
                      className="w-16 p-1 border rounded text-center"
                      value={enf.resultadoB ?? ''}
                      onChange={(e) => {
                        const nuevasRondas = [...rondas];
                        nuevasRondas[rondaIdx][enfIdx].resultadoB = parseInt(e.target.value) || 0;
                        setRondas(nuevasRondas);
                        localStorage.setItem(
                          'rondas',
                          JSON.stringify(nuevasRondas.flatMap((r, idx) => r.map(e => ({ ...e, ronda: idx + 1 }))))
                        );
                      }}
                    />
                    <button
                      onClick={() => modificarEnfrentamiento(rondaIdx, enfIdx)}
                      className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                    >
                      Modificar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
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










