import { useState} from "react";
import { StyleSheet,View, Text, Button } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthContext } from "@/src/context/AuthContext";
import { TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login } = useAuthContext()!;
    const router = useRouter();
    const { colors } = useTheme();
    const [loginError, setLoginError] = useState(false);

    useFocusEffect(() => {
      if (user) {
        console.log('[(auth)/login] Login successful. User:\t', user);
        router.replace("/(app)/(tabs)");
      }
    });

    const handleLogin = async() => {
      const success = await login(email, password);
      setLoginError(!success);
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text, alignSelf: 'center', fontSize: 24}]}>Logowanie</Text>
            
            {loginError && <Text style={[styles.label, { color: 'red', alignSelf: 'center' }]}>Błędne dane logowania</Text>}


            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={email} onChangeText={setEmail} />
    
            <Text style={[styles.label, { color: colors.text }]}>Hasło</Text>
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.text }]} value={password} onChangeText={setPassword} secureTextEntry />
            
            <Button title="Zaloguj" onPress={handleLogin}/>

            <View style={{ height: 30 }} />

            <Text style={[styles.text, { color: colors.text, alignSelf: 'center', margin: 10 }]}>Nie masz konta?</Text>
            <Button title="Zarejestruj się" onPress={() => router.push('/register')}/>
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
