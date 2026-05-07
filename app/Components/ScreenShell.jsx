import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { HomeController } from "../Controllers/HomeController";
import { GameMenu } from "./GameMenu";

const background = require("../../assets/card-back.png");

export function ScreenShell({ title, subtitle, children, padded = true, showBackButton = false }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const items = HomeController.getMenuItems();

  const handleBack = () => {
    if (typeof router.canGoBack === "function" && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/home");
  };

  return (
    <ImageBackground source={background} style={styles.background} imageStyle={styles.backgroundImage}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.sideSlot}>
            {showBackButton ? (
              <Pressable style={styles.iconButton} onPress={handleBack}>
                <Ionicons name="chevron-back" size={24} color="#fff4b0" />
              </Pressable>
            ) : (
              <View style={styles.iconSpacer} />
            )}
          </View>

          <View style={styles.heading}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <View style={styles.sideSlot}>
            <Pressable style={styles.iconButton} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={24} color="#fff4b0" />
            </Pressable>
          </View>
        </View>

        <View style={[styles.content, padded && styles.padded]}>{children}</View>
      </SafeAreaView>

      <GameMenu visible={menuVisible} onClose={() => setMenuVisible(false)} items={items} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#02050a"
  },
  backgroundImage: {
    opacity: 0.34
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(1, 3, 9, 0.76)"
  },
  safeArea: {
    flex: 1
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  sideSlot: {
    width: 46,
    alignItems: "center",
    justifyContent: "center"
  },
  heading: {
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
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f6d94f",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(6, 12, 22, 0.9)"
  },
  iconSpacer: {
    width: 46,
    height: 46
  },
  content: {
    flex: 1
  },
  padded: {
    paddingHorizontal: 20,
    paddingBottom: 20
  }
});
