// src/firebaseUtils.js
import { collection, addDoc, getDocs, getDoc, deleteDoc, doc, setDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const partidasRef = collection(db, 'partidas');

export const guardarPartidaFirestore = async (partida, id = null) => {
  try {
    // Obtener el usuario activo desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    const creador = usuario?.nombre && usuario?.apellido
      ? `${usuario.nombre}_${usuario.apellido}`.replace(/\s+/g, '_')
      : 'Anonimo';

    // Generar ID con nombre personalizado
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const idDocumento = `${creador}_${fecha}_${Date.now()}`;

    const partidaConAutor = {
      ...partida,
      creadoPor: creador,
      uid: usuario?.uid || 'desconocido'
    };

    // Si ya hay un ID explícito, usarlo
    if (id) {
      await setDoc(doc(db, 'partidas', id), partidaConAutor);
      return id;
    } else {
      await setDoc(doc(db, 'partidas', idDocumento), partidaConAutor);
      return idDocumento;
    }
  } catch (error) {
    console.error('❌ Error al guardar la partida:', error);
    throw error;
  }
};


export const obtenerPartidasFirestore = async () => {
  try {
    const q = query(partidasRef, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('❌ Error al recuperar partidas:', error);
    return [];
  }
};

export const borrarPartidaFirestore = async (id) => {
  try {
    await deleteDoc(doc(partidasRef, id));
    console.log(`✅ Partida con ID ${id} eliminada`);
  } catch (error) {
    console.error('❌ Error al eliminar la partida:', error);
    throw error;
  }
};

/*export const actualizarPartidaFirestore = async (id, datos) => {
  await setDoc(doc(db, "partidas", id), datos);
};*/

export const actualizarPartidaFirestore = async (id, nuevosDatos) => {
  const partidasRef = collection(db, 'partidas');
  await updateDoc(partidasRef, nuevosDatos);
};


export const obtenerPartidaPorId = async (id) => {
  const ref = doc(db, 'partidas', id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data();
  } else {
    throw new Error('La partida no existe');
  }
};






