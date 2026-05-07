import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DeckBuilderController } from "../Controllers/DeckBuilderController";
import { DeckEntity, cloneDeckSections, createDeckEntity } from "../Entities/DeckEntity";

const DeckBuilderContext = createContext(null);
const STORAGE_KEY = "tokusatsu-chronicle.deckbuilder";
const LEGACY_STORAGE_KEY = "tokusatsu-chronicle.deckbuilder.legacy";
const DEFAULT_DECK_NAME = "Deck inicial";

function createEmptyDeck() {
  return {
    main: [],
    field: [],
    commander: []
  };
}

function getStorage() {
  if (typeof globalThis === "undefined" || !globalThis.localStorage) {
    return null;
  }

  return globalThis.localStorage;
}

function getSectionCount(sectionEntries = []) {
  return sectionEntries.reduce((total, entry) => total + entry.quantity, 0);
}

function sanitizeDeckEntity(deck, fallbackIndex = 0) {
  if (!deck) {
    return null;
  }

  const timestamp = new Date().toISOString();

  return new DeckEntity({
    id: deck.id || `${Date.now()}-${fallbackIndex}`,
    ownerUserId: deck.ownerUserId ?? null,
    name: deck.name?.trim() || `${DEFAULT_DECK_NAME} ${fallbackIndex + 1}`,
    createdAt: deck.createdAt || timestamp,
    updatedAt: deck.updatedAt || timestamp,
    deck: cloneDeckSections(deck.deck)
  });
}

function createStarterDeckFromLegacy(parsed) {
  const legacyDeck = parsed?.currentDeck || parsed?.savedDeck;

  if (!legacyDeck) {
    return null;
  }

  const timestamp = new Date().toISOString();

  return new DeckEntity({
    id: "starter-deck",
    ownerUserId: null,
    name: DEFAULT_DECK_NAME,
    createdAt: timestamp,
    updatedAt: timestamp,
    deck: cloneDeckSections(legacyDeck)
  });
}

function createDefaultDeck() {
  return createDeckEntity({
    ownerUserId: null,
    name: DEFAULT_DECK_NAME
  });
}

function updateDeckById(decks, deckId, updater) {
  return decks.map((deck) => {
    if (deck.id !== deckId) {
      return deck;
    }

    const updatedDeck = updater(deck);
    return new DeckEntity({
      ...updatedDeck,
      updatedAt: new Date().toISOString()
    });
  });
}

export function DeckBuilderProvider({ children }) {
  const catalog = useMemo(() => DeckBuilderController.getCatalog(), []);
  const cardMap = useMemo(() => new Map(catalog.map((card) => [card.id, card])), [catalog]);

  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storage = getStorage();

    if (!storage) {
      const defaultDeck = createDefaultDeck();
      setDecks([defaultDeck]);
      setActiveDeckId(defaultDeck.id);
      setHydrated(true);
      return;
    }

    try {
      const raw = storage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const storedDecks = Array.isArray(parsed?.decks)
        ? parsed.decks.map(sanitizeDeckEntity).filter(Boolean)
        : [];

      if (storedDecks.length) {
        setDecks(storedDecks);
        setActiveDeckId(
          storedDecks.some((deck) => deck.id === parsed.activeDeckId)
            ? parsed.activeDeckId
            : storedDecks[0].id
        );
        return;
      }

      const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY) || storage.getItem(STORAGE_KEY);
      const legacyDeck = legacyRaw ? createStarterDeckFromLegacy(JSON.parse(legacyRaw)) : null;
      const defaultDeck = legacyDeck || createDefaultDeck();

      setDecks([defaultDeck]);
      setActiveDeckId(defaultDeck.id);
    } catch {
      const defaultDeck = createDefaultDeck();
      setDecks([defaultDeck]);
      setActiveDeckId(defaultDeck.id);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const storage = getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeDeckId,
          decks
        })
      );
    } catch {
      // O deck ativo permanece em memoria mesmo se o navegador bloquear storage.
    }
  }, [activeDeckId, decks, hydrated]);

  const activeDeck = useMemo(() => {
    return decks.find((deck) => deck.id === activeDeckId) ?? decks[0] ?? null;
  }, [activeDeckId, decks]);

  const currentDeck = activeDeck?.deck ?? createEmptyDeck();

  const totals = useMemo(() => {
    return {
      main: getSectionCount(currentDeck.main),
      field: getSectionCount(currentDeck.field),
      commander: getSectionCount(currentDeck.commander)
    };
  }, [currentDeck]);

  const expandedSections = useMemo(() => {
    const expand = (sectionEntries) => {
      return sectionEntries.flatMap((entry) => {
        const card = cardMap.get(entry.cardId);

        if (!card) {
          return [];
        }

        return Array.from({ length: entry.quantity }, () => card);
      });
    };

    return {
      main: expand(currentDeck.main),
      field: expand(currentDeck.field),
      commander: expand(currentDeck.commander)
    };
  }, [cardMap, currentDeck]);

  const createDeck = (name) => {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return null;
    }

    const nextDeck = createDeckEntity({
      ownerUserId: null,
      name: trimmedName
    });

    setDecks((current) => [...current, nextDeck]);
    setActiveDeckId(nextDeck.id);
    return nextDeck.id;
  };

  const openDeck = (deckId) => {
    const deckExists = decks.some((deck) => deck.id === deckId);

    if (!deckExists) {
      return false;
    }

    setActiveDeckId(deckId);
    return true;
  };

  const deleteDeck = (deckId) => {
    setDecks((current) => {
      const nextDecks = current.filter((deck) => deck.id !== deckId);

      if (!nextDecks.length) {
        const defaultDeck = createDefaultDeck();
        setActiveDeckId(defaultDeck.id);
        return [defaultDeck];
      }

      if (activeDeckId === deckId) {
        setActiveDeckId(nextDecks[0].id);
      }

      return nextDecks;
    });
  };

  const renameDeck = (deckId, name) => {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return false;
    }

    setDecks((current) =>
      updateDeckById(current, deckId, (deck) => ({
        ...deck,
        name: trimmedName
      }))
    );

    return true;
  };

  const updateActiveDeckSections = (updater) => {
    if (!activeDeck) {
      return false;
    }

    setDecks((current) =>
      updateDeckById(current, activeDeck.id, (deck) => ({
        ...deck,
        deck: updater(cloneDeckSections(deck.deck))
      }))
    );

    return true;
  };

  const addCardToSection = (section, cardId) => {
    let added = false;

    updateActiveDeckSections((deck) => {
      const entries = deck[section];

      if (!entries) {
        return deck;
      }

      if (section === "main" && getSectionCount(entries) >= 60) {
        return deck;
      }

      const existing = entries.find((entry) => entry.cardId === cardId);

      if (existing) {
        existing.quantity += 1;
      } else {
        entries.push({ cardId, quantity: 1 });
      }

      added = true;
      return deck;
    });

    return added;
  };

  const removeCardFromSection = (section, cardId) => {
    let removed = false;

    updateActiveDeckSections((deck) => {
      const entries = deck[section];

      if (!entries) {
        return deck;
      }

      const existing = entries.find((entry) => entry.cardId === cardId);

      if (!existing) {
        return deck;
      }

      existing.quantity -= 1;

      if (existing.quantity <= 0) {
        deck[section] = entries.filter((entry) => entry.cardId !== cardId);
      }

      removed = true;
      return deck;
    });

    return removed;
  };

  const resetDeck = () => {
    return updateActiveDeckSections(() => createEmptyDeck());
  };

  const saveDeck = () => Boolean(activeDeck);
  const loadDeck = () => Boolean(activeDeck);

  return (
    <DeckBuilderContext.Provider
      value={{
        activeDeck,
        activeDeckId,
        addCardToSection,
        catalog,
        createDeck,
        currentDeck,
        decks,
        deleteDeck,
        expandedSections,
        hasActiveDeck: Boolean(activeDeck),
        hasSavedDeck: Boolean(activeDeck),
        hydrated,
        isMainDeckReady: totals.main === 60,
        loadDeck,
        openDeck,
        removeCardFromSection,
        renameDeck,
        resetDeck,
        saveDeck,
        totals
      }}
    >
      {children}
    </DeckBuilderContext.Provider>
  );
}

export function useDeckBuilder() {
  const context = useContext(DeckBuilderContext);

  if (!context) {
    throw new Error("useDeckBuilder must be used inside DeckBuilderProvider.");
  }

  return context;
}
