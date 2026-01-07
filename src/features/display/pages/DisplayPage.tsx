// features/display/pages/DisplayPage.tsx
import { FlatList, StyleSheet, Text, View } from "react-native";

import { DisplayCard } from "../components/DisplayCard";
import { useDisplayData } from "../hooks/useDisplayData";

const DisplayPage = () => {
  const { data, loading } = useDisplayData();

  if (loading) {
    return <Text style={styles.loading}>Đang tải...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trang Hiển Thị</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DisplayCard item={item} />}
      />
    </View>
  );
};

export default DisplayPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  loading: {
    marginTop: 40,
    textAlign: "center",
  },
});
