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
      lastPlayerAction.actionType === PlayerActionType.AllIn)
  ) {
    nextPlayer = getNextPlayer(table.players, nextPlayer.id);

    lastPlayerAction = table.currentRound.lastPlayerActions.find(
      ({ playerId }) => playerId === nextPlayer.id
    );
  }

  // if no player but the current one can do anything, finish the round
  if (nextPlayer.id === table.currentRound.currentPlayer) {
    return finish(table);
  }

  const bigBlind = getNextPlayer(table.players, table.dealer, 2);

  if (table.currentRound.currentPlayer === bigBlind.id) {
    const lastAction = table.currentRound.lastPlayerActions.find(
      ({ playerId }) => playerId === bigBlind.id
    );
    // if the big blind checked the option, round is over.
    if (lastAction && lastAction.actionType === PlayerActionType.Check) {
      return finish(table);
    }
  }

  if (nextPlayer.id === table.currentRound.lastPlayerToRaise) {
    const allPlayersHaveFoldedPlacedEnoughOrHaveNoChipsRemaining = table.players.every(
      (player) => {
        const lastAction = table.currentRound.lastPlayerActions.find(
          ({ playerId }) => playerId === player.id
        );

        if (lastAction && lastAction.actionType === PlayerActionType.Fold)
          return true;
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

    if (
      allPlayersHaveFoldedPlacedEnoughOrHaveNoChipsRemaining &&
      // the big blind has a check option if she was the last player to raise, i.e. everyone else called
      // so the round does not end here
      (table.currentRound.bettingRound !== BettingRoundType.PreFlop ||
        nextPlayer.id !== bigBlind.id)
    ) {
      return finish(table);
    }
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
