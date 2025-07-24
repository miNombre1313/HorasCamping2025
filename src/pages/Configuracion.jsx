import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { guardarPartidaFirestore, obtenerPartidasFirestore } from '../firebaseUtils';

export default function Configuracion() {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState(16);
  const [pistas, setPistas] = useState(11);
  const [nombresEquipos, setNombresEquipos] = useState([]);

  useEffect(() => {
    const nuevosNombres = Array.from({ length: equipos }, (_, i) => `Equipo ${i + 1}`);
    setNombresEquipos(nuevosNombres);
  }, [equipos]);

  const handleNombreCambio = (index, nuevoNombre) => {
    const actualizados = [...nombresEquipos];
    actualizados[index] = nuevoNombre;
    setNombresEquipos(actualizados);
  };

  const generarEnfrentamientos = async () => {
    if (equipos % 2 !== 0) {
      Swal.fire('Error', 'El número de equipos debe ser par para el round-robin.', 'error');
      return;
    }

    const totalRondas = equipos - 1;
    const partidosPorRonda = equipos / 2;
    const rondas = [];

    // Generar índices
    const indices = [...Array(equipos).keys()];
    const equipoFijo = indices[0];
    const rotables = indices.slice(1);

    for (let ronda = 0; ronda < totalRondas; ronda++) {
      const enfrentamientos = [];

      const rotados = [...rotables];
      for (let i = 0; i < ronda; i++) {
        rotados.unshift(rotados.pop());
      }

      const enfrentamientoFijo = [equipoFijo, rotados[0]];
      enfrentamientos.push(enfrentamientoFijo);

      for (let i = 1; i < partidosPorRonda; i++) {
        enfrentamientos.push([rotados[i], rotados[rotados.length - i]]);
      }

      rondas.push(enfrentamientos);
    }

    // Asignación de pistas
    const historialPistas = Array(equipos).fill(null).map(() => []);
    const usoPorEquipoYPista = Array(equipos).fill(null).map(() => ({}));
    const rondasConPistas = [];

    for (let r = 0; r < rondas.length; r++) {
      const ronda = rondas[r];
      const pistasUsadas = new Set();
      const enfrentamientosConPista = [];

      for (const [a, b] of ronda) {
        const pistasDisponibles = Array.from({ length: pistas }, (_, i) => i + 1).filter(p => {
          if (pistasUsadas.has(p)) return false;
          const usosA = usoPorEquipoYPista[a][p] || 0;
          const usosB = usoPorEquipoYPista[b][p] || 0;
          const ultimaA = historialPistas[a].lastIndexOf(p);
          const ultimaB = historialPistas[b].lastIndexOf(p);
          const rondaMinima = r - 2;
          return usosA < 2 && usosB < 2 &&
            (ultimaA === -1 || ultimaA <= rondaMinima) &&
            (ultimaB === -1 || ultimaB <= rondaMinima);
        });

        const pista = pistasDisponibles.length > 0
          ? pistasDisponibles[Math.floor(Math.random() * pistasDisponibles.length)]
          : Math.floor(Math.random() * pistas) + 1;

        pistasUsadas.add(pista);
        historialPistas[a].push(pista);
        historialPistas[b].push(pista);
        usoPorEquipoYPista[a][pista] = (usoPorEquipoYPista[a][pista] || 0) + 1;
        usoPorEquipoYPista[b][pista] = (usoPorEquipoYPista[b][pista] || 0) + 1;

        enfrentamientosConPista.push({
          equipoA: nombresEquipos[a],
          equipoB: nombresEquipos[b],
          pista,
          resultadoA: null,
          resultadoB: null,
          ronda: r + 1
        });
      }

      rondasConPistas.push(...enfrentamientosConPista);
    }

    const partida = {
      fecha: new Date().toISOString(),
      equipos,
      pistas,
      nombresEquipos,
      rondas: rondasConPistas
    };

    // 🔶 NUEVO: Pedimos nombre personalizado
    const { value: nombrePartida } = await Swal.fire({
      title: 'Guardar partida',
      input: 'text',
      inputLabel: 'Asigna un nombre a esta partida',
      inputPlaceholder: 'Ej. Torneo Verano 2025',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes introducir un nombre para la partida.';
      }
    });

    if (!nombrePartida) {
      Swal.fire('Cancelado', 'No se guardó la partida.', 'info');
      return;
    }

    // Añadimos el nombre al objeto
    partida.nombre = nombrePartida;

    try {
      localStorage.setItem('numEquipos', equipos);
      localStorage.setItem('numPistas', pistas);
      localStorage.setItem('nombresEquipos', JSON.stringify(nombresEquipos));
      localStorage.setItem('rondas', JSON.stringify(rondasConPistas));
      localStorage.setItem('nombrePartida', nombrePartida);

      await guardarPartidaFirestore(partida);

      Swal.fire('Listo', 'Enfrentamientos generados correctamente.', 'success').then(() => {
        navigate('/rondas');
      });
    } catch (error) {
      console.error("Error al guardar en Firestore:", error.message);
      Swal.fire('Error', 'No se pudo guardar la partida: ' + error.message, 'error');
    }
  };

  const cargarPartidaDesdeJSON = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const archivo = e.target.files[0];
      if (!archivo) return;

      try {
        const contenido = await archivo.text();
        const partida = JSON.parse(contenido);

        if (!partida.rondas || !partida.equipos || !partida.pistas || !partida.nombresEquipos) {
          Swal.fire('Error', 'El archivo JSON no contiene una partida válida.', 'error');
          return;
        }

        // Guardar en localStorage
        localStorage.setItem('numEquipos', partida.equipos);
        localStorage.setItem('numPistas', partida.pistas);
        localStorage.setItem('nombresEquipos', JSON.stringify(partida.nombresEquipos));
        localStorage.setItem('rondas', JSON.stringify(partida.rondas));
        localStorage.setItem('nombrePartida', partida.nombre || 'Partida Cargada');

        // Confirmar carga local
        await Swal.fire('Partida cargada', 'La partida se ha cargado correctamente desde el archivo.', 'success');

        // Preguntar si quiere subirla a la nube
        const { isConfirmed } = await Swal.fire({
          title: '¿Guardar también en la nube?',
          text: '¿Deseas guardar esta partida en Firestore para tenerla disponible desde cualquier lugar?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, guardar',
          cancelButtonText: 'No, solo local'
        });

        if (isConfirmed) {
          const partidasExistentes = await obtenerPartidasFirestore();
          const nombreBase = partida.nombre || 'Partida';
          let nombreFinal = nombreBase;
          let contador = 1;

          const nombresExistentes = partidasExistentes.map(p => p.nombre);

          while (nombresExistentes.includes(nombreFinal)) {
            nombreFinal = `${nombreBase} (copia${contador > 1 ? ' ' + contador : ''})`;
            contador++;
          }

          if (nombreFinal !== nombreBase) {
            await Swal.fire(
              'Nombre en uso',
              `Ya existe una partida con ese nombre. Se guardará como "${nombreFinal}".`,
              'info'
            );
          }

          partida.nombre = nombreFinal;
          partida.fecha = new Date().toISOString();
          // Asegúrate de eliminar el ID si lo trae desde el JSON
          delete partida.id;

          await guardarPartidaFirestore(partida);

          Swal.fire('Guardado', 'La partida ha sido guardada en Firestore.', 'success');
        }

        navigate('/rondas');

      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Hubo un problema al leer el archivo JSON.', 'error');
      }
    };

    input.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-4">
      <h2 className="text-3xl font-semibold text-green-800">Configuración del Torneo</h2>

      <div className="flex flex-col items-start space-y-2">
        <label>
          Número de equipos:
          <input
            type="number"
            value={equipos}
            onChange={(e) => setEquipos(Number(e.target.value))}
            min="2"
            max="32"
            className="ml-2 p-1 border rounded"
          />
        </label>
        <label>
          Número de pistas:
          <input
            type="number"
            value={pistas}
            onChange={(e) => setPistas(Number(e.target.value))}
            min="1"
            max="20"
            className="ml-2 p-1 border rounded"
          />
        </label>
      </div>

      <div className="w-full max-w-md">
        <h3 className="text-xl font-semibold text-blue-700 mt-4 mb-2">Nombres de los Equipos:</h3>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {nombresEquipos.map((nombre, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => handleNombreCambio(idx, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={generarEnfrentamientos}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Generar Enfrentamientos
        </button>
        <button
          onClick={() => navigate('/partidasguardadas')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar Partidas
        </button>
        <button
          onClick={cargarPartidaDesdeJSON}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Cargar JSON
        </button>

        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Salir
        </button>
      </div>
    </div>
  );
}




