import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { NeonButton } from "../Components/NeonButton";
import { ScreenShell } from "../Components/ScreenShell";

const hero = require("../../assets/home-hero.png");

export function HomeView() {
  return (
    <ScreenShell title="Tokusatsu Chronicle" subtitle="Gem Comp" padded={false}>
      <ImageBackground 
        source={hero} 
        style={styles.background} 
        resizeMode="cover"
        accessibilityLabel="Herói do Tokusatsu Chronicle em destaque"
      >
        <View style={styles.overlay}>
          
          <View style={styles.actions}>
            <Text style={styles.caption}>Escolha seu próximo passo</Text>
            
            <View style={styles.buttons}>
              <NeonButton 
                label="Jogar" 
                subtitle="Entrar em uma partida temática"
                icon="sword-cross"
                glowColor="#00e5ff" // Ciano/Azul Elétrico
                onPress={() => router.push("/play")} 
              />
              <NeonButton 
                label="Configuração" 
                subtitle="Ajustar áudio, tema e preferências"
                icon="cog-outline"
                glowColor="#ff8c00" // Laranja/Bronze Mecânico
                onPress={() => router.push("/settings")} 
              />
              <NeonButton 
                label="Deckbuilder" 
                subtitle="Montar, revisar e testar seu deck"
                icon="cards-playing-outline"
                glowColor="#b100e8" // Roxo Místico
                onPress={() => router.push("/deckbuilder")} 
              />
            </View>
          </View>

        </View>
      </ImageBackground>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)", 
    justifyContent: "flex-end", 
    paddingHorizontal: 18,
    paddingBottom: 48, 
  },
  actions: {
    width: "100%",
  },
  caption: {
    color: "#d4dde7",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(4, 8, 16, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.6)",
    overflow: "hidden",
    textShadowColor: "rgba(246, 217, 79, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  buttons: {
    gap: 16, 
  }
});
