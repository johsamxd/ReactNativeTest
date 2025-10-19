import { StyleSheet, Text, View } from 'react-native';

export default function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 10,
    fontWeight: 600,
  },
});
