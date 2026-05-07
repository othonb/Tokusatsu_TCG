import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenShell } from "../Components/ScreenShell";
import { useDeckBuilder } from "../Context/DeckBuilderContext";

function DeckCard({ deck, onOpen, onDelete, onRename }) {
  const mainCount = deck.deck.main.reduce((total, entry) => total + entry.quantity, 0);
  const fieldCount = deck.deck.field.reduce((total, entry) => total + entry.quantity, 0);
  const commanderCount = deck.deck.commander.reduce((total, entry) => total + entry.quantity, 0);
  const [draftName, setDraftName] = useState(deck.name);

  const handleRename = () => {
    onRename(draftName);
  };

  return (
    <View style={styles.deckCard}>
      <View style={styles.deckCardTop}>
        <View style={styles.deckInfo}>
          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            placeholder="Nome do deck"
            placeholderTextColor="#7f8b97"
            style={styles.deckNameInput}
          />
          <Text style={styles.deckDate}>Atualizado em {new Date(deck.updatedAt).toLocaleDateString("pt-BR")}</Text>
        </View>

        <View style={[styles.readyPill, mainCount === 60 ? styles.readyPillOn : styles.readyPillOff]}>
          <Text style={styles.readyPillText}>{mainCount === 60 ? "Pronto" : `${mainCount}/60`}</Text>
        </View>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>Main {mainCount}</Text>
        <Text style={styles.countText}>Field {fieldCount}</Text>
        <Text style={styles.countText}>Comander {commanderCount}</Text>
      </View>

      <View style={styles.cardActions}>
        <Pressable style={styles.primaryButton} onPress={onOpen}>
          <Text style={styles.primaryButtonText}>Abrir builder</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleRename}>
          <Text style={styles.secondaryButtonText}>Renomear</Text>
        </Pressable>

        <Pressable style={styles.dangerButton} onPress={onDelete}>
          <Text style={styles.dangerButtonText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function DeckLibraryView() {
  const { decks, createDeck, deleteDeck, hydrated, openDeck, renameDeck } = useDeckBuilder();
  const [deckName, setDeckName] = useState("");

  const handleCreateDeck = () => {
    const deckId = createDeck(deckName);

    if (!deckId) {
      return;
    }

    setDeckName("");
    router.push(`/deckbuilder-editor/${deckId}`);
  };

  const handleOpenDeck = (deckId) => {
    openDeck(deckId);
    router.push(`/deckbuilder-editor/${deckId}`);
  };

  return (
    <ScreenShell title="Deckbuilder" subtitle="Biblioteca de decks" showBackButton>
      <View style={styles.page}>
        <View style={styles.createCard}>
          <Text style={styles.sectionTitle}>Criar novo deck</Text>
          <Text style={styles.sectionText}>Escolha um nome e entre direto no builder para montar ou editar.</Text>

          <View style={styles.createRow}>
            <TextInput
              value={deckName}
              onChangeText={setDeckName}
              placeholder="Nome do deck"
              placeholderTextColor="#7f8b97"
              style={styles.input}
            />

            <Pressable style={styles.primaryButton} onPress={handleCreateDeck}>
              <Text style={styles.primaryButtonText}>Criar deck</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Lista de decks</Text>
            <Text style={styles.sectionText}>{decks.length} deck(s) salvos</Text>
          </View>

          {!hydrated ? (
            <Text style={styles.emptyText}>Carregando decks...</Text>
          ) : decks.length ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.deckList}>
              {decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onOpen={() => handleOpenDeck(deck.id)}
                  onRename={(nextName) => renameDeck(deck.id, nextName)}
                  onDelete={() => deleteDeck(deck.id)}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhum deck criado ainda</Text>
              <Text style={styles.emptyText}>Crie seu primeiro deck acima para entrar no builder.</Text>
            </View>
          )}
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    gap: 16
  },
  createCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.35)",
    backgroundColor: "rgba(8, 12, 20, 0.84)",
    padding: 18,
    gap: 12
  },
  listCard: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(12, 18, 28, 0.9)",
    padding: 18
  },
  listHeader: {
    marginBottom: 14
  },
  sectionTitle: {
    color: "#fff4b0",
    fontSize: 22,
    fontWeight: "900"
  },
  sectionText: {
    color: "#c6d2df",
    marginTop: 6,
    lineHeight: 20
  },
  createRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  input: {
    flex: 1,
    minWidth: 220,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    paddingHorizontal: 14
  },
  deckList: {
    gap: 12,
    paddingBottom: 8
  },
  deckCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    gap: 12
  },
  deckCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  deckInfo: {
    flex: 1
  },
  deckNameInput: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  deckDate: {
    color: "#aeb9c5",
    marginTop: 4,
    fontSize: 12
  },
  readyPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1
  },
  readyPillOn: {
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(7, 61, 73, 0.35)"
  },
  readyPillOff: {
    borderColor: "#f6d94f",
    backgroundColor: "rgba(92, 69, 8, 0.3)"
  },
  readyPillText: {
    color: "#eef4fb",
    fontWeight: "800"
  },
  countRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  countText: {
    color: "#d8e2ec"
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: "#f6d94f",
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: "#071018",
    fontWeight: "900"
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(13, 42, 49, 0.45)",
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: "#dffbff",
    fontWeight: "800"
  },
  dangerButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ff7f96",
    backgroundColor: "rgba(82, 14, 29, 0.4)",
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  dangerButtonText: {
    color: "#ffd6dc",
    fontWeight: "800"
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 18
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  },
  emptyText: {
    color: "#bfcad6",
    marginTop: 8,
    lineHeight: 20
  }
});
