import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { Product } from '@/src/types/Product';
import { loadProductsFromFirebase, addProductToFirebase, deleteProduct, updateProductBoughtStatus, getProductsByUser, deleteAllProductsByUser } from '@/src/api/productApi';
import { useAuthContext } from './AuthContext';
import { create } from 'react-test-renderer';

interface ProductContextType {
  products: Product[];
  addProduct: ({
    name,
    price,
    originStore,
    imageUrl,
    description,
    bought,
    createdAt} : {
    name: string;
    price: number;
    originStore: string;
    imageUrl?: string;
    description?: string;
    bought: boolean;
    createdAt?: Date}) => void;
  removeProduct: (id: string) => void;
  toggleBought: (id: string) => void;
  resetProducts: () => void;
  addSampleProducts: (userId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
    const { user } = useAuthContext()!;
  useEffect(() => {
    if (!user) {
      setProducts([]);
      return;
    }
    getProductsByUser(user.uid).then((products) => {
      setProducts(products);
    });
  }, [user]);

  const resetProducts = () => {
    if (!user) {
      console.error('[ProductContext] Brak użytkownika.');
      return;
    }
    const userId = user.uid;
    deleteAllProductsByUser(userId);
    setProducts([]);
  }


  const addProduct = async ({
    name,
    price,
    originStore,
    imageUrl,
    description,
    bought,
    createdAt} : {
    name: string;
    price: number;
    originStore: string;
    imageUrl?: string;
    description?: string;
    bought: boolean;
    createdAt?: Date}) => {

    if (!user) {
      console.error('[ProductContext] Brak użytkownika.');
      return;
    }
    const ownerId = user.uid;
    try {
      console.log('[ProductContext] Dodawanie produktu');
      const productId = await addProductToFirebase({ name, price, originStore, imageUrl, description, bought, ownerId, createdAt });
      console.log('[ProductContext] productId\t', productId);
      const fullProduct = {
        id: productId,
        name: name,
        price: price,
        originStore: originStore,
        imageUrl: imageUrl,
        description: description,
        bought: bought,
        ownerId: ownerId,
        createdAt: createdAt
      };

      setProducts((prev) => [...prev, fullProduct]);
      console.log('[ProductContext] Dodano produkt\n', fullProduct);
      console.log('[ProductContext] Produkty\n', products);
    } catch (error) {
      console.error('Błąd zapisu do Firestore:', error);
    }
  };

  const removeProduct = (id: string) => {
    deleteProduct(id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleBought = (id: string) => {
    const productToUpdate = products.find((item) => item.id === id);
    updateProductBoughtStatus(id, !productToUpdate!.bought);
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  const addSampleProducts = async (userId: string) => {
    console.log('[ProductContext] Dodawanie przykladowych produktow');
    addProductToFirebase({
      name: 'Jabłko',
        price: 2.50,
        originStore: 'Supermarket',
        imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb',
        description: 'Apples are the best fruit ever, right eve?',
        bought: true,
        ownerId: userId,
        createdAt: new Date(),
      });
    addProductToFirebase({
      name: 'Chleb',
      price: 3.50,
      originStore: 'Buda z chlebem',
      imageUrl: 'https://cdn.pixabay.com/photo/2014/07/09/22/09/bread-388647_1280.jpg',
      description: 'Bread is the best food ever, right eve?',
      bought: false,
      ownerId: userId,
      createdAt: new Date(),
    });
    console.log('[ProductContext] Produkty\n', products);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, toggleBought, resetProducts, addSampleProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  return useContext(ProductContext);
}