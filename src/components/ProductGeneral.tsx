import React from 'react';
import { View, Text, Button} from 'react-native';
import { Product } from "@/src/types/Product";

export default function ProductGeneral(
    {item, toggleBought, removeProduct, showDetails, styles, colors}:
    {item: Product, toggleBought: (id: string) => void, removeProduct: (id: string) => void, showDetails: (id: string) => void, styles: any, colors: any}) {
    return (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, { color: colors.text }]}>
        {item.name} - {item.price} PLN - {item.originStore}
      </Text>
      <View style={styles.buttonRow}>
      <Button 
          title={item.bought ? 'Odkup' : 'Kup'}
          onPress={() => toggleBought(item.id)}
        />
        <Button 
          title='Szczegóły'
          onPress={() => showDetails(item.id)}
        />
        <Button 
          title="Usuń"
          onPress={() => removeProduct(item.id)}
          color="red"
        />
      </View>
    </View>
    );
}