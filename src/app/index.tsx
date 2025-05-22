import { useFocusEffect, useRouter } from "expo-router";
import { useAuthContext } from "@/src/context/AuthContext";

export default function Index() {
    const router = useRouter();
    const { user } = useAuthContext()!;

    useFocusEffect(() => {
        if (user) {
            console.log('[Index] User:\t', user);
            router.replace("/(app)/(tabs)");
        }
        router.replace("/(auth)/login");
    });

    return null;
}