import { Pressable, StyleSheet, Text, View } from "react-native";

export function NeonButton({ label, subtitle, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={styles.glow} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#f6d94f",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "rgba(3, 7, 16, 0.82)",
    overflow: "hidden"
  },
  pressed: {
    transform: [{ scale: 0.985 }]
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(246, 217, 79, 0.08)"
  },
  label: {
    color: "#fff4b0",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  subtitle: {
    color: "#d4dde7",
    marginTop: 4,
    fontSize: 13
  }
});
