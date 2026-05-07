import { MenuItemEntity } from "../Entities/MenuItemEntity";

export const HomeController = {
  getMenuItems() {
    return [
      new MenuItemEntity({
        label: "Home",
        route: "/home",
        subtitle: "Tela inicial"
      }),
      new MenuItemEntity({
        label: "Jogar",
        route: "/play",
        subtitle: "Abrir partida"
      }),
      new MenuItemEntity({
        label: "Deckbuilder",
        route: "/deckbuilder",
        subtitle: "Montar deck"
      }),
      new MenuItemEntity({
        label: "Configuração",
        route: "/settings",
        subtitle: "Ajustar interface"
      })
    ];
  }
};
