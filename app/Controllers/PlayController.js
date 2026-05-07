import { DeckBuilderController } from "./DeckBuilderController";

const STARTING_LIFE = 12;
const STARTING_HAND = 3;
const MAX_ENERGY = 5;
const DEFAULT_DECK_SIZE = 60;
const LOG_LIMIT = 6;

function shuffle(cards) {
  const nextCards = [...cards];

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = nextCards[index];

    nextCards[index] = nextCards[swapIndex];
    nextCards[swapIndex] = current;
  }

  return nextCards;
}

function addLog(logs, message) {
  return [message, ...logs].slice(0, LOG_LIMIT);
}

function buildFallbackDeck(size) {
  const starterDeck = DeckBuilderController.getStarterDeck();
  const catalog = DeckBuilderController.getCatalog();
  const source = starterDeck.length ? starterDeck : catalog;

  return Array.from({ length: size }, (_, index) => source[index % source.length]);
}

function cloneDeck(cards, prefix) {
  return shuffle(
    cards.map((card, index) => ({
      ...card,
      battleId: `${prefix}-${card.id}-${index + 1}`
    }))
  );
}

function drawCards(deck, amount) {
  return {
    drawn: deck.slice(0, amount),
    remainingDeck: deck.slice(amount)
  };
}

function drawForSide(state, side) {
  const deckKey = side === "player" ? "playerDeck" : "opponentDeck";
  const handKey = side === "player" ? "playerHand" : "opponentHand";
  const actor = side === "player" ? "Você" : "Oponente";
  const deck = state[deckKey];

  if (!deck.length) {
    return {
      ...state,
      battleLog: addLog(state.battleLog, `${actor} tentou comprar, mas o deck acabou.`)
    };
  }

  const [drawnCard, ...remainingDeck] = deck;

  return {
    ...state,
    [deckKey]: remainingDeck,
    [handKey]: [...state[handKey], drawnCard],
    battleLog: addLog(state.battleLog, `${actor} comprou 1 carta.`)
  };
}

function finalizeBattle(state) {
  if (state.playerLife <= 0 && state.opponentLife <= 0) {
    return {
      ...state,
      status: "finished",
      winner: "draw",
      phaseLabel: "Empate tecnico",
      battleLog: addLog(state.battleLog, "As duas equipes ficaram sem vida ao mesmo tempo.")
    };
  }

  if (state.opponentLife <= 0) {
    return {
      ...state,
      status: "finished",
      winner: "player",
      phaseLabel: "Vitoria",
      battleLog: addLog(state.battleLog, "Você venceu a partida.")
    };
  }

  if (state.playerLife <= 0) {
    return {
      ...state,
      status: "finished",
      winner: "opponent",
      phaseLabel: "Derrota",
      battleLog: addLog(state.battleLog, "O oponente venceu a partida.")
    };
  }

  return state;
}

export function getCardImpact(card) {
  return Math.max(card.power || 0, (card.cost || 0) + 1);
}

export function createBattleState(playerDeckCards = []) {
  const deckSize = playerDeckCards.length || DEFAULT_DECK_SIZE;
  const playerDeckSource = playerDeckCards.length ? playerDeckCards : buildFallbackDeck(deckSize);
  const opponentDeckSource = buildFallbackDeck(deckSize);
  const playerDeck = cloneDeck(playerDeckSource, "player");
  const opponentDeck = cloneDeck(opponentDeckSource, "opponent");
  const playerDraw = drawCards(playerDeck, STARTING_HAND);
  const opponentDraw = drawCards(opponentDeck, STARTING_HAND);

  return {
    status: "active",
    winner: null,
    turnNumber: 1,
    phaseLabel: "Sua fase principal",
    playerLife: STARTING_LIFE,
    opponentLife: STARTING_LIFE,
    playerEnergy: 1,
    opponentEnergy: 0,
    playerDeck: playerDraw.remainingDeck,
    opponentDeck: opponentDraw.remainingDeck,
    playerHand: playerDraw.drawn,
    opponentHand: opponentDraw.drawn,
    playerDiscard: [],
    opponentDiscard: [],
    playerLastCard: null,
    opponentLastCard: null,
    battleLog: [
      "Partida iniciada com Main Deck valido de 60 cartas.",
      "Cartas sem tags de efeito causam impacto direto neste prototipo."
    ]
  };
}

function playCard(state, side, battleId) {
  if (state.status !== "active") {
    return state;
  }

  const handKey = side === "player" ? "playerHand" : "opponentHand";
  const energyKey = side === "player" ? "playerEnergy" : "opponentEnergy";
  const discardKey = side === "player" ? "playerDiscard" : "opponentDiscard";
  const lastCardKey = side === "player" ? "playerLastCard" : "opponentLastCard";
  const targetLifeKey = side === "player" ? "opponentLife" : "playerLife";
  const actor = side === "player" ? "Você" : "Oponente";
  const hand = state[handKey];
  const cardIndex = hand.findIndex((card) => card.battleId === battleId);

  if (cardIndex === -1) {
    return state;
  }

  const card = hand[cardIndex];

  if (card.cost > state[energyKey]) {
    if (side === "player") {
      return {
        ...state,
        battleLog: addLog(state.battleLog, `Energia insuficiente para usar ${card.name}.`)
      };
    }

    return state;
  }

  const impact = getCardImpact(card);
  const nextHand = hand.filter((_, index) => index !== cardIndex);
  const nextState = {
    ...state,
    [handKey]: nextHand,
    [energyKey]: state[energyKey] - card.cost,
    [discardKey]: [card, ...state[discardKey]],
    [lastCardKey]: card,
    [targetLifeKey]: Math.max(0, state[targetLifeKey] - impact),
    battleLog: addLog(state.battleLog, `${actor} jogou ${card.name} e causou ${impact} de impacto direto.`)
  };

  return finalizeBattle(nextState);
}

function runOpponentTurn(state) {
  let nextState = {
    ...state,
    phaseLabel: "Turno do oponente",
    opponentEnergy: Math.min(state.turnNumber, MAX_ENERGY),
    battleLog: addLog(
      state.battleLog,
      `Turno ${state.turnNumber}: oponente recebeu ${Math.min(state.turnNumber, MAX_ENERGY)} de energia.`
    )
  };

  nextState = drawForSide(nextState, "opponent");

  let actions = 0;

  while (nextState.status === "active") {
    const playableCard = nextState.opponentHand.find((card) => card.cost <= nextState.opponentEnergy);

    if (!playableCard) {
      break;
    }

    nextState = playCard(nextState, "opponent", playableCard.battleId);
    actions += 1;
  }

  if (nextState.status !== "active") {
    return nextState;
  }

  if (!actions) {
    nextState = {
      ...nextState,
      battleLog: addLog(nextState.battleLog, "Oponente encerrou o turno sem jogar carta.")
    };
  }

  return nextState;
}

function startPlayerTurn(state) {
  const nextTurn = state.turnNumber + 1;
  let nextState = {
    ...state,
    turnNumber: nextTurn,
    phaseLabel: "Sua fase principal",
    playerEnergy: Math.min(nextTurn, MAX_ENERGY),
    opponentEnergy: 0,
    battleLog: addLog(
      state.battleLog,
      `Turno ${nextTurn}: você recebeu ${Math.min(nextTurn, MAX_ENERGY)} de energia.`
    )
  };

  nextState = drawForSide(nextState, "player");
  return nextState;
}

export function playPlayerCard(state, battleId) {
  return playCard(state, "player", battleId);
}

export function endPlayerTurn(state) {
  if (state.status !== "active") {
    return state;
  }

  let nextState = {
    ...state,
    battleLog: addLog(state.battleLog, "Você encerrou o turno.")
  };

  nextState = runOpponentTurn(nextState);

  if (nextState.status !== "active") {
    return nextState;
  }

  return startPlayerTurn(nextState);
}
