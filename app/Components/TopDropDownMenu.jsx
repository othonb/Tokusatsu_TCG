import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HomeController } from "../Controllers/HomeController";
import { GameMenu } from "./GameMenu";

export default function TopDropDownMenu({
  title = "Tokusatsu Chronicle",
  subtitle = "Gem Comp"
}) {
  const [visible, setVisible] = useState(false);
  const items = HomeController.getMenuItems();

  return (
    <>
      <View style={styles.header}>
        <Pressable style={styles.menuButton} onPress={() => setVisible(true)}>
          <Ionicons name="menu" size={24} color="#fff4b0" />
        </Pressable>

        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      <GameMenu visible={visible} onClose={() => setVisible(false)} items={items} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10
  },
  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f6d94f",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(6, 12, 22, 0.9)"
  },
  copy: {
    flex: 1
  },
  title: {
    color: "#fff4b0",
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.4
  },
  subtitle: {
    color: "#c3cfdf",
    fontSize: 12,
    marginTop: 2
  }
});
