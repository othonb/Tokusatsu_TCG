import { CardService } from "../Service/CardService";

export const DeckBuilderController = {
  getCatalog() {
    return CardService.getCards();
  },
  getStarterDeck() {
    return CardService.getStarterDeck();
  }
};
