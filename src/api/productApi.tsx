import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Product } from '@/src/types/Product';

const PRODUCTS_COLLECTION = 'products';

export const loadProductsFromFirebase = async (): Promise<Product[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const productsFromFirebase: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const product: Product = {
          id: doc.id,
          name: data.name,
          price: data.price,
          originStore: data.originStore,
          imageUrl: data.imageUrl,
          description: data.description,
          bought: data.bought,
          ownerId: data.ownerId,
          createdAt: data.createdAt.toDate(),
        };
        productsFromFirebase.push(product);
        return productsFromFirebase;
      });
      console.log('[API loadProductsFromFirebase] Produkty\n', productsFromFirebase);
    } catch (error) {
      console.error('[API loadProductsFromFirebase] Błąd pobierania danych z Firebase:', error);
    }
    return [];
}

// Returns added product id
export const addProductToFirebase = async ({ name, price, originStore, imageUrl, description, bought, ownerId, createdAt }: {
    name: string;
    price: number;
    originStore: string;
    imageUrl?: string;
    description?: string;
    bought: boolean;
    ownerId?: string;
    createdAt?: Date;
  }): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'products'), {
        name,
        price,
        originStore,
        imageUrl: imageUrl ?? null,
        description: description ?? null,
        bought,
        ownerId: ownerId,
        createdAt: createdAt,
        });
        console.log('[addProduct] Dodano produkt\n', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Błąd zapisu do Firestore:', error);
    }
    return '';
};

export async function getProductsByUser(userId: string): Promise<Product[]> {
    const q = query(collection(db, PRODUCTS_COLLECTION), where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);

    const userProducts: Product[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const product = {
            id: doc.id,
            name: data.name,
            price: data.price,
            originStore: data.originStore,
            imageUrl: data.imageUrl,
            description: data.description,
            bought: data.bought,
            ownerId: data.ownerId,
            createdAt: data.createdAt.toDate(),
        }
        userProducts.push(product);
    });
    return userProducts;
}

export async function deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
}

export async function updateProductBoughtStatus(id: string, newStatus: boolean): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, { bought: newStatus });
}

export async function deleteAllProductsByUser(uid: string): Promise<void> {
  const q = query(collection(db, PRODUCTS_COLLECTION), where('ownerId', '==', uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log(`[deleteAllProductsByUser] No products to delete for uid: ${uid}`);
    return;
  }
  
  const deletePromises: Promise<void>[] = []; // Przechowuje promisy do usuniecia

  snapshot.forEach((documentSnapshot) => {
      const productRef = doc(db, 'products', documentSnapshot.id);
      deletePromises.push(deleteDoc(productRef));
      console.log(`Preparing to delete document: ${documentSnapshot.id}`);
    });

    await Promise.all(deletePromises);
}