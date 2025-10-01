import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function addCategory(data: any) {
  const docRef = await addDoc(collection(db, "categories"), {...data, createdAt: new Date()});
  return docRef;
}

export async function getCategories() {
  return await getDocs(collection(db, "categories"));
}

export async function updateItem(id: string, data: any) {
  const itemRef = doc(db, "categories", id);
  await updateDoc(itemRef, data);
}

export async function deleteItem(id: string) {
  await deleteDoc(doc(db, "categories", id));
}
