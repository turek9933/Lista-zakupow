import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={[styles.container, {color: colors.text}]}>This screen doesn't exist.</Text>
        <Button title="Go to 'main' screen!" onPress={() => router.replace('/')} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
