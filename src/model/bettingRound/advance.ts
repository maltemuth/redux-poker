import {
  PokerTableState,
  BettingRoundType,
  PlayerActionType,
} from "../../PokerTableState";
import getNextPlayer from "../player/getNextPlayer";
import finish from "./finish";

const advance = (table: PokerTableState): PokerTableState => {
  // check if this is already finished

  let nextPlayer = getNextPlayer(
    table.players,
    table.currentRound.currentPlayer
  );

  let lastPlayerAction = table.currentRound.lastPlayerActions.find(
    ({ playerId }) => playerId === nextPlayer.id
  );

  while (
    lastPlayerAction &&
    (lastPlayerAction.actionType === PlayerActionType.Fold ||
      lastPlayerAction?.actionType === PlayerActionType.Raise)
  ) {
    nextPlayer = getNextPlayer(table.players, nextPlayer.id);

    lastPlayerAction = table.currentRound.lastPlayerActions.find(
      ({ playerId }) => playerId === nextPlayer.id
    );
  }

  if (nextPlayer.id === table.currentRound.lastPlayerToRaise) {
    const allPlayersHavePlacedEnoughOrHaveNoChipsRemaining = table.players.every(
      (player) => {
        const playerBet = table.currentRound.bets.find(
          (bet) => bet.playerId === player.id
        );
        if (!playerBet) return false;
        return (
          playerBet.amount === table.currentRound.amountNeededForCalling ||
          player.chips === 0
        );
      }
    );

    if (allPlayersHavePlacedEnoughOrHaveNoChipsRemaining) return finish(table);
  }

  return {
    ...table,
    currentRound: {
      ...table.currentRound,
      currentPlayer: nextPlayer.id,
    },
  };
};

export default advance;