import { useAuthContext } from "@/src/context/AuthContext";
import { Pressable, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Logout() {
    const { logout } = useAuthContext()!;
    const { colors } = useTheme();
    const router = useRouter();
    
    const handleLogout = () => {
        logout();
        router.replace("/(auth)/login");
    };

    return (
        <Pressable onPress={handleLogout}>
            <Text style={{color: colors.notification, paddingHorizontal: 10}}>Logout</Text>
        </Pressable>
    );
}