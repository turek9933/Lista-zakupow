import React from 'react';
import { View, Text, Button} from 'react-native';
import { Product } from "@/src/types/Product";
import UniversalImage from '@/src/components/UniversalImage';

export default function ProductDetail(
    {p, toggleBought, removeProduct, styles, colors}:
    {p: Product, toggleBought: (id: string) => void, removeProduct: (id: string) => void, styles: any, colors: any}) {
    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Nazwa produktu</Text>
                <Text style={[styles.itemText, { color: colors.text }]}>{p.name}</Text>
            </View>
            {p.description && <View style={styles.itemContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Opis produktu</Text>
                <Text style={[styles.itemText, { color: colors.text }]}>{p.description}</Text>
            </View>
            }
            <View style={styles.itemContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Cena produktu</Text>
                <Text style={[styles.itemText, { color: colors.text }]}>{p.price} PLN</Text>
            </View>
            {p.imageUrl && (
                <View style={styles.itemContainer}>
                    <UniversalImage imageSource={p.imageUrl} styles={styles.image} />
                </View>
            )}

            <View style={styles.itemContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Sklep zakupu</Text>
                <Text style={[styles.itemText, { color: colors.text }]}>{p.originStore}</Text>
            </View>
            <View style={styles.buttonRow}>
                <Button 
                    title={p.bought ? 'Odkup' : 'Kup'}
                    onPress={() => toggleBought(p.id)}
                />
                <Button 
                    title="Usuń"
                    onPress={() => removeProduct(p.id)}
                    color="red"
                />
            </View>
        </View>
    );
}