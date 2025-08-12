// src/firebaseUtils.js
import { collection, getDocs, getDoc, deleteDoc, doc, setDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

const partidasRef = collection(db, 'partidas');

export const guardarPartidaFirestore = async (partida, id = null) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Debes iniciar sesión para guardar.');
    }

    // Nombre visible del creador (opcional)
    const usuarioLS = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    const creador =
      (usuarioLS?.nombre && usuarioLS?.apellido)
        ? `${usuarioLS.nombre}_${usuarioLS.apellido}`.replace(/\s+/g, '_')
        : (user.email || 'Anonimo');

    // ID “legible”
    const fecha = new Date().toISOString().split('T')[0];
    const idDocumento = id || `${creador}_${fecha}_${Date.now()}`;

    const partidaConAutor = {
      ...partida,
      uid: user.uid,           // 👈 necesario para las reglas
      creadoPor: creador,
      creadoEn: new Date().toISOString(),
    };

    await setDoc(doc(db, 'partidas', idDocumento), partidaConAutor);
    return idDocumento;
  } catch (error) {
    console.error('❌ Error al guardar la partida:', error);
    throw error;
  }
};

export const obtenerPartidasFirestore = async () => {
  try {
    const q = query(partidasRef, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('❌ Error al recuperar partidas:', error);
    return [];
  }
};

export const borrarPartidaFirestore = async (id) => {
  try {
    await deleteDoc(doc(db, 'partidas', id));
  } catch (error) {
    console.error('❌ Error al eliminar la partida:', error);
    throw error;
  }
};

export const actualizarPartidaFirestore = async (id, nuevosDatos) => {
  // 🔧 tu versión usaba collection() en updateDoc; debes pasar un doc()
  const ref = doc(db, 'partidas', id);
  await updateDoc(ref, nuevosDatos);
};

export const obtenerPartidaPorId = async (id) => {
  const ref = doc(db, 'partidas', id);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  throw new Error('La partida no existe');
};







