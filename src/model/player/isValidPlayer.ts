import { Player } from "../../PokerTableState";
import isValidSpectator from "./isValidSpectator";

const isValidPlayer = (player: Player) => {
  return isValidSpectator(player);
};

export default isValidPlayer;
