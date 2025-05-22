import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { useProductContext } from '@/src/context/ProductContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import UniversalImage from '@/src/components/UniversalImage';

export default function AddProductScreen() {
  const { addProduct } = useProductContext()!;
  const router = useRouter();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !price.trim() || !store.trim()) {
      if (Platform.OS === 'web') {
        window.alert(`Wypełnij pola: 'Nazwa produktu', 'Cena', 'Sklep'`);
      } else {
        Alert.alert('Błąd', `Wypełnij pola: 'Nazwa produktu', 'Cena', 'Sklep'`);
      }
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Podaj poprawną cenę.');
      } else {
        Alert.alert('Błąd', 'Podaj poprawną cenę.');
      }
      return;
    }
    
    addProduct({
      name: name.trim(),
      price: parsedPrice,
      originStore: store.trim(),
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim(),
      bought: false,
      createdAt: new Date(),
    });
    
    setName('');
    setPrice('');
    setStore('');
    setImageUrl('');
    setDescription('');

    router.back();
  };

  return (    
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Nazwa produktu:*</Text>
      <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={name} onChangeText={setName} />

      <Text style={[styles.label, { color: colors.text }]}>Opis:</Text>
      <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={description} onChangeText={setDescription} />

      <Text style={[styles.label, { color: colors.text }]}>Cena:*</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.text }]}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: colors.text }]}>URL obrazka</Text>
      <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={imageUrl} onChangeText={setImageUrl} />
      {imageUrl ? (
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Podgląd obrazka:</Text>
          <UniversalImage imageSource={imageUrl} styles={styles.image} />
        </View>
      ) : null}

      <Text style={[styles.label, { color: colors.text }]}>Sklep:*</Text>
      <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={store} onChangeText={setStore} />

      <Text style={[styles.note, { color: colors.text }]}>* Pola obowiązkowe</Text>


      <Button title="Dodaj produkt" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#222',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  note: {
    fontSize: 12,
    marginTop: 5,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },

  image: {
    width: 200,
    height: 100,
  },
});
