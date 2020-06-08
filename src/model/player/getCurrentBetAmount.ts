import { PokerTableState, Player } from "../../PokerTableState";

const getCurrentBetAmount = (
  table: PokerTableState,
  player: Player
): number => {
  const currentBet = table.currentRound.bets.find(
    (bet) => bet.playerId === player.id
  );
  const currentAmount = currentBet ? currentBet.amount : 0;

  return currentAmount;
};

export default getCurrentBetAmount;
