import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { ScreenShell } from "../Components/ScreenShell";
import { useDeckBuilder } from "../Context/DeckBuilderContext";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nome A-Z" },
  { value: "cost-asc", label: "Custo" },
  { value: "type-asc", label: "Tipo" }
];

const SECTION_META = [
  { key: "main", label: "Main Deck", helper: "Deck principal para iniciar a partida.", accent: "#6ea8ff" },
  { key: "field", label: "Field Deck", helper: "Cartas extras para montagem futura.", accent: "#8f77ff" },
  { key: "commander", label: "Commander Deck", helper: "Espaço reservado para líderes.", accent: "#f6d94f" }
];

function DropdownField({ label, value, options, open, onToggle, onSelect }) {
  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.headerLabel}>{label}</Text>
      <Pressable style={styles.dropdownButton} onPress={onToggle}>
        <Text style={styles.dropdownText}>{value}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color="#c8d3df" />
      </Pressable>

      {open ? (
        <View style={styles.dropdownMenu}>
          {options.map((option) => (
            <Pressable key={option.value} style={styles.dropdownItem} onPress={() => onSelect(option.value)}>
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function DeckTile({ entry, card, onRemove }) {
  return (
    <Pressable style={({ hovered, pressed }) => [styles.deckTile, hovered && styles.deckTileHovered, pressed && styles.deckTilePressed]} onPress={onRemove}>
      <Image source={card.image} style={styles.deckTileImage} resizeMode="cover" />
      <View style={styles.deckTileOverlay} />
      <View style={styles.deckTileBadge}>
        <Text style={styles.deckTileBadgeText}>x{entry.quantity}</Text>
      </View>
      <View style={styles.deckTileFooter}>
        <Text numberOfLines={1} style={styles.deckTileName}>
          {card.name}
        </Text>
        <Text style={styles.deckTileMeta}>{card.type}</Text>
      </View>
    </Pressable>
  );
}

function CatalogItem({ card, activeSectionLabel, onAdd }) {
  return (
    <Pressable style={({ hovered, pressed }) => [styles.catalogItem, hovered && styles.catalogItemHovered, pressed && styles.catalogItemPressed]} onPress={onAdd}>
      <Image source={card.image} style={styles.catalogThumb} resizeMode="cover" />

      <View style={styles.catalogCopy}>
        <Text style={styles.catalogName}>{card.name}</Text>
        <Text style={styles.catalogMeta}>{card.type}</Text>
        <Text numberOfLines={2} style={styles.catalogEffect}>
          {card.effect}
        </Text>
      </View>

      <View style={styles.catalogAction}>
        <Text style={styles.catalogActionLabel}>Adicionar</Text>
        <Text style={styles.catalogActionTarget}>{activeSectionLabel}</Text>
      </View>
    </Pressable>
  );
}

export function DeckBuilderView() {
  const { width } = useWindowDimensions();
  const {
    catalog,
    currentDeck,
    totals,
    isMainDeckReady,
    addCardToSection,
    removeCardFromSection,
    saveDeck,
    resetDeck
  } = useDeckBuilder();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [sortKey, setSortKey] = useState("name-asc");
  const [activeSection, setActiveSection] = useState("main");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [feedback, setFeedback] = useState("Monte 60 cartas no Main Deck para liberar a partida.");

  const isWide = width >= 980;
  const panelHeight = isWide ? 640 : 420;
  const catalogMap = useMemo(() => new Map(catalog.map((card) => [card.id, card])), [catalog]);

  const typeOptions = useMemo(() => {
    return [
      { value: "Todos", label: "Todos os tipos" },
      ...Array.from(new Set(catalog.map((card) => card.type))).map((type) => ({ value: type, label: type }))
    ];
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const nextCatalog = catalog.filter((card) => {
      const matchesQuery = !query || card.name.toLowerCase().includes(query);
      const matchesType = typeFilter === "Todos" || card.type === typeFilter;
      return matchesQuery && matchesType;
    });

    return [...nextCatalog].sort((left, right) => {
      if (sortKey === "cost-asc") {
        return left.cost - right.cost || left.name.localeCompare(right.name);
      }

      if (sortKey === "type-asc") {
        return left.type.localeCompare(right.type) || left.name.localeCompare(right.name);
      }

      return left.name.localeCompare(right.name);
    });
  }, [catalog, searchQuery, sortKey, typeFilter]);

  const currentSectionLabel = SECTION_META.find((section) => section.key === activeSection)?.label ?? "Main Deck";

  const handleAddCard = (cardId) => {
    if (activeSection === "main" && totals.main >= 60) {
      setFeedback("O Main Deck ja atingiu 60 cartas.");
      return;
    }

    addCardToSection(activeSection, cardId);
    setFeedback(`Carta adicionada em ${currentSectionLabel}.`);
  };

  const handleRemoveCard = (sectionKey, cardId) => {
    removeCardFromSection(sectionKey, cardId);
    setFeedback("Carta removida do deck.");
  };

  const handleSaveDeck = () => {
    saveDeck();
    setFeedback("Deck salvo na biblioteca.");
  };

  const handleOpenLibrary = () => {
    router.push("/deckbuilder");
  };

  const handleResetDeck = () => {
    resetDeck();
    setFeedback("Deck resetado.");
  };

  return (
    <ScreenShell title="Deckbuilder" subtitle="Construtor tatico do deck" showBackButton>
      <View style={styles.page}>
        <View style={styles.headerBar}>
          <View style={styles.searchWrap}>
            <Text style={styles.headerLabel}>Busca</Text>
            <View style={styles.searchField}>
              <Ionicons name="search" size={16} color="#c8d3df" />
              <TextInput
                placeholder="Nome da carta"
                placeholderTextColor="#7f8b97"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>
          </View>

          <DropdownField
            label="Card Type"
            value={typeFilter}
            options={typeOptions}
            open={openDropdown === "type"}
            onToggle={() => setOpenDropdown((current) => (current === "type" ? null : "type"))}
            onSelect={(value) => {
              setTypeFilter(value);
              setOpenDropdown(null);
            }}
          />

          <DropdownField
            label="Ordenação"
            value={SORT_OPTIONS.find((option) => option.value === sortKey)?.label ?? "Nome A-Z"}
            options={SORT_OPTIONS}
            open={openDropdown === "sort"}
            onToggle={() => setOpenDropdown((current) => (current === "sort" ? null : "sort"))}
            onSelect={(value) => {
              setSortKey(value);
              setOpenDropdown(null);
            }}
          />

          <View style={styles.actionsWrap}>
            <Pressable style={styles.headerAction} onPress={handleSaveDeck}>
              <Text style={styles.headerActionText}>Salvar deck</Text>
            </Pressable>

            <Pressable style={styles.headerAction} onPress={handleOpenLibrary}>
              <Text style={styles.headerActionText}>Biblioteca</Text>
            </Pressable>

            <Pressable style={[styles.headerAction, styles.headerActionWarn]} onPress={handleResetDeck}>
              <Text style={styles.headerActionText}>Resetar</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusPill, isMainDeckReady ? styles.statusPillReady : styles.statusPillPending]}>
            <Text style={styles.statusPillText}>Main Deck {totals.main}/60</Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Field {totals.field}</Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Commander {totals.commander}</Text>
          </View>

          <View style={styles.feedbackPill}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        </View>

        <View style={[styles.builderBody, isWide ? styles.builderBodyWide : styles.builderBodyStack]}>
          <View style={[styles.catalogPanel, { maxHeight: panelHeight }]}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>Lista de Cartas</Text>
                <Text style={styles.panelSubtitle}>{filteredCatalog.length} resultado(s)</Text>
              </View>
              <View style={styles.targetPill}>
                <Text style={styles.targetPillText}>Destino: {currentSectionLabel}</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.catalogList}>
              {filteredCatalog.map((card) => (
                <CatalogItem key={card.id} card={card} activeSectionLabel={currentSectionLabel} onAdd={() => handleAddCard(card.id)} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.deckPanel}>
            <View style={styles.deckPanelHeader}>
              <View>
                <Text style={styles.panelTitle}>Area do Deck</Text>
                <Text style={styles.panelSubtitle}>Clique numa seção para definir onde a carta entra.</Text>
              </View>
              <Text style={styles.deckRequirement}>A partida só libera com 60 cartas no Main Deck.</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: panelHeight }} contentContainerStyle={styles.deckSections}>
              {SECTION_META.map((section) => {
                const entries = currentDeck[section.key];
                const count = totals[section.key];

                return (
                  <View key={section.key} style={[styles.deckSection, activeSection === section.key && styles.deckSectionActive]}>
                    <Pressable style={styles.deckSectionHeader} onPress={() => setActiveSection(section.key)}>
                      <View>
                        <Text style={styles.deckSectionTitle}>{section.label}</Text>
                        <Text style={styles.deckSectionSubtitle}>{section.helper}</Text>
                      </View>

                      <View style={[styles.countBadge, { borderColor: section.accent }]}>
                        <Text style={[styles.countBadgeText, { color: section.accent }]}>{count}</Text>
                      </View>
                    </Pressable>

                    {entries.length ? (
                      <View style={styles.deckGrid}>
                        {entries.map((entry) => {
                          const card = catalogMap.get(entry.cardId);

                          if (!card) {
                            return null;
                          }

                          return (
                            <DeckTile key={`${section.key}-${entry.cardId}`} entry={entry} card={card} onRemove={() => handleRemoveCard(section.key, entry.cardId)} />
                          );
                        })}
                      </View>
                    ) : (
                      <View style={styles.emptyDeckState}>
                        <Text style={styles.emptyDeckText}>Nenhuma carta nesta seção ainda.</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
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
  headerBar: {
    zIndex: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#1e1e1e",
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  searchWrap: {
    flex: 1,
    minWidth: 220
  },
  headerLabel: {
    color: "#cbd5df",
    fontSize: 12,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  searchField: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#262626",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14
  },
  dropdownWrap: {
    minWidth: 170,
    zIndex: 30
  },
  dropdownButton: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#262626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12
  },
  dropdownText: {
    color: "#eef4fb",
    fontSize: 14
  },
  dropdownMenu: {
    position: "absolute",
    top: 78,
    left: 0,
    right: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#22262d",
    overflow: "hidden"
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  dropdownItemText: {
    color: "#eef4fb"
  },
  actionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "flex-end"
  },
  headerAction: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: "#3049ff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "center"
  },
  headerActionWarn: {
    backgroundColor: "#8a2c40"
  },
  headerActionDisabled: {
    opacity: 0.45
  },
  headerActionText: {
    color: "#ffffff",
    fontWeight: "800"
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center"
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#171a21",
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  statusPillReady: {
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(7, 61, 73, 0.35)"
  },
  statusPillPending: {
    borderColor: "#f6d94f",
    backgroundColor: "rgba(92, 69, 8, 0.3)"
  },
  statusPillText: {
    color: "#eef4fb",
    fontWeight: "700"
  },
  feedbackPill: {
    flex: 1,
    minWidth: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(11, 18, 30, 0.82)",
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  feedbackText: {
    color: "#cfdbe7",
    fontSize: 13
  },
  builderBody: {
    flex: 1,
    gap: 16
  },
  builderBodyWide: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  builderBodyStack: {
    flexDirection: "column"
  },
  catalogPanel: {
    flexBasis: 320,
    flexGrow: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#2a2a2a",
    padding: 16
  },
  deckPanel: {
    flex: 2,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#181818",
    padding: 16
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14
  },
  panelTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900"
  },
  panelSubtitle: {
    color: "#aeb9c5",
    marginTop: 4,
    fontSize: 12
  },
  targetPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(92, 242, 255, 0.45)",
    backgroundColor: "rgba(20, 60, 66, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  targetPillText: {
    color: "#dffcff",
    fontWeight: "700",
    fontSize: 12
  },
  catalogList: {
    gap: 12,
    paddingBottom: 8
  },
  catalogItem: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#22262d",
    padding: 12
  },
  catalogItemHovered: {
    borderColor: "#5cf2ff",
    backgroundColor: "#283342"
  },
  catalogItemPressed: {
    transform: [{ scale: 0.99 }]
  },
  catalogThumb: {
    width: 54,
    height: 76,
    borderRadius: 10,
    backgroundColor: "#111827"
  },
  catalogCopy: {
    flex: 1
  },
  catalogName: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16
  },
  catalogMeta: {
    color: "#9fd1ff",
    fontSize: 12,
    textTransform: "uppercase",
    marginTop: 4
  },
  catalogEffect: {
    color: "#c4d0dc",
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18
  },
  catalogAction: {
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  catalogActionLabel: {
    color: "#f6d94f",
    fontWeight: "800",
    fontSize: 12
  },
  catalogActionTarget: {
    color: "#aab7c3",
    fontSize: 11
  },
  deckPanelHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14
  },
  deckRequirement: {
    color: "#f6d94f",
    fontSize: 12,
    maxWidth: 260,
    lineHeight: 18
  },
  deckSections: {
    gap: 16,
    paddingBottom: 8
  },
  deckSection: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#202020",
    padding: 14
  },
  deckSectionActive: {
    borderColor: "#5cf2ff",
    shadowColor: "#5cf2ff",
    shadowOpacity: 0.18,
    shadowRadius: 16
  },
  deckSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14
  },
  deckSectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  },
  deckSectionSubtitle: {
    color: "#aeb9c5",
    fontSize: 12,
    marginTop: 4
  },
  countBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212"
  },
  countBadgeText: {
    fontSize: 16,
    fontWeight: "900"
  },
  deckGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  deckTile: {
    width: 112,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#111827"
  },
  deckTileHovered: {
    borderColor: "#f6d94f"
  },
  deckTilePressed: {
    transform: [{ scale: 0.985 }]
  },
  deckTileImage: {
    width: "100%",
    height: 126
  },
  deckTileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 12, 20, 0.18)"
  },
  deckTileBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 999,
    backgroundColor: "rgba(10, 14, 22, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  deckTileBadgeText: {
    color: "#fff4b0",
    fontWeight: "900",
    fontSize: 12
  },
  deckTileFooter: {
    padding: 10
  },
  deckTileName: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13
  },
  deckTileMeta: {
    color: "#a8b4c2",
    fontSize: 11,
    marginTop: 4
  },
  emptyDeckState: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 18
  },
  emptyDeckText: {
    color: "#bfcad6"
  }
});
