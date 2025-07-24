// src/firebaseUtils.js
import { collection, addDoc, getDocs, getDoc, deleteDoc, doc, setDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import db from './firebaseConfig'; // debe ser una exportación por defecto

const partidasRef = collection(db, 'partidas');

export const guardarPartidaFirestore = async (partida, id = null) => {
  try {
    if (id) {
      await setDoc(doc(db, 'partidas', id), partida); // sobrescribe si existe
      return id;
    } else {
      const docRef = await addDoc(partidasRef, partida); // crea uno nuevo
      return docRef.id;
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
  const partidaRef = doc(db, 'partidas', id);
  await updateDoc(partidaRef, nuevosDatos);
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






