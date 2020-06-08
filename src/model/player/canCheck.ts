import { PokerTableState, Player } from "../../PokerTableState";
import canPlaceBet from "./canPlaceBet";

const canCheck = (table: PokerTableState, player: Player): boolean =>
  canPlaceBet(table, player, 0);

export default canCheck;
