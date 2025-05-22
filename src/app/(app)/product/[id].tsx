import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useProductContext } from '@/src/context/ProductContext';
import { useTheme } from '@react-navigation/native';
import ProductDetail from '@/src/components/ProductDetail';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import HeaderButton from '@/src/components/HeaderButton';

export default function ProductDetailScreen() {
  console.log('[ProductDetailScreen] params:', useLocalSearchParams());
  const { id } = useLocalSearchParams();
  const { products, toggleBought, removeProduct } = useProductContext()!;
  const { colors } = useTheme();
  const router = useRouter();

  const product = products.find((item) => item.id === id);
  const handleRemove = () => {
    removeProduct(id.toString());
    router.back();
  }
  return (
    <>
    <Stack.Screen 
      options={{
        title: 'Szczegóły produktu',
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderButton title="Powrót" callback={() => router.back()} styles={styles.backButton} />,
        headerShown: true
        }} />
      <View style={styles.container}>
        <ProductDetail p={product!} styles={styles} toggleBought={toggleBought} removeProduct={handleRemove} colors={colors} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginHorizontal: 20,
    color: '#000',
    fontSize: 16
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#222',
  },

  itemContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  itemText: {
    fontSize: 14,
    marginBottom: 5,
  },

  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    color: '#fff',
  }
});
