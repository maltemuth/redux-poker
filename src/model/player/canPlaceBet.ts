import { PokerTableState, Player } from "../../PokerTableState";
import getCurrentBetAmount from "./getCurrentBetAmount";

const canPlaceBet = (
  table: PokerTableState,
  player: Player,
  amount: number
) => {
  if (amount > player.chips) {
    return false;
  }

  if (amount === player.chips) {
    // players can always go all-in
    return true;
  }

  if (
    amount + getCurrentBetAmount(table, player) <
    table.currentRound.amountNeededForCalling
  ) {
    return false;
  }

  return true;
};

export default canPlaceBet;
