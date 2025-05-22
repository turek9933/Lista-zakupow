import { View, Button } from "react-native";

export default function HeaderButton({title, callback, styles}: {title: string, callback: () => void, styles?: object}) {
    return (
        <View style={styles}>
            <Button title={title} onPress={callback} />
        </View>
    );
}