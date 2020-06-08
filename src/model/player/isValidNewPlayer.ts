import { PokerTableState, Player } from "../../PokerTableState";
import isValidPlayer from "./isValidPlayer";
import seatIsValid from "./seatIsValid";
import seatIsTaken from "./seatIsTaken";

const isValidNewPlayer = (table: PokerTableState, player: Player) => {
  if (!isValidPlayer(player)) return false;

  if (!table.spectators.find(({ id }) => id === player.id)) return false;
  if (!seatIsValid(player.seat) || seatIsTaken(table, player.seat))
    return false;

  return true;
};

export default isValidNewPlayer;
