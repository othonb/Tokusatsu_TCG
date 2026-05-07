import { useLocalSearchParams, router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { ScreenShell } from "../Components/ScreenShell";
import { useDeckBuilder } from "../Context/DeckBuilderContext";
import { DeckBuilderView } from "../View/DeckBuilderView";

export default function DeckBuilderEditorScreen() {
  const { deckId } = useLocalSearchParams();
  const { hydrated, hasActiveDeck, activeDeckId, openDeck } = useDeckBuilder();

  useEffect(() => {
    if (!hydrated || typeof deckId !== "string") {
      return;
    }

    if (activeDeckId === deckId) {
      return;
    }

    if (!openDeck(deckId)) {
      router.replace("/deckbuilder");
    }
  }, [activeDeckId, deckId, hydrated, openDeck]);

  if (!hydrated) {
    return (
      <ScreenShell title="Deckbuilder" subtitle="Carregando deck" showBackButton>
        <View>
          <Text style={{ color: "#dbe7f2" }}>Carregando deck...</Text>
        </View>
      </ScreenShell>
    );
  }

  if (!hasActiveDeck || activeDeckId !== deckId) {
    return (
      <ScreenShell title="Deckbuilder" subtitle="Deck nao encontrado" showBackButton>
        <View>
          <Text style={{ color: "#dbe7f2" }}>Este deck nao foi encontrado. Volte para a lista e escolha outro.</Text>
        </View>
      </ScreenShell>
    );
  }

  return <DeckBuilderView />;
}
