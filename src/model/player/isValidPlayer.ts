import { Player } from "../../PokerTableState";
import isValidSpectator from "./isValidSpectator";

const isValidPlayer = (player: Player) => {
  if (!isValidSpectator(player)) return false;
};

export default isValidPlayer;
