export function createEmptyDeckSections() {
  return {
    main: [],
    field: [],
    commander: []
  };
}

export function cloneDeckSections(deck) {
  const safeDeck = deck ?? createEmptyDeckSections();

  return {
    main: (safeDeck.main ?? []).map((entry) => ({ ...entry })),
    field: (safeDeck.field ?? []).map((entry) => ({ ...entry })),
    commander: (safeDeck.commander ?? []).map((entry) => ({ ...entry }))
  };
}

export class DeckEntity {
  constructor({ id, ownerUserId, name, createdAt, updatedAt, deck }) {
    this.id = id;
    this.ownerUserId = ownerUserId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deck = cloneDeckSections(deck);
  }
}

export function createDeckEntity({ ownerUserId, name }) {
  const timestamp = new Date().toISOString();

  return new DeckEntity({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ownerUserId,
    name,
    createdAt: timestamp,
    updatedAt: timestamp,
    deck: createEmptyDeckSections()
  });
}
