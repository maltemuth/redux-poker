import { PokerTableState, Player } from "../../PokerTableState";

const getActivePlayers = (table: PokerTableState): Player[] =>
  table.players.filter(({ isSittingOut }) => !isSittingOut);

export default getActivePlayers;
