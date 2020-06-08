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
  const totalAfterBetting = amount + getCurrentBetAmount(table, player);

  if (totalAfterBetting < table.currentRound.amountNeededForCalling) {
    return false;
  }

  // needs to raise by at least the big blind
  if (
    totalAfterBetting > table.currentRound.amountNeededForCalling &&
    totalAfterBetting <
      table.currentRound.amountNeededForCalling + 2 * table.smallBlind
  )
    return false;

  return true;
};

export default canPlaceBet;
