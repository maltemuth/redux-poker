import {
  PokerTableState,
  Player,
  Bet,
  PlayerAction,
  PlayerActionType,
  PlayerId,
} from "../../PokerTableState";
import getNextPlayer from "./getNextPlayer";

const placeBet = (
  table: PokerTableState,
  player: Player,
  amount: number
): PokerTableState => {
  const clampedAmount = Math.min(amount, player.chips);

  const newBet: Bet = table.currentRound.bets.find(
    (bet) => bet.playerId === player.id
  ) || {
    amount: 0,
    playerId: player.id,
  };

  newBet.amount += clampedAmount;

  const updatedPlayer: Player = {
    ...player,
    chips: player.chips - clampedAmount,
  };

  let newAction: PlayerAction | null = null;
  let amountNeededForCalling: number =
    table.currentRound.amountNeededForCalling;
  let lastPlayerToRaise: PlayerId = table.currentRound.lastPlayerToRaise;

  if (updatedPlayer.chips === 0) {
    newAction = {
      actionType: PlayerActionType.AllIn,
      playerId: player.id,
      betAmount: clampedAmount,
    };
  }

  if (newBet.amount > table.currentRound.amountNeededForCalling) {
    amountNeededForCalling = clampedAmount;
    lastPlayerToRaise = player.id;
    if (null === newAction) {
      newAction = {
        actionType: PlayerActionType.Raise,
        playerId: player.id,
        betAmount: clampedAmount,
      };
    }
  }

  if (newAction === null && clampedAmount === 0) {
    newAction = {
      actionType: PlayerActionType.Check,
      playerId: player.id,
      betAmount: clampedAmount,
    };
  }

  if (
    newAction === null &&
    newBet.amount === table.currentRound.amountNeededForCalling
  ) {
    newAction = {
      actionType: PlayerActionType.Call,
      playerId: player.id,
      betAmount: clampedAmount,
    };
  }

  const updatedBets = table.currentRound.bets
    .filter((bet) => bet.playerId !== player.id)
    .concat([newBet]);

  const updatedPlayers = table.players.map((otherPlayer) => {
    if (otherPlayer.id === player.id) return updatedPlayer;
    return otherPlayer;
  });

  const updatedLastActions = table.currentRound.lastPlayerActions
    .filter((action) => action.playerId !== player.id)
    .concat([newAction!]);

  const nextPlayer = getNextPlayer(table.players, player.id);

  return {
    ...table,
    players: updatedPlayers,
    currentRound: {
      ...table.currentRound,
      lastPlayerActions: updatedLastActions,
      bets: updatedBets,
      amountNeededForCalling: amountNeededForCalling,
      lastPlayerToRaise: lastPlayerToRaise,
      currentPlayer: nextPlayer.id,
    },
  };
};

export default placeBet;
