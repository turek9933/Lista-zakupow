import { useState } from 'react';
import { Platform, StyleSheet, View, Text, Button, SectionList, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useProductContext } from '@/src/context/ProductContext';

import ProductGeneral from '@/src/components/ProductGeneral';
import { useRouter } from 'expo-router';

    
export default function MainScreen() {
  const { products, removeProduct, toggleBought, resetProducts } = useProductContext()!;
  type SortOption = 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';

  const [sortOption, setSortOption] = useState<SortOption>('date_desc');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('all');

  const { colors } = useTheme();

  const router = useRouter();

  const showDetails = (id: string) => router.push(`/product/${id}`);

  console.log('[index] products:\t', products);

  const deleteAllProducts = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Czy na pewno chcesz usunąć wszystkie produkty?');
      if (confirm) {
        resetProducts();
      }
    } else {
      Alert.alert(
        'Usuwanie wszystkich produktów',
        'Czy na pewno chcesz usunąć wszystkie produkty?',
        [
          {
            text: 'Anuluj',
            style: 'cancel',
          },
          {
            text: 'Usuń',
            onPress: () => resetProducts(),
            style: 'destructive',
          },
        ]
      )
    }
  }
  
  const allStores = Array.from(new Set(products.map(item => item.originStore)));

  // Filtrowanie produktów według sklepu i ceny
  const filteredProducts = products.filter(item => {
    const storeMatch = filterStore === 'all' || item.originStore === filterStore;
    let matchPrice = true;
    if (filterPriceRange !== 'all') {
      switch (filterPriceRange) {
        case '0-50':
          matchPrice = item.price <= 50;
          break;
        case '50-100':
          matchPrice = item.price > 50 && item.price <= 100;
          break;
        case '100-500':
          matchPrice = item.price > 100 && item.price <= 500;
          break;
        case '500+':
          matchPrice = item.price > 500;
          break;
      }
    }
    return storeMatch && matchPrice;
  });

  filteredProducts.sort((a, b) => {
    switch (sortOption) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'date_asc':
        return Number(a.id) - Number(b.id);
      default:// 'date_desc'
        return Number(b.id) - Number(a.id);
    }
  });

  const sections = [
    {
      title: "Do kupienia",
      data: filteredProducts.filter(item => !item.bought),
    },
    {
      title: "Kupione",
      data: filteredProducts.filter(item => item.bought),
    },
  ];
  console.log('[index] sections:\t', sections);

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text style={[styles.sectionHeader, { color: colors.text }]}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      {/* Srtowanie i filtrowanie */}
      {products.length > 0 && (
        <View style={styles.controlsContainer}>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Sortuj:</Text>
            <Picker
              selectedValue={sortOption}
              onValueChange={itemValue => setSortOption(itemValue as SortOption)}
              style={styles.picker}
            >
              <Picker.Item label="Nazwa od A do Z" value="name_asc" />
              <Picker.Item label="Nazwa od Z do A" value="name_desc" />
              <Picker.Item label="Od najtańszych" value="price_asc" />
              <Picker.Item label="Od najdroższych" value="price_desc" />
              <Picker.Item label="Od najnowszych" value="date_desc" />
              <Picker.Item label="Od najstarszych" value="date_asc" />
            </Picker>
          </View>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Filtruj sklep:</Text>
            <Picker
              selectedValue={filterStore}
              onValueChange={itemValue => setFilterStore(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Wszystkie" value="all" />
              {allStores.map((store, index) => (
                <Picker.Item key={index} label={store} value={store} />
              ))}
            </Picker>
          </View>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Filtruj cenę:</Text>
            <Picker
              selectedValue={filterPriceRange}
              onValueChange={itemValue => setFilterPriceRange(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Wszystkie" value="all" />
              <Picker.Item label="0-50 PLN" value="0-50" />
              <Picker.Item label="50-100 PLN" value="50-100" />
              <Picker.Item label="100-500 PLN" value="100-500" />
              <Picker.Item label="500+ PLN" value="500+" />
            </Picker>
          </View>
        </View>
      )}
      {filteredProducts.length > 0 ? (
        <View style={{flex: 1}}>
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductGeneral
              item={item}
              toggleBought={toggleBought}
              removeProduct={removeProduct}
              showDetails={showDetails}
              styles={styles}
              colors={colors}
            />
          )}
          renderSectionHeader={renderSectionHeader}
          style={styles.list}
        />
          <View style={styles.deleteAllButton}>
          <Button title='Usuń wszystkie' onPress={() => deleteAllProducts()} color={'red'} />
          </View>
        </View>
      ) : (
        <View style={styles.noProducts}>
          <Text style={[styles.label, { color: colors.text }]}>Brak produktów</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#222', //TODO
  },

  controlsContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600'
  },

  picker: {
    backgroundColor: '#333',
    color: '#fff',
    marginBottom: 10
  },

  list: {
    flex: 1,
  },

  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 14,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'space-between',
  },

  noProducts: {
    marginTop: 20,
    alignItems: 'center',
  },

  deleteAllButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
});
