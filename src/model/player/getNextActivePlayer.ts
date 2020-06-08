import { PokerTableState, PlayerId, Player } from "../../PokerTableState";
import getActivePlayers from "./getActivePlayers";
import getNextPlayer from "./getNextPlayer";

const getNextActivePlayer = (
  table: PokerTableState,
  currentId: PlayerId
): Player => getNextPlayer(getActivePlayers(table), currentId);

export default getNextActivePlayer;
