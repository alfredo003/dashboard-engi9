import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function addProduct(data: any) {
  const docRef = await addDoc(collection(db, "products"), {...data, createdAt: new Date()});
  return docRef;
}

export async function getProducts() {
  return await getDocs(collection(db, "products"));
}

export async function updateProduct(id: string, data: any) {
  const itemRef = doc(db, "products", id);
  await updateDoc(itemRef, data);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}
