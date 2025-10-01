import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function addBrands(data: any) {
  const docRef = await addDoc(collection(db, "brands"), {...data, createdAt: new Date()});
  return docRef;
}

export async function getBrands() {
  return await getDocs(collection(db, "brands"));
}

export async function updateBrands(id: string, data: any) {
  const itemRef = doc(db, "brands", id);
  await updateDoc(itemRef, data);
}

export async function deleteBrands(id: string) {
  await deleteDoc(doc(db, "brands", id));
}
