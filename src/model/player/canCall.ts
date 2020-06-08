import { PokerTableState, Player } from "../../PokerTableState";
import canPlaceBet from "./canPlaceBet";
import getCurrentBetAmount from "./getCurrentBetAmount";

const canCall = (table: PokerTableState, player: Player): boolean =>
  canPlaceBet(
    table,
    player,
    table.currentRound.amountNeededForCalling -
      getCurrentBetAmount(table, player)
  );

export default canCall;
