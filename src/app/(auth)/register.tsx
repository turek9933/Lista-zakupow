import { useState } from "react";
import { StyleSheet,View, Text, Button, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthContext } from "@/src/context/AuthContext";
import { TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useProductContext } from "@/src/context/ProductContext";
import { auth } from "@/src/firebase";

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { user, register } = useAuthContext()!;
    const router = useRouter();
    const { colors } = useTheme();
    const [registerError, setRegisterError] = useState(false);
    const { addSampleProducts } = useProductContext();

    const handleRegister = async() => {
      // Checks if password is not empty and if is confirmed
      if ((password !== confirmPassword || password === '') ||
      (!email.includes('@') || !email.includes('.'))){
        setRegisterError(true);
        return;
      }
      try {
        const success = await register(email, password);
        if (!success) {
          setRegisterError(true);
          return;
        }
        
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            console.log('[(auth)/register.tsx] Wykryto zmiane uzytkownika. User:\t', user);
            console.log('[(auth)/register.tsx] Dodawanie przykladowych produktow');
            await addSampleProducts(user.uid);
            unsubscribe();
          }
        })
        Alert.alert('Rejestracja', 'Rejestracja przebiegła pomyślnie');
        router.replace("/(auth)/login");
      } catch (error) {
        console.error('[(auth)/register.tsx] Błąd rejestracji:', error);
        setRegisterError(true);
      }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text, alignSelf: 'center', fontSize: 24}]}>Rejestracja</Text>
            
            {registerError && <Text style={[styles.label, { color: 'red', alignSelf: 'center' }]}>Błędne dane rejestracji</Text>}


            <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={email} onChangeText={setEmail} />
    
            <Text style={[styles.label, { color: colors.text }]}>Hasło</Text>
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={password} onChangeText={setPassword} secureTextEntry />
    
            <Text style={[styles.label, { color: colors.text }]}>Potwierdź hasło</Text>
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            
            <Button title="Zarejestruj" onPress={handleRegister}/>
            
            <View style={{ height: 30 }} />

            <Text style={[styles.text, { color: colors.text, alignSelf: 'center', margin: 10 }]}>Masz już konto?</Text>
            <Button title="Zaloguj się" onPress={() => router.replace("/(auth)/login")}/>
          </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#222', //TODO
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  text: {
    fontSize: 14,
  }
});
