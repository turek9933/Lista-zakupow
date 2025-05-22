import { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';

export default function UniversalImage({ imageSource, styles }: { imageSource: string, styles: object }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <View style={styles}>
        <Text>Error loading image</Text>
      </View>
    );
  }
  return (
    <>
    {loading && <ActivityIndicator style={styles} />}

    <Image source={{uri: imageSource}} style={styles} onLoad={() => setLoading(false)} onError={() => setError(true)} resizeMethod={"auto"}/>
    </>
  );
}
