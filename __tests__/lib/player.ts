import { Player } from "../../src/PokerTableState";

const player = (number: number): Player => ({
  id: `player${number}`,
  name: `Player ${number}`,
  chips: 0,
  currentCards: [],
  wantsToShow: [],
  revealedCards: [],
  isReady: false,
  isSittingOut: false,
  wantsToSitOut: false,
  seat: number,
});

export default player;
