import { CardEntity } from "../Entities/CardEntity";

const henshinCard = require("../../assets/henshin-card.png");

const cards = [
  new CardEntity({
    id: "tc-001",
    name: "Henshin!",
    series: "Tokusatsu Chronicle",
    type: "Action",
    subtype: "Transform",
    cost: 1,
    power: 0,
    defense: 0,
    rarity: "Real Card",
    image: henshinCard,
    effect: "Choose 1 USER card you control. You may place 1 RIDER card from your hand on top of it.",
    rules: [
      "Escolha 1 carta USER que você controla.",
      "Você pode colocar 1 carta RIDER da sua mão sobre ela.",
      "Enquanto estiverem empilhadas, trate-as como uma única unidade."
    ],
    flavorText: "Hen...shin!"
  })
];

export const CardService = {
  getCards() {
    return cards;
  },
  getStarterDeck() {
    return [cards[0]];
  }
};
