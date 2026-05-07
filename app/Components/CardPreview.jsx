import { Image, StyleSheet, Text, View } from "react-native";

export function CardPreview({ card }) {
  return (
    <View style={styles.card}>
      <Image source={card.image} style={styles.cardImage} resizeMode="cover" />

      <View style={styles.overlay}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.meta}>
          {card.type}
          {card.subtype ? ` | ${card.subtype}` : ""}
        </Text>

        <Text style={styles.effect}>{card.effect}</Text>

        <View style={styles.ruleBlock}>
          {card.rules?.map((rule) => (
            <Text key={rule} style={styles.ruleLine}>
              {rule}
            </Text>
          ))}
        </View>

        {card.flavorText ? <Text style={styles.flavor}>{card.flavorText}</Text> : null}

        <Text style={styles.rarity}>{card.rarity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.6)",
    backgroundColor: "rgba(4, 8, 16, 0.92)"
  },
  cardImage: {
    width: "100%",
    aspectRatio: 0.75,
    backgroundColor: "#101010"
  },
  overlay: {
    padding: 16
  },
  name: {
    color: "#fff3b0",
    fontWeight: "800",
    fontSize: 24
  },
  meta: {
    color: "#dce7f5",
    fontSize: 14,
    marginTop: 6,
    textTransform: "uppercase"
  },
  effect: {
    color: "#ecf4ff",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10
  },
  ruleBlock: {
    marginTop: 14,
    gap: 8
  },
  ruleLine: {
    color: "#d7e3f0",
    fontSize: 14,
    lineHeight: 21
  },
  flavor: {
    color: "#bfcddd",
    fontSize: 16,
    marginTop: 16,
    fontStyle: "italic",
    textAlign: "center"
  },
  rarity: {
    color: "#ff61b8",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 16,
    textTransform: "uppercase"
  }
});
