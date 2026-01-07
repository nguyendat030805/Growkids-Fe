// features/display/components/DisplayCard.tsx
import { StyleSheet, Text, View } from 'react-native';
import { DisplayItem } from '../types/DisplayType';

export const DisplayCard = ({ item }: { item: DisplayItem }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
