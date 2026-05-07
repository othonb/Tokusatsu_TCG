import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export function GameMenu({ visible, onClose, items }) {
  const navigate = (route) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.menuCard}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff4b0" />
            </Pressable>
          </View>
          {items.map((item) => (
            <Pressable key={item.route} style={styles.item} onPress={() => navigate(item.route)}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 78,
    paddingRight: 16
  },
  menuCard: {
    width: 250,
    backgroundColor: "#070d17",
    borderWidth: 1,
    borderColor: "#f6d94f",
    borderRadius: 20,
    padding: 16
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  menuTitle: {
    color: "#fff4b0",
    fontSize: 22,
    fontWeight: "800"
  },
  item: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginTop: 10
  },
  itemLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  itemSubtitle: {
    color: "#b5c0cd",
    fontSize: 12,
    marginTop: 2
  }
});
